import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_qtNa4jD3IskUuHhy2Myu5X-hIBQYQ6g",
  authDomain: "job-portal-c51b9.firebaseapp.com",
  projectId: "job-portal-c51b9",
  storageBucket: "job-portal-c51b9.appspot.com",  // fixed here
  messagingSenderId: "559351059894",
  appId: "1:559351059894:web:1745698e68f7112bd49d17",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
