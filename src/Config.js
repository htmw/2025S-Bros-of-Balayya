// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Import Storage

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgB6o6FQO2kcbYx4Gai3w6y5l4xSAIvVM",
  authDomain: "quickbite-2804b.firebaseapp.com",
  projectId: "quickbite-2804b",
  storageBucket: "quickbite-2804b.firebasestorage.app",
  messagingSenderId: "1020510104720",
  appId: "1:1020510104720:web:64d152a9db8981150cbc15",
  measurementId: "G-C83YR24S9G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Initialize Storage

// Export Firebase Instances
export { auth, db, storage }; // ✅ Export storage
