import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export async function fetchJobs() {
  const snapshot = await getDocs(collection(db, "jobs"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
