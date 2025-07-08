import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Upload, X, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Services
import { createSubmission, getCurrentLocation } from '../services/submissionService';

const PhotoCapture = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [state, setState] = useState({
    selectedImage: null,
    imagePreview: null,
    location: null,
    description: '',
    isLoadingLocation: false,
    isSubmitting: false,
    step: 'capture' // 'capture', 'location', 'details', 'submitting'
  });

  // Handle image selection
  const handleImageSelect = useCallback((event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setState(prev => ({
        ...prev,
        selectedImage: file,
        imagePreview: e.target.result,
        step: 'location'
      }));
      
      // Automatically trigger location request
      handleGetLocation();
    };
    reader.readAsDataURL(file);
  }, []);

  // Get user location
  const handleGetLocation = useCallback(async () => {
    setState(prev => ({ ...prev, isLoadingLocation: true }));
    
    try {
      const location = await getCurrentLocation();
      
      setState(prev => ({
        ...prev,
        location,
        isLoadingLocation: false,
        step: 'details'
      }));
      
      toast.success('Location captured successfully!');
    } catch (error) {
      console.error('Location error:', error);
      setState(prev => ({ ...prev, isLoadingLocation: false }));
      
      // Show specific error message
      if (error.message.includes('denied')) {
        toast.error('Location permission denied. You can still submit without location.');
      } else {
        toast.error('Could not get location. You can still submit.');
      }
      
      // Allow user to continue without location
      setState(prev => ({ ...prev, step: 'details' }));
    }
  }, []);

  // Handle description change
  const handleDescriptionChange = useCallback((event) => {
    setState(prev => ({
      ...prev,
      description: event.target.value
    }));
  }, []);

  // Submit the car data
  const handleSubmit = useCallback(async () => {
    if (!state.selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true, step: 'submitting' }));

    try {
      await createSubmission({
        imageFile: state.selectedImage,
        location: state.location,
        description: state.description
      });

      // Reset state
      setState({
        selectedImage: null,
        imagePreview: null,
        location: null,
        description: '',
        isLoadingLocation: false,
        isSubmitting: false,
        step: 'capture'
      });

      // Navigate to map to see the submission
      navigate('/map');
    } catch (error) {
      console.error('Submission error:', error);
      setState(prev => ({ ...prev, isSubmitting: false, step: 'details' }));
      toast.error('Failed to submit. Please try again.');
    }
  }, [state.selectedImage, state.location, state.description, navigate]);

  // Reset form
  const handleReset = useCallback(() => {
    setState({
      selectedImage: null,
      imagePreview: null,
      location: null,
      description: '',
      isLoadingLocation: false,
      isSubmitting: false,
      step: 'capture'
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Trigger file input
  const handleCameraClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const renderStep = () => {
    switch (state.step) {
      case 'capture':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold mb-4 text-white">
              Submit Your Junk Car
            </h2>
            <p className="text-asphalt-300 mb-8">
              Take a photo of an abandoned or junk vehicle to help plant trees
            </p>
            
            <button
              onClick={handleCameraClick}
              className="w-32 h-32 bg-gradient-to-r from-eco-600 to-eco-500 
                       rounded-full flex items-center justify-center mx-auto mb-6
                       camera-pulse hover:shadow-neon transition-all duration-300
                       transform hover:scale-110 active:scale-95 touch-manipulation"
            >
              <Camera size={48} className="text-white" />
            </button>
            
            <p className="text-asphalt-400 text-sm">
              Tap to open camera or select from gallery
            </p>
          </div>
        );

      case 'location':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold mb-4 text-white">
              Getting Location...
            </h2>
            <div className="flex items-center justify-center mb-6">
              <MapPin className="text-neon-green animate-pulse mr-2" size={24} />
              <span className="text-asphalt-300">Requesting location permission</span>
            </div>
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-asphalt-400 text-sm">
              Location helps us track impact and verify submissions
            </p>
          </div>
        );

      case 'details':
        return (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-display font-bold mb-6 text-white text-center">
              Add Details
            </h2>
            
            {/* Image Preview */}
            {state.imagePreview && (
              <div className="card mb-6">
                <img
                  src={state.imagePreview}
                  alt="Selected car"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <button
                  onClick={handleReset}
                  className="btn-ghost text-xs"
                >
                  <X size={16} className="mr-1" />
                  Change Image
                </button>
              </div>
            )}
            
            {/* Location Status */}
            <div className="card mb-6">
              <div className="flex items-center">
                <MapPin 
                  className={`mr-2 ${state.location ? 'text-neon-green' : 'text-asphalt-400'}`} 
                  size={20} 
                />
                <span className="text-sm">
                  {state.location 
                    ? 'Location captured ✓' 
                    : 'Location not available'
                  }
                </span>
              </div>
              {state.location && (
                <p className="text-xs text-asphalt-400 mt-1">
                  Lat: {state.location.latitude.toFixed(4)}, 
                  Lng: {state.location.longitude.toFixed(4)}
                </p>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-asphalt-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={state.description}
                onChange={handleDescriptionChange}
                placeholder="Describe the vehicle condition, location details, or any other relevant information..."
                className="input-field h-24 resize-none"
                maxLength={500}
              />
              <p className="text-xs text-asphalt-500 mt-1">
                {state.description.length}/500 characters
              </p>
            </div>
            
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!state.selectedImage || state.isSubmitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isSubmitting ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={20} />
                  Submit Car
                </>
              )}
            </button>
          </div>
        );

      case 'submitting':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold mb-4 text-white">
              Planting Trees...
            </h2>
            <div className="mb-6">
              <div className="w-16 h-16 bg-eco-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="text-eco-400 animate-pulse" size={32} />
              </div>
              <div className="loading-spinner mx-auto mb-4"></div>
            </div>
            <p className="text-asphalt-300 mb-2">
              Uploading your submission...
            </p>
            <p className="text-asphalt-400 text-sm">
              This helps fund urban reforestation
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageSelect}
        className="hidden"
        aria-label="Select car image"
      />
      
      {/* Main Content */}
      <div className="w-full max-w-lg">
        {renderStep()}
        
        {/* Back Button (except on capture step) */}
        {state.step !== 'capture' && state.step !== 'submitting' && (
          <div className="text-center mt-8">
            <button
              onClick={handleReset}
              className="btn-ghost"
            >
              <X size={16} className="mr-1" />
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoCapture;