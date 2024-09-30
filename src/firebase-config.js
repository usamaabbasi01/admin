// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database'; 

const firebaseConfig = {
    apiKey: "AIzaSyBVekboaDaux9O3J3jCqb5MTJXD2niukQg",  
    authDomain: "forx-c7139.firebaseapp.com",  
    projectId: "forx-c7139",  
    storageBucket: "forx-c7139.appspot.com",  
    messagingSenderId: "733310416513",  
    appId: "1:733310416513:web:19ffdc9cc29d59b2637f80",  
    measurementId: "G-WKLB4MDT4W"  
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

// Export the db and auth
export { db, auth };
export const dbFirestore = getFirestore(app);   // Firestore instance
export const dbRealtime = getDatabase(app);     
