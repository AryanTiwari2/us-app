// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
import { config } from "./config";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: config.firebase_apiKey,
  authDomain: config.firebase_authDomain,
  projectId: config.firebase_projectId,
  storageBucket:config.firebase_storageBucket,
  messagingSenderId: config.firebase_messagingSenderId,
  appId: config.firebase_appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(app);