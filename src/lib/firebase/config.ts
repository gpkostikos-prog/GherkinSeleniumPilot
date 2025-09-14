// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "gherkin-selenium-pilot",
  "appId": "1:273510302682:web:f4eaae2d0a3f77cb92f6e3",
  "storageBucket": "gherkin-selenium-pilot.firebasestorage.app",
  "apiKey": "AIzaSyBCPEaifJJUMGxx5ZVT_66e9aPX0Qv6FsA",
  "authDomain": "gherkin-selenium-pilot.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "273510302682"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
