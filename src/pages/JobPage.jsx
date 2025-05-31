import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../features/auth/AuthContext";

const JobPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const jobRef = doc(db, "jobs", id);
      const jobSnap = await getDoc(jobRef);

      if (jobSnap.exists()) {
        setJob({ id: jobSnap.id, ...jobSnap.data() });
      }

      // Check if already applied
      if (user) {
        const q = query(
          collection(db, "applications"),
          where("userId", "==", user.uid),
          where("jobId", "==", id)
        );
        const appliedSnap = await getDocs(q);
        setApplied(!appliedSnap.empty);
      }

      setLoading(false);
    };

    fetchJob();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) return alert("Please log in to apply.");

    try {
      await addDoc(collection(db, "applications"), {
        userId: user.uid,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        appliedAt: serverTimestamp(),
      });
      setApplied(true);
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Failed to apply:", error);
      alert("Something went wrong. Try again.");
    }
  };

  if (loading) return <p>Loading job details...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{job.title}</h1>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Description:</strong></p>
      <p>{job.description}</p>

      {user ? (
        applied ? (
          <p style={{ color: "green" }}>You have already applied to this job.</p>
        ) : (
          <button onClick={handleApply}>Apply Now</button>
        )
      ) : (
        <p><em>Please log in to apply.</em></p>
      )}
    </div>
  );
};

export default JobPage;
