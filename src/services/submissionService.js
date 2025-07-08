import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import toast from 'react-hot-toast';

// Collection name
const SUBMISSIONS_COLLECTION = 'carSubmissions';

/**
 * Upload image to Firebase Storage
 * @param {File} file - Image file to upload
 * @param {string} fileName - Custom filename
 * @returns {Promise<string>} - Download URL of uploaded image
 */
export const uploadImage = async (file, fileName) => {
  try {
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${fileName}_${timestamp}.${fileExtension}`;
    
    const storageRef = ref(storage, `car-images/${uniqueFileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Submit car data to Firestore
 * @param {Object} submissionData - Car submission data
 * @returns {Promise<string>} - Document ID of created submission
 */
export const submitCarData = async (submissionData) => {
  try {
    const docRef = await addDoc(collection(db, SUBMISSIONS_COLLECTION), {
      ...submissionData,
      createdAt: serverTimestamp(),
      status: 'pending'
    });
    
    toast.success('🌱 Car submitted! Trees will be planted soon.');
    return docRef.id;
  } catch (error) {
    console.error('Error submitting car data:', error);
    toast.error('Failed to submit car. Please try again.');
    throw new Error('Failed to submit car data');
  }
};

/**
 * Complete submission process (upload image + save data)
 * @param {Object} params - Submission parameters
 * @returns {Promise<string>} - Document ID of created submission
 */
export const createSubmission = async ({ 
  imageFile, 
  location, 
  description = '', 
  userAgent = navigator.userAgent 
}) => {
  try {
    // Upload image first
    const imageUrl = await uploadImage(imageFile, 'car_submission');
    
    // Prepare submission data
    const submissionData = {
      imageUrl,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy || null
      },
      description: description.trim(),
      metadata: {
        userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timestamp: Date.now()
      }
    };
    
    // Submit to Firestore
    const docId = await submitCarData(submissionData);
    
    return docId;
  } catch (error) {
    console.error('Error creating submission:', error);
    throw error;
  }
};

/**
 * Get all car submissions for map display
 * @returns {Promise<Array>} - Array of submission objects
 */
export const getAllSubmissions = async () => {
  try {
    const q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const submissions = [];
    
    querySnapshot.forEach((doc) => {
      submissions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return submissions;
  } catch (error) {
    console.error('Error fetching submissions:', error);
    toast.error('Failed to load car submissions');
    return [];
  }
};

/**
 * Get user's current location
 * @returns {Promise<Object>} - Location object with latitude, longitude, accuracy
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // Cache for 1 minute
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let errorMessage = 'Unable to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      options
    );
  });
};