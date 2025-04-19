// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjLJofAzBw0OmTTs_txjgzWFhUtQb4GiA",
  authDomain: "ai-trip-planner-51790.firebaseapp.com",
  projectId: "ai-trip-planner-51790",
  storageBucket: "ai-trip-planner-51790.firebasestorage.app",
  messagingSenderId: "356780961852",
  appId: "1:356780961852:web:b98204c49ed87d9b955339",
  measurementId: "G-1KLN04WBG2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);