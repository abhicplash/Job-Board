import React, { useEffect, useState } from "react";
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
import PageTop from "../components/PageTop";

const Dashboard = () => {
  const { user } = useAuth();
  const [applicationsWithJob, setApplicationsWithJob] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchApplicationsAndJobs = async () => {
      setLoading(true);
      try {
        // Fetch user's applications
        const q = query(
          collection(db, "applications"),
          where("userId", "==", user.uid)
        );
        const appSnapshot = await getDocs(q);

        // Fetch job data for each application
        const appsData = await Promise.all(
          appSnapshot.docs.map(async (appDoc) => {
            const appData = appDoc.data();
            const jobRef = doc(db, "jobs", appData.jobId);
            const jobSnap = await getDoc(jobRef);

            return {
              id: appDoc.id,
              appliedAt: appData.appliedAt,
              coverLetter: appData.coverLetter,
              // fallback if job doesn't exist
              jobTitle: jobSnap.exists()
                ? jobSnap.data().title
                : "Job not found",
              company: jobSnap.exists() ? jobSnap.data().company : "N/A",
              location: jobSnap.exists() ? jobSnap.data().location : "N/A",
            };
          })
        );

        // Sort applications by appliedAt descending
        appsData.sort(
          (a, b) => (b.appliedAt?.seconds || 0) - (a.appliedAt?.seconds || 0)
        );

        setApplicationsWithJob(appsData);
      } catch (error) {
        console.error("Error fetching applications and jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationsAndJobs();
  }, [user]);

  if (!user) return <p>Loading user info...</p>;
  if (loading) return <p>Loading your applications...</p>;

  return (
    <div className="dashboard-container">
      <PageTop content={"Your Applications"} height={"50vh"}/>
      <div style={{ padding: "20px" }}>
        <h2>Your Applications</h2>
        {applicationsWithJob.length === 0 ? (
          <p>You haven’t applied to any jobs yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {applicationsWithJob.map((app) => {
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
                  <strong>{app.jobTitle}</strong> at {app.company} (
                  {app.location})
                  <br />
                  <small>Applied on: {appliedDate}</small>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
