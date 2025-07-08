import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { X, MapPin, Calendar, Image as ImageIcon, TreePine } from 'lucide-react';
import toast from 'react-hot-toast';

// Services
import { getAllSubmissions } from '../services/submissionService';

// Custom marker icon
const createCustomIcon = (isRecent = false) => {
  const color = isRecent ? '#39ff14' : '#22c55e';
  const size = isRecent ? 16 : 12;
  
  return divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px; 
        height: ${size}px; 
        background: ${color}; 
        border: 2px solid #fff;
        border-radius: 50%; 
        box-shadow: 0 0 10px ${color}50;
        animation: ${isRecent ? 'pulse 2s infinite' : 'none'};
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

// Modal Component for submission details
const SubmissionModal = ({ submission, onClose }) => {
  if (!submission) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    let date;
    if (timestamp.toDate) {
      // Firestore timestamp
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      // Firestore timestamp object
      date = new Date(timestamp.seconds * 1000);
    } else {
      // Regular timestamp
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-cyber font-bold text-neon-green">
            Car Submission
          </h3>
          <button
            onClick={onClose}
            className="btn-ghost p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Image */}
        {submission.imageUrl ? (
          <div className="mb-4">
            <img
              src={submission.imageUrl}
              alt="Submitted car"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-48 bg-asphalt-700 rounded-lg items-center justify-center">
              <ImageIcon size={48} className="text-asphalt-500" />
            </div>
          </div>
        ) : (
          <div className="w-full h-48 bg-asphalt-700 rounded-lg flex items-center justify-center mb-4">
            <ImageIcon size={48} className="text-asphalt-500" />
          </div>
        )}

        {/* Details */}
        <div className="space-y-4">
          {/* Description */}
          {submission.description && (
            <div>
              <h4 className="text-sm font-semibold text-asphalt-300 mb-1">
                Description
              </h4>
              <p className="text-sm text-asphalt-200 leading-relaxed">
                {submission.description}
              </p>
            </div>
          )}

          {/* Location */}
          {submission.location && (
            <div>
              <h4 className="text-sm font-semibold text-asphalt-300 mb-1 flex items-center">
                <MapPin size={16} className="mr-1 text-neon-green" />
                Location
              </h4>
              <p className="text-sm text-asphalt-200">
                {submission.location.latitude.toFixed(6)}, {submission.location.longitude.toFixed(6)}
                {submission.location.accuracy && (
                  <span className="text-asphalt-400 ml-2">
                    (±{Math.round(submission.location.accuracy)}m)
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Timestamp */}
          <div>
            <h4 className="text-sm font-semibold text-asphalt-300 mb-1 flex items-center">
              <Calendar size={16} className="mr-1 text-eco-400" />
              Submitted
            </h4>
            <p className="text-sm text-asphalt-200">
              {formatDate(submission.createdAt)}
            </p>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between pt-4 border-t border-asphalt-700">
            <div className="flex items-center">
              <TreePine size={16} className="text-eco-400 mr-1" />
              <span className="text-sm text-eco-400 font-medium">
                Trees to be planted
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-neon-green">3</div>
              <div className="text-xs text-asphalt-400">estimated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component to handle map updates
const MapUpdater = ({ submissions, selectedSubmission, onMarkerClick }) => {
  const map = useMap();

  useEffect(() => {
    if (submissions.length > 0) {
      // Get bounds of all submissions
      const bounds = submissions
        .filter(sub => sub.location)
        .map(sub => [sub.location.latitude, sub.location.longitude]);
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [submissions, map]);

  return null;
};

const MapView = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load submissions
  const loadSubmissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await getAllSubmissions();
      setSubmissions(data);
      
      if (data.length === 0) {
        toast('No submissions yet. Be the first to submit a car!', {
          icon: '🌱',
        });
      }
    } catch (err) {
      console.error('Error loading submissions:', err);
      setError('Failed to load submissions');
      toast.error('Failed to load map data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  // Handle marker click
  const handleMarkerClick = useCallback((submission) => {
    setSelectedSubmission(submission);
  }, []);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setSelectedSubmission(null);
  }, []);

  // Get recent submissions (last 24 hours)
  const isRecentSubmission = (submission) => {
    if (!submission.createdAt) return false;
    
    let submissionTime;
    if (submission.createdAt.toDate) {
      submissionTime = submission.createdAt.toDate();
    } else if (submission.createdAt.seconds) {
      submissionTime = new Date(submission.createdAt.seconds * 1000);
    } else {
      submissionTime = new Date(submission.createdAt);
    }
    
    const now = new Date();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    return (now - submissionTime) < twentyFourHours;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-display font-bold text-white mb-2">
            Loading Impact Map...
          </h2>
          <p className="text-asphalt-400">
            Mapping cars for trees
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <MapPin className="text-red-400 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-display font-bold text-white mb-2">
            Map Unavailable
          </h2>
          <p className="text-asphalt-400 mb-4">
            {error}
          </p>
          <button
            onClick={loadSubmissions}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const validSubmissions = submissions.filter(sub => 
    sub.location && 
    sub.location.latitude && 
    sub.location.longitude
  );

  return (
    <div className="h-screen relative">
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-[999]">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-cyber font-bold text-neon-green">
                Impact Map
              </h1>
              <p className="text-sm text-asphalt-300">
                {validSubmissions.length} submissions mapped
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-eco-400">
                {validSubmissions.length * 3}
              </div>
              <div className="text-xs text-asphalt-400">trees funded</div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={[40.7128, -74.0060]} // Default to NYC
        zoom={13}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        {/* Markers */}
        {validSubmissions.map((submission) => (
          <Marker
            key={submission.id}
            position={[submission.location.latitude, submission.location.longitude]}
            icon={createCustomIcon(isRecentSubmission(submission))}
            eventHandlers={{
              click: () => handleMarkerClick(submission),
            }}
          >
            <Popup>
              <div className="p-2">
                <p className="font-semibold text-sm mb-1">Car Submission</p>
                {submission.description && (
                  <p className="text-xs text-gray-600 mb-2">
                    {submission.description.substring(0, 50)}
                    {submission.description.length > 50 ? '...' : ''}
                  </p>
                )}
                <button
                  onClick={() => handleMarkerClick(submission)}
                  className="text-xs bg-green-600 text-white px-2 py-1 rounded"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <MapUpdater 
          submissions={validSubmissions}
          selectedSubmission={selectedSubmission}
          onMarkerClick={handleMarkerClick}
        />
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[999]">
        <div className="card p-3">
          <h3 className="text-sm font-semibold text-white mb-2">Legend</h3>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-neon-green rounded-full mr-2 animate-pulse"></div>
              <span className="text-asphalt-300">Recent (24h)</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-2 h-2 bg-eco-500 rounded-full mr-2 ml-0.5"></div>
              <span className="text-asphalt-300">Older submissions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="absolute bottom-4 right-4 z-[999]">
        <button
          onClick={loadSubmissions}
          className="btn-secondary p-3 rounded-full"
          aria-label="Refresh map"
        >
          <MapPin size={20} />
        </button>
      </div>

      {/* Submission Modal */}
      {selectedSubmission && (
        <SubmissionModal
          submission={selectedSubmission}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MapView;