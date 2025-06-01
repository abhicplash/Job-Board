import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../features/auth/AuthContext";

const HomePage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const jobCollection = collection(db, "jobs");
      const jobSnapshot = await getDocs(jobCollection);
      const jobList = jobSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobList);
    };

    const fetchAppliedJobs = async () => {
      if (user) {
        const q = query(
          collection(db, "applications"),
          where("userId", "==", user.uid)
        );
        const appliedSnapshot = await getDocs(q);
        const appliedJobIds = appliedSnapshot.docs.map(
          (doc) => doc.data().jobId
        );
        setAppliedJobs(appliedJobIds);
      }
    };

    fetchJobs();
    fetchAppliedJobs();
  }, [user]);

  const handleApply = async (job) => {
    if (!user) {
      alert("Please log in to apply.");
      return;
    }

    if (appliedJobs.includes(job.id)) {
      alert("You have already applied to this job.");
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
      setAppliedJobs((prev) => [...prev, job.id]);
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying:", error);
      alert("Failed to apply. Please try again.");
    }
  };

  return (
    <div>
      <h1>Job Listings</h1>
      {jobs.map((job) => (
        <div key={job.id}>
          <h2>{job.title}</h2>
          <p>{job.company}</p>
          <p>{job.location}</p>
          {user ? (
            appliedJobs.includes(job.id) ? (
              <p style={{ color: "green" }}>Already Applied</p>
            ) : (
              <button onClick={() => handleApply(job)}>Apply Now</button>
            )
          ) : (
            <p>Please log in to apply.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default HomePage;
