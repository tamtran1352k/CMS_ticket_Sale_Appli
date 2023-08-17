import { getAuth } from 'firebase/auth';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByQOwUHdTvk-RmL48W_lNczYrarIL3_44",
  authDomain: "ticket-67e2f.firebaseapp.com",
  projectId: "ticket-67e2f",
  storageBucket: "ticket-67e2f.appspot.com",
  messagingSenderId: "342703439023",
  appId: "1:342703439023:web:7518bb10c18781b0b7a85a"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
 export const auth=getAuth(app);
 export const db = getFirestore(app);
 export const storage = getStorage(app);
 
 