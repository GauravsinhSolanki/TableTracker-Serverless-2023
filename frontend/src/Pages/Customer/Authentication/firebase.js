import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDglaFe88jPa7V7aTzl81aHwY_BgqgRehE",
  authDomain: "csci5410-f23-sdp3.firebaseapp.com",
  projectId: "csci5410-f23-sdp3",
  storageBucket: "csci5410-f23-sdp3.appspot.com",
  messagingSenderId: "784390099161",
  appId: "1:784390099161:web:97908b0513b07aea87aec8",
  measurementId: "G-NPHKJK1T4V"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider()


