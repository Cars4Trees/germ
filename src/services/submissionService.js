import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isDemo } from '../firebase/config';
import toast from 'react-hot-toast';

// Collection name
const SUBMISSIONS_COLLECTION = 'carSubmissions';

// Demo data for when Firebase is not available
const DEMO_SUBMISSIONS = [
  {
    id: 'demo-1',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    location: { latitude: 40.7128, longitude: -74.0060, accuracy: 10 },
    description: 'Abandoned sedan near downtown area, heavily rusted',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    status: 'verified'
  },
  {
    id: 'demo-2', 
    imageUrl: 'https://images.unsplash.com/photo-1544986581-efac024faf62?w=400&h=300&fit=crop',
    location: { latitude: 40.7580, longitude: -73.9855, accuracy: 15 },
    description: 'Old pickup truck in parking lot, missing parts',
    createdAt: new Date(Date.now() - 43200000), // 12 hours ago
    status: 'pending'
  },
  {
    id: 'demo-3',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop', 
    location: { latitude: 40.7282, longitude: -73.7949, accuracy: 8 },
    description: 'Burnt car frame in empty lot',
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    status: 'verified'
  }
];

/**
 * Upload image to Firebase Storage or simulate in demo mode
 * @param {File} file - Image file to upload
 * @param {string} fileName - Custom filename
 * @returns {Promise<string>} - Download URL of uploaded image
 */
export const uploadImage = async (file, fileName) => {
  if (isDemo || !storage) {
    // Demo mode: simulate image upload
    console.log('📸 Demo mode: Simulating image upload');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload time
    
    // Create a blob URL for the demo
    const blobUrl = URL.createObjectURL(file);
    return blobUrl;
  }

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
 * Submit car data to Firestore or local storage in demo mode
 * @param {Object} submissionData - Car submission data
 * @returns {Promise<string>} - Document ID of created submission
 */
export const submitCarData = async (submissionData) => {
  if (isDemo || !db) {
    // Demo mode: save to localStorage
    console.log('💾 Demo mode: Saving to local storage');
    
    const submission = {
      id: `demo-${Date.now()}`,
      ...submissionData,
      createdAt: new Date(),
      status: 'pending'
    };
    
    // Get existing submissions from localStorage
    const existingSubmissions = JSON.parse(localStorage.getItem('cars4trees_submissions') || '[]');
    existingSubmissions.unshift(submission);
    
    // Save back to localStorage
    localStorage.setItem('cars4trees_submissions', JSON.stringify(existingSubmissions));
    
    toast.success('🌱 Car submitted! Trees will be planted soon. (Demo Mode)');
    return submission.id;
  }

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
      location: location ? {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy || null
      } : null,
      description: description.trim(),
      metadata: {
        userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timestamp: Date.now()
      }
    };
    
    // Submit to Firestore or localStorage
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
  if (isDemo || !db) {
    // Demo mode: return demo data + localStorage data
    console.log('📋 Demo mode: Loading demo submissions');
    
    const localSubmissions = JSON.parse(localStorage.getItem('cars4trees_submissions') || '[]');
    const allSubmissions = [...localSubmissions, ...DEMO_SUBMISSIONS];
    
    // Sort by date (newest first)
    allSubmissions.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB - dateA;
    });
    
    return allSubmissions;
  }

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