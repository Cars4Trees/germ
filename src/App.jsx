import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Map, Camera, Home, TreePine } from 'lucide-react';

// Components
import HomePage from './components/HomePage';
import PhotoCapture from './components/PhotoCapture';
import MapView from './components/MapView';

// Navigation Component
const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/capture', icon: Camera, label: 'Submit' },
    { path: '/map', icon: Map, label: 'Map' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-asphalt-900/95 backdrop-blur-md border-t border-asphalt-700/50 z-50">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 touch-manipulation ${
                isActive 
                  ? 'text-neon-green shadow-neon-green/20' 
                  : 'text-asphalt-400 hover:text-white'
              }`}
            >
              <Icon 
                size={24} 
                className={`mb-1 ${isActive ? 'animate-pulse-neon' : ''}`}
              />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

// Header Component
const Header = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-asphalt-900/95 backdrop-blur-md border-b border-asphalt-700/50 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <TreePine className="text-neon-green" size={24} />
          <h1 className="text-xl font-cyber font-bold text-glow">
            Cars<span className="text-eco-400">4</span>Trees
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isOnline && (
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30">
              Offline
            </span>
          )}
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-neon"></div>
        </div>
      </div>
    </header>
  );
};

// Main App Component
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-cyber flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <TreePine className="text-neon-green mx-auto animate-float" size={48} />
          </div>
          <h1 className="text-2xl font-cyber font-bold text-glow mb-2">
            Cars<span className="text-eco-400">4</span>Trees
          </h1>
          <p className="text-asphalt-400 mb-4">Initializing eco-system...</p>
          <div className="loading-spinner mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-cyber relative overflow-x-hidden">
        {/* Background Grid */}
        <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none"></div>
        
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="pt-16 pb-20 min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/capture" element={<PhotoCapture />} />
            <Route path="/map" element={<MapView />} />
          </Routes>
        </main>
        
        {/* Navigation */}
        <Navigation />
        
        {/* Toast Notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #475569',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;