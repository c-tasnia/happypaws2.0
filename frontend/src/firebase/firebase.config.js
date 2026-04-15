// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBu7Ea8-EmQ22cws2_VelXKB9rKMVNhZhI",
    authDomain: "happypaws-13981.firebaseapp.com",
    projectId: "happypaws-13981",
    storageBucket: "happypaws-13981.firebasestorage.app",
    messagingSenderId: "649404436057",
    appId: "1:649404436057:web:9cc7ee527c7c10b54aab48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);