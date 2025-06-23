
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9kyKsPooK3pxI3k0Z-gfvpnMSfjsTuE0",
  authDomain: "filmcollab-3b8b7.firebaseapp.com",
  projectId: "filmcollab-3b8b7",
  storageBucket: "filmcollab-3b8b7.firebasestorage.app",
  messagingSenderId: "309481094561",
  appId: "1:309481094561:web:2bf8a16c2fa485897d5fe0",
  measurementId: "G-4NTL0B80G6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
