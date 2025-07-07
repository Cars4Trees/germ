import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Zap, TreePine, Recycle, MapPin } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    carsSubmitted: 0,
    treesPlanted: 0,
    carbonOffset: 0
  });

  useEffect(() => {
    // Simulate loading stats (in production, fetch from Firebase)
    const timer = setTimeout(() => {
      setStats({
        carsSubmitted: 127,
        treesPlanted: 381,
        carbonOffset: 15.2
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCameraClick = () => {
    navigate('/capture');
  };

  const features = [
    {
      icon: Camera,
      title: 'Snap & Submit',
      description: 'Quick photo capture with automatic location tagging'
    },
    {
      icon: MapPin,
      title: 'Track Impact',
      description: 'See your submission on our real-time impact map'
    },
    {
      icon: TreePine,
      title: 'Plant Trees',
      description: 'Every car helps fund urban reforestation projects'
    },
    {
      icon: Recycle,
      title: 'Circular Economy',
      description: 'Transform waste into regenerative systems'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 relative">
        <div className="text-center max-w-md mx-auto">
          {/* Main Tagline */}
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
            <span className="text-white">Show Us Your</span>
            <br />
            <span className="text-glow animate-glow">Junk</span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-asphalt-300 text-lg mb-12 leading-relaxed">
            Turn abandoned vehicles into urban forests.
            <br />
            <span className="text-eco-400 font-medium">Every submission plants trees.</span>
          </p>

          {/* Camera Button */}
          <button
            onClick={handleCameraClick}
            className="group relative w-32 h-32 bg-gradient-to-r from-eco-600 to-eco-500 
                     rounded-full flex items-center justify-center mb-8 mx-auto
                     camera-pulse hover:shadow-neon transition-all duration-300
                     transform hover:scale-110 active:scale-95 touch-manipulation"
            aria-label="Open camera to submit car photo"
          >
            <Camera 
              size={48} 
              className="text-white group-hover:animate-pulse" 
            />
            
            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full border-2 border-neon-green 
                          opacity-0 group-hover:opacity-100 group-hover:scale-150 
                          transition-all duration-500"></div>
          </button>

          {/* Call to Action */}
          <p className="text-asphalt-400 text-sm mb-8">
            Tap the camera to get started
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-green">
                {stats.carsSubmitted}
              </div>
              <div className="text-xs text-asphalt-400">Cars</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-eco-400">
                {stats.treesPlanted}
              </div>
              <div className="text-xs text-asphalt-400">Trees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-cyan">
                {stats.carbonOffset}t
              </div>
              <div className="text-xs text-asphalt-400">CO₂</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-8 opacity-30">
          <TreePine className="text-eco-400 animate-float" size={24} />
        </div>
        <div className="absolute top-1/3 right-12 opacity-30" style={{ animationDelay: '1s' }}>
          <Recycle className="text-neon-green animate-float" size={20} />
        </div>
        <div className="absolute bottom-1/3 left-12 opacity-30" style={{ animationDelay: '2s' }}>
          <Zap className="text-neon-cyan animate-float" size={18} />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 pb-8">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-cyber font-bold text-center mb-6 text-asphalt-200">
            How It Works
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card-hover p-4 text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon 
                  className="text-neon-green mx-auto mb-2" 
                  size={32} 
                />
                <h4 className="text-sm font-semibold text-white mb-1">
                  {feature.title}
                </h4>
                <p className="text-xs text-asphalt-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mission Statement */}
          <div className="card mt-6 text-center">
            <p className="text-sm text-asphalt-300 leading-relaxed">
              <span className="text-eco-400 font-semibold">Cars for Trees</span> transforms 
              urban waste into regenerative systems. Every abandoned vehicle you report 
              contributes to <span className="text-neon-green">urban reforestation</span> and 
              <span className="text-neon-cyan">circular economy</span> initiatives.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;