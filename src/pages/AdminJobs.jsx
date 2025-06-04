import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../features/auth/AuthContext";
import { Navigate } from "react-router-dom";
import "../styles/AdminJobs.css";

function AdminJobs() {
  const { user } = useAuth();
  const adminEmail = "abhicplash@gmail.com"; // Replace with your email

  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });
  const [editingJobId, setEditingJobId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const querySnapshot = await getDocs(collection(db, "jobs"));
    const jobsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setJobs(jobsData);
  };

  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingJobId) {
        await updateDoc(doc(db, "jobs", editingJobId), {
          ...newJob,
          updatedAt: Timestamp.now(),
        });
        alert("✅ Job updated!");
      } else {
        await addDoc(collection(db, "jobs"), {
          ...newJob,
          createdAt: Timestamp.now(),
        });
        alert("✅ Job added!");
      }

      setNewJob({ title: "", company: "", location: "", description: "" });
      setEditingJobId(null);
      fetchJobs();
    } catch (err) {
      console.error("Error saving job:", err);
      alert("❌ Failed to save job");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await deleteDoc(doc(db, "jobs", id));
      fetchJobs();
    }
  };

  const handleEdit = (job) => {
    setNewJob({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
    });
    setEditingJobId(job.id);
  };

  if (!user || user.email !== adminEmail) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="adminPage-wrapper">
      <div className="admin-container">
        <h2 className="admin-title">Admin: Job Management</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            name="title"
            value={newJob.title}
            onChange={handleChange}
            placeholder="Job Title"
            required
          />
          <input
            name="company"
            value={newJob.company}
            onChange={handleChange}
            placeholder="Company"
            required
          />
          <input
            name="location"
            value={newJob.location}
            onChange={handleChange}
            placeholder="Location"
            required
          />
          <textarea
            name="description"
            value={newJob.description}
            onChange={handleChange}
            placeholder="Job Description"
            required
          />
          <div className="button-group">
            <button type="submit">
              {editingJobId ? "Update Job" : "Add Job"}
            </button>
            {editingJobId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setNewJob({
                    title: "",
                    company: "",
                    location: "",
                    description: "",
                  });
                  setEditingJobId(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <h3>Existing Jobs</h3>
        <ul className="job-list">
          {jobs.map((job) => (
            <li key={job.id} className="job-item">
              <div className="job-details">
                <strong>{job.title}</strong> at {job.company} ({job.location})
              </div>
              <div className="job-actions">
                <button onClick={() => handleEdit(job)}>Edit</button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(job.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminJobs;
