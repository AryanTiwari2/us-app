// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBP-GSsKU33GTnpInbxqFv1YVq-p7T4Dx0",
  authDomain: "chatapp-e422e.firebaseapp.com",
  projectId: "chatapp-e422e",
  storageBucket: "chatapp-e422e.firebasestorage.app",
  messagingSenderId: "163944931210",
  appId: "1:163944931210:web:36ec45c6013921d70cb273"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(app);