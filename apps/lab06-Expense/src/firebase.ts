import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA0ehYU8m-ZZZ1EhODi88--ZFQO_vsGLG0",
  authDomain: "lab6-f3028.firebaseapp.com",
  projectId: "lab6-f3028",
  storageBucket: "lab6-f3028.appspot.com",
  messagingSenderId: "878238279876",
  appId: "1:878238279876:web:20dc42b281aa51de590191"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 👉 สำคัญที่สุด
export const db = getFirestore(app);
