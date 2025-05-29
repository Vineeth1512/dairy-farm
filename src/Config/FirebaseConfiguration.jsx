import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAf1N6JXlUDxTA1DugAV0iGhNmv7XtE3jA",
  authDomain: "dairy-farm-9c46b.firebaseapp.com",
  projectId: "dairy-farm-9c46b",
  storageBucket: "dairy-farm-9c46b.firebasestorage.app",
  messagingSenderId: "916187186875",
  appId: "1:916187186875:web:a1c3d63130c20a1d8d0b9e",
  measurementId: "G-V0HP3PTFSQ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
