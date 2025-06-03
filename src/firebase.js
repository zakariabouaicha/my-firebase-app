// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore}  from 'firebase/firestore';
import { getAuth } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2mRwX3JMGtxHfSW2Hw-2UlXgIog-YvXE",
  authDomain: "my-firebase-app-4866f.firebaseapp.com",
  projectId: "my-firebase-app-4866f",
  storageBucket: "my-firebase-app-4866f.firebasestorage.app",
  messagingSenderId: "156724184262",
  appId: "1:156724184262:web:3ad7c00f30ad363bdec3c7",
  measurementId: "G-2S3Q3VMQFK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db =getFirestore(app);
export const auth = getAuth(app); 