import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAsFErXQhdrNNNZvjxtlJRWuEfcaCukV8M",
  authDomain: "ambulance-booking-app-a7235.firebaseapp.com",
  projectId: "ambulance-booking-app-a7235",
  storageBucket: "ambulance-booking-app-a7235.firebasestorage.app",
  messagingSenderId: "986274133717",
  appId: "1:986274133717:web:45d4316f68aec7e5ba545c",
  measurementId: "G-0G0K8NVD0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();
const analytics = getAnalytics(app);

export { app, provider, auth, analytics };