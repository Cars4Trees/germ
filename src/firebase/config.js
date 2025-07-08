import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check if we're in demo mode (missing or demo credentials)
const isDemo = !firebaseConfig.apiKey || 
               firebaseConfig.projectId === 'cars4trees-demo' ||
               firebaseConfig.apiKey.includes('demo');

let app, db, storage, analytics;

if (isDemo) {
  console.log('🌱 Cars for Trees - Running in DEMO mode');
  console.log('📝 Firebase features will be simulated locally');
  
  // Create mock objects for demo mode
  app = null;
  db = null;
  storage = null;
  analytics = null;
} else {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
    
    console.log('🔥 Firebase initialized successfully');
  } catch (error) {
    console.warn('⚠️ Firebase initialization failed, falling back to demo mode', error);
    app = null;
    db = null;
    storage = null;
    analytics = null;
  }
}

export { db, storage, analytics, isDemo };
export default app;