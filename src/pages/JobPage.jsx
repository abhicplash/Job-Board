import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
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

      // Check if the user already applied
      if (user) {
        const q = query(
          collection(db, "applications"),
          where("userId", "==", user.uid),
          where("jobId", "==", id)
        );
        const querySnapshot = await getDocs(q);
        setApplied(!querySnapshot.empty);
      }

      setLoading(false);
    };

    fetchJob();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      alert("Please log in to apply.");
      return;
    }

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
      console.error("Error applying:", error);
      alert("Failed to apply. Please try again.");
    }
  };

  if (loading) return <p>Loading job...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{job.title}</h1>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Description:</strong> {job.description}</p>

      {user ? (
        applied ? (
          <p style={{ color: "green" }}>You’ve already applied to this job.</p>
        ) : (
          <button onClick={handleApply}>Apply Now</button>
        )
      ) : (
        <p>Please <strong>log in</strong> to apply.</p>
      )}
    </div>
  );
};

export default JobPage;
