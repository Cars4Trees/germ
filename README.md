# 🌱 Cars for Trees PWA

> **Turn junk cars into urban forests through regenerative technology**

A mobile-first Progressive Web App that enables users to submit photos of abandoned vehicles, automatically captures location data, and channels the impact into urban reforestation projects. Built with React, Firebase, and modern web technologies with an Urban Cyber-Eco-Punk aesthetic.

![Cars for Trees Preview](https://via.placeholder.com/800x400/0f172a/39ff14?text=Cars+for+Trees+PWA)

## ✨ Features

### 🎯 Core Functionality
- **📱 Mobile-First Design**: Optimized for touch interactions and camera access
- **📸 Photo Capture**: Native camera integration with file upload fallback
- **📍 Automatic Geolocation**: Permission-based location capture for verification
- **🗺️ Interactive Map**: Real-time visualization of all submissions with Leaflet.js
- **⚡ Offline Support**: Full PWA capabilities with service worker caching
- **🎨 Urban Cyber-Eco-Punk UI**: Modern design with neon accents and eco-friendly themes

### 🏗️ Technical Stack
- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: Firebase (Firestore + Storage + Functions)
- **Maps**: Leaflet.js with OpenStreetMap tiles
- **PWA**: Service Worker with Workbox
- **Icons**: Lucide React icons
- **Notifications**: React Hot Toast

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase account
- Git

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/cars4trees-pwa.git
cd cars4trees-pwa
npm install
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "cars-for-trees"
3. Enable Google Analytics (optional)

#### Enable Services
```bash
# Enable required services
firebase login
firebase projects:list
firebase use your-project-id
```

**Required Firebase Services:**
- **Firestore Database** (Native mode)
- **Storage** (for image uploads)
- **Hosting** (optional, for Firebase deployment)

#### Firestore Rules
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /carSubmissions/{document} {
      allow read: if true; // Public read for map display
      allow create: if request.auth == null; // Allow anonymous submissions
    }
  }
}
```

#### Storage Rules
```javascript
// Storage Security Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /car-images/{imageId} {
      allow read: if true; // Public read for display
      allow write: if request.auth == null && 
                   resource.size < 10 * 1024 * 1024; // 10MB limit
    }
  }
}
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit with your Firebase config
nano .env
```

**Get Firebase Config:**
1. Project Settings → General → Your apps
2. Web app → Config
3. Copy values to `.env` file

### 4. Development
```bash
# Start development server
npm run dev

# Open http://localhost:5173
```

## 📦 Deployment

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Option 2: Netlify
```bash
# Build for production
npm run build

# Deploy to Netlify
# Upload dist/ folder or connect Git repository
```

### Option 3: Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## 🏗️ Project Structure

```
cars4trees-pwa/
├── src/
│   ├── components/           # React components
│   │   ├── HomePage.jsx     # Landing page with camera button
│   │   ├── PhotoCapture.jsx # Image upload and submission
│   │   └── MapView.jsx      # Interactive map with submissions
│   ├── services/            # API and Firebase services
│   │   └── submissionService.js
│   ├── firebase/            # Firebase configuration
│   │   └── config.js
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles + Tailwind
├── public/                  # Static assets
├── .env.example            # Environment template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
└── package.json            # Dependencies and scripts
```

## 🎨 Design System

### Color Palette
```css
/* Eco Colors */
--eco-500: #22c55e;
--eco-600: #16a34a;

/* Neon Accents */
--neon-green: #39ff14;
--neon-cyan: #00ffff;

/* Asphalt Grays */
--asphalt-800: #1e293b;
--asphalt-900: #0f172a;
```

### Typography
- **Display**: Sora (headings)
- **Body**: Inter (text)
- **Cyber**: Orbitron (accent text)

### Key UI Components
- **Camera Button**: Pulsing neon-green circle
- **Cards**: Frosted glass with subtle borders
- **Maps**: Custom markers with neon styling
- **Navigation**: Bottom tab bar with icons

## 🔧 Configuration

### PWA Manifest
The app includes a complete PWA manifest with:
- Custom icons (192x192, 512x512)
- Standalone display mode
- Portrait orientation
- Theme colors

### Service Worker
Powered by Vite PWA plugin with:
- Offline image caching
- Map tile caching
- Runtime caching strategies

## 📊 Database Schema

### Firestore Collections

#### `carSubmissions`
```javascript
{
  id: "auto-generated-id",
  imageUrl: "https://firebase-storage-url/car-image.jpg",
  location: {
    latitude: 40.7128,
    longitude: -74.0060,
    accuracy: 50
  },
  description: "Optional user description",
  createdAt: Timestamp,
  status: "pending", // pending, verified, processed
  metadata: {
    userAgent: "browser-info",
    screenResolution: "1920x1080",
    timestamp: 1699123456789
  }
}
```

## 🚀 Performance

### Optimizations
- **Lazy Loading**: Components and images
- **Code Splitting**: Route-based chunks
- **Image Compression**: Client-side before upload
- **Caching**: Aggressive service worker caching
- **Bundle Size**: Optimized dependencies

### Lighthouse Targets
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 90+
- **PWA**: 100

## 🌍 Environmental Impact

### Circular Economy Features
- **Submission Tracking**: Every car submission mapped
- **Tree Calculation**: 3 trees estimated per vehicle
- **Impact Visualization**: Real-time statistics
- **Carbon Offset**: Estimated CO₂ impact

### Future Extensibility
- **Admin Dashboard**: React-based management interface
- **Tree Tracker**: Visual progress of reforestation
- **Social Sharing**: Community impact sharing
- **Partnerships**: Integration with environmental organizations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Geolocation not working:**
- Ensure HTTPS deployment
- Check browser permissions
- Test on mobile device

**Firebase errors:**
- Verify environment variables
- Check Firestore rules
- Ensure services are enabled

**PWA not installing:**
- Check manifest.json
- Verify service worker
- Test on supported browser

### Contact
- 📧 Email: support@cars4trees.org
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/cars4trees-pwa/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/cars4trees-pwa/discussions)

---

**Built with ❤️ for the planet** 🌍

*Cars for Trees - Transforming urban waste into regenerative systems through technology and community action.*