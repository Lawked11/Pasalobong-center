// firebase.js - Firebase Configuration

// Import Firebase libraries from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD373HsUJ7jJsDZEKZQzaHGPAJglizaZY4",
  authDomain: "pasalobong-486c3.firebaseapp.com",
  projectId: "pasalobong-486c3",
  storageBucket: "pasalobong-486c3.firebasestorage.app",
  messagingSenderId: "157431097657",
  appId: "1:157431097657:web:dc8afc6e6d18ada4a120e8",
  measurementId: "G-Y13929E4XY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export auth and firestore instances
export { auth, db };