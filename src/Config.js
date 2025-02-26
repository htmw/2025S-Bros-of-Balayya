// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Authentication
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgB6o6FQO2kcbYx4Gai3w6y5l4xSAIvVM",
  authDomain: "quickbite-2804b.firebaseapp.com",
  projectId: "quickbite-2804b",
  storageBucket: "quickbite-2804b.appspot.com", // Fix storageBucket URL
  messagingSenderId: "1020510104720",
  appId: "1:1020510104720:web:64d152a9db8981150cbc15",
  measurementId: "G-C83YR24S9G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Authentication
const analytics = getAnalytics(app);

export { auth }; // Export auth for use in Signup, Login, Logout
