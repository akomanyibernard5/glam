import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCft7OefssqCx9hb3byGJ0dvFhES5lKVCU",
  authDomain: "ladies-glam.firebaseapp.com",
  projectId: "ladies-glam",
  storageBucket: "ladies-glam.firebasestorage.app",
  messagingSenderId: "24134566198",
  appId: "1:24134566198:web:81912bc8e7931d3e747397",
  measurementId: "G-V10VGB7ZSF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();