import React from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../features/auth/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const fetchApplications = async () => {
    const q = query(
      collection(db, "applications"),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort(
        (a, b) => (b.appliedAt?.seconds || 0) - (a.appliedAt?.seconds || 0)
      );
  };

  const { data: applications, isLoading } = useQuery({
    queryKey: ["applications", user?.uid],
    queryFn: fetchApplications,
    enabled: !!user,
  });

  if (!user) return <p>Loading user info...</p>;
  if (isLoading) return <p>Loading your applications...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Applications</h2>
      {applications?.length === 0 ? (
        <p>You haven’t applied to any jobs yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {applications.map((app) => {
            const appliedDate = app.appliedAt?.toDate?.()
              ? app.appliedAt.toDate().toLocaleDateString()
              : app.appliedAt?.seconds
              ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString()
              : "N/A";

            return (
              <li
                key={app.id}
                style={{
                  marginBottom: "16px",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <strong>{app.jobTitle}</strong> at {app.company}
                <br />
                <small>Applied on: {appliedDate}</small>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
