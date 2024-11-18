import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9xAd42iLkn6bX2tUdZH-0zgx6AcBqPJA",
  authDomain: "todo-50343.firebaseapp.com",
  projectId: "todo-50343",
  storageBucket: "todo-50343.firebasestorage.app",
  messagingSenderId: "2855430241",
  appId: "1:2855430241:web:2f973fbd3fd77106e7a220",
  measurementId: "G-EPGR9H0Y45"
};
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);


export { auth, provider, signInWithPopup, signOut,db };