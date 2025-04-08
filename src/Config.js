// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Import Storage

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdFt7mkv0Qhx7exGLxo910PcUNl55t7eI",
  authDomain: "quickrecap-41cb9.firebaseapp.com",
  projectId: "quickrecap-41cb9",
  storageBucket: "quickrecap-41cb9.firebasestorage.app",
  messagingSenderId: "655208111569",
  appId: "1:655208111569:web:213952594ab5ce670294f0",
  measurementId: "G-DPG488S1BY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Initialize Storage

// Export Firebase Instances
export { auth, db, storage }; // ✅ Export storage
