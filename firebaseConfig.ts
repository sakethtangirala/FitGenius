// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Correct import for Firestore
import { initializeAuth, getAuth } from 'firebase/auth';

// Firebase configuration object (make sure to replace it with your own credentials)
const firebaseConfig = {
    apiKey: "AIzaSyATa4Z_th5NWQpwPHPfIhqZ6BBB4_8VQOU",
    authDomain: "ai-workout-tracker-e4487.firebaseapp.com",
    projectId: "ai-workout-tracker-e4487",
    storageBucket: "ai-workout-tracker-e4487.firebasestorage.app",
    messagingSenderId: "124813075809",
    appId: "1:124813075809:web:67362baff2dabced7c5120",
    measurementId: "G-KSR244F93Y"
  };

// Initialize Firebase
let app;
console.log('Firebase config file executed');
console.log('Firebase config:', firebaseConfig); // Log firebaseConfig
try {
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully'); // Log success
} catch (error) {
    console.error('Firebase initialization error:', error); // Log error
    throw new Error("Firebase configuration is invalid or missing. Please check your firebaseConfig.ts file.");
}


// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = initializeAuth(app, {
});

export { getAuth }; // Export getAuth

export const geminiApiKey = "AIzaSyASr5rFFhyacw7mvSaOp69zkGazMZsEgvQ"; // Gemini API Key
