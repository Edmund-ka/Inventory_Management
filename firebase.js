// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjK2i5Yc9Xg2pk6JXUlAl1vYN6X0HzgOs",
  authDomain: "pantry-tracker-996c9.firebaseapp.com",
  projectId: "pantry-tracker-996c9",
  storageBucket: "pantry-tracker-996c9.appspot.com",
  messagingSenderId: "578098627860",
  appId: "1:578098627860:web:a519a0929ff583a1f2ee01",
  measurementId: "G-R6G1VWZPDH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}