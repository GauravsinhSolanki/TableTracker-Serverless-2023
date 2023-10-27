// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDglaFe88jPa7V7aTzl81aHwY_BgqgRehE",
  authDomain: "csci5410-f23-sdp3.firebaseapp.com",
  projectId: "csci5410-f23-sdp3",
  storageBucket: "csci5410-f23-sdp3.appspot.com",
  messagingSenderId: "784390099161",
  appId: "1:784390099161:web:97908b0513b07aea87aec8",
  measurementId: "G-NPHKJK1T4V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider()


