import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });

  // Fetch existing jobs
  useEffect(() => {
    const fetchJobs = async () => {
      const querySnapshot = await getDocs(collection(db, "jobs"));
      const jobsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobsData);
    };

    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "jobs"), {
        ...newJob,
        createdAt: Timestamp.now(),
      });
      alert("Job added!");
      setNewJob({ title: "", company: "", location: "", description: "" });

      // Reload job list
      const updatedJobs = await getDocs(collection(db, "jobs"));
      const jobsData = updatedJobs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobsData);
    } catch (err) {
      console.error("Failed to add job:", err);
      alert("Error adding job");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add New Job</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="title"
          value={newJob.title}
          onChange={handleChange}
          placeholder="Job Title"
          required
        />
        <br />
        <input
          type="text"
          name="company"
          value={newJob.company}
          onChange={handleChange}
          placeholder="Company"
          required
        />
        <br />
        <input
          type="text"
          name="location"
          value={newJob.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <br />
        <textarea
          name="description"
          value={newJob.description}
          onChange={handleChange}
          placeholder="Job Description"
          required
        />
        <br />
        <button type="submit">Add Job</button>
      </form>

      <h3>Existing Jobs</h3>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <strong>{job.title}</strong> at {job.company} – {job.location}
          </li>
        ))}
      </ul>
    </div>
  );
}
