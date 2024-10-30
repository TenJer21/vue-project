// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyA-LKzEcOaJpiRdatRaUffxZfyMKNlkE7g",
    authDomain: "nodemcu-project-f21ea.firebaseapp.com",
    projectId: "nodemcu-project-f21ea",
    storageBucket: "nodemcu-project-f21ea.appspot.com",
    messagingSenderId: "235429249386",
    appId: "1:235429249386:web:50d81d13f96e57622d6513",
    measurementId: "G-FP0KZJBQ9P"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export default db  ;