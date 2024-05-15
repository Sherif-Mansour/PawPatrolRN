// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


import {getFirestore, collection} from 'firebase/firestore'

import {getAuth} from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZL6I722Pq6gKG2gn4OMQCWRwwM1ksnSc",
  authDomain: "paw-patrols.firebaseapp.com",
  projectId: "paw-patrols",
  storageBucket: "paw-patrols.appspot.com",
  messagingSenderId: "392792312097",
  appId: "1:392792312097:web:8514c8185bd7732d19d660"
};

export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Firebase
const app = initializeApp(firebaseConfig);