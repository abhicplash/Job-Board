import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../features/auth/AuthContext";
import { Link } from "react-router-dom";

const fetchApplications = async (userId) => {
  const q = query(
    collection(db, "applications"),
    where("userId", "==", userId)
  );
  const querySnapshot = await getDocs(q);

  // Fetch job details for each application
  const apps = await Promise.all(
    querySnapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const jobRef = doc(db, "jobs", data.jobId);
      const jobSnap = await getDoc(jobRef);
      const job = jobSnap.exists()
        ? { id: jobSnap.id, ...jobSnap.data() }
        : null;
      return {
        id: docSnap.id,
        ...data,
        job,
      };
    })
  );
  return apps;
};

const Dashboard = () => {
  const { user } = useAuth();

  const {
    data: applications,
    isLoading,
    error,
  } = useQuery(["applications", user?.uid], () => fetchApplications(user.uid), {
    enabled: !!user,
  });

  if (!user) return <p>Loading user info...</p>;
  if (isLoading) return <p>Loading your applications...</p>;
  if (error) return <p>Error loading applications: {error.message}</p>;

  return (
    <div>
      <h2>Your Applications</h2>
      {applications.length === 0 ? (
        <p>You haven’t applied to any jobs yet.</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li key={app.id}>
              <h3>
                {app.job ? (
                  <Link to={`/jobs/${app.job.id}`}>{app.job.title}</Link>
                ) : (
                  "Job no longer available"
                )}
              </h3>
              <p>Company: {app.job?.company || "N/A"}</p>
              <p>
                Applied on:{" "}
                {app.appliedAt?.seconds
                  ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString()
                  : "N/A"}
              </p>
              {/* Optional: Show status if you track it */}
              {app.status && <p>Status: {app.status}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
