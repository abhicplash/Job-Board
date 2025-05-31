import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_qtNa4jD3IskUuHhy2Myu5X-hIBQYQ6g",
  authDomain: "job-portal-c51b9.firebaseapp.com",
  projectId: "job-portal-c51b9",
  storageBucket: "job-portal-c51b9.firebasestorage.app",
  messagingSenderId: "559351059894",
  appId: "1:559351059894:web:1745698e68f7112bd49d17",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
