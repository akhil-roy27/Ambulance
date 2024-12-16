import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCuToTr4R4tfOAY3Hswe_qN6I2RPq3YVc8",
  authDomain: "uber-akhil.firebaseapp.com",
  projectId: "uber-akhil",
  storageBucket: "uber-akhil.firebasestorage.app",
  messagingSenderId: "1001962582377",
  appId: "1:1001962582377:web:23ff93ef33a6935c728df8",
  measurementId: "G-Q7EJ1S267H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export { app, provider, auth };