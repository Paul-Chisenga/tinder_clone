// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCiohQPYnoLs_shaJK5hILQiKj3Dj3B1ac",
  authDomain: "expo-auth-351119.firebaseapp.com",
  projectId: "expo-auth-351119",
  storageBucket: "expo-auth-351119.appspot.com",
  messagingSenderId: "880828964301",
  appId: "1:880828964301:web:34df11b7f0112ff9eef884",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
