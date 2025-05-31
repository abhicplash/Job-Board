// src/hooks/useUserRole.js
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../features/auth/AuthContext";

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!user) {
      setRole(null);
      return;
    }

    const fetchRole = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        } else {
          setRole("user"); // default role if not found
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole(null);
      }
    };

    fetchRole();
  }, [user]);

  return role;
};
