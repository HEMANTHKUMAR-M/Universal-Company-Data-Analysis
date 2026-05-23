import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Prefer environment variables for security. These are read from Vite envs.
// If no envs are set (for quick local demo), fall back to the provided config below.
const fallbackConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDYkfOubBgEZKzRW8wzZuMOAk2ndHTbS1M',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'company-data-99e5c.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'company-data-99e5c',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'company-data-99e5c.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '653007018018',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:653007018018:web:db14a7e2d93f7ffd22d27b',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-8DQJGPW7DP',
};

const app = initializeApp(fallbackConfig as any);
export const auth = getAuth(app);

// Initialize Analytics only in browser and when measurementId is present
let analytics: ReturnType<typeof getAnalytics> | null = null;
try {
  if (typeof window !== 'undefined' && fallbackConfig.measurementId) {
    analytics = getAnalytics(app as any);
  }
} catch (e) {
  // Analytics may fail in some environments (SSR) — ignore silently
  analytics = null;
}

export { analytics };
export default app;
