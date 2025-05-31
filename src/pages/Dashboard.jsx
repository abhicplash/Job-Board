import React from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../features/auth/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const fetchAppliedJobs = async () => {
    const q = query(
      collection(db, "applications"),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const { data: applications, isLoading } = useQuery({
    queryKey: ["appliedJobs", user?.uid],
    queryFn: fetchAppliedJobs,
    enabled: !!user,
  });

  if (!user) return <p>Loading user info...</p>;
  if (isLoading) return <p>Loading your applications...</p>;

  return (
    <div>
      <h2>Your Applications</h2>
      {applications?.length === 0 ? (
        <p>You haven’t applied to any jobs yet.</p>
      ) : (
        <ul>
          {applications.map(job => (
            <li key={job.id}>
              <h3>{job.jobTitle}</h3>
              <p>{job.company}</p>
              <p>
                Applied on:{" "}
                {job.appliedAt?.seconds
                  ? new Date(job.appliedAt.seconds * 1000).toLocaleDateString()
                  : "N/A"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
