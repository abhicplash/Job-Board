import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for adding/editing
  const [form, setForm] = useState({
    id: null, // if editing, this has job id, else null
    title: "",
    company: "",
    location: "",
    description: "",
  });

  // Fetch all jobs on mount
  const fetchJobs = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "jobs"));
    const jobsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setJobs(jobsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Update job
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, title, company, location, description } = form;

    if (!title || !company || !location || !description) {
      alert("Please fill all fields");
      return;
    }

    if (id) {
      // Update job
      const jobRef = doc(db, "jobs", id);
      await updateDoc(jobRef, {
        title,
        company,
        location,
        description,
      });
      alert("Job updated successfully");
    } else {
      // Add new job
      await addDoc(collection(db, "jobs"), {
        title,
        company,
        location,
        description,
        postedAt: serverTimestamp(),
      });
      alert("Job added successfully");
    }

    // Reset form & reload jobs
    setForm({ id: null, title: "", company: "", location: "", description: "" });
    fetchJobs();
  };

  // Delete job
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await deleteDoc(doc(db, "jobs", id));
      alert("Job deleted");
      fetchJobs();
    }
  };

  // Edit job (populate form)
  const handleEdit = (job) => {
    setForm({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
    });
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div>
      <h1>Admin Panel - Manage Jobs</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <h3>{form.id ? "Edit Job" : "Add New Job"}</h3>

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">{form.id ? "Update Job" : "Add Job"}</button>
        {form.id && (
          <button
            type="button"
            onClick={() =>
              setForm({ id: null, title: "", company: "", location: "", description: "" })
            }
          >
            Cancel
          </button>
        )}
      </form>

      <h3>Jobs List</h3>
      {jobs.length === 0 && <p>No jobs available.</p>}
      <ul>
        {jobs.map((job) => (
          <li key={job.id} style={{ marginBottom: "10px" }}>
            <strong>{job.title}</strong> at <em>{job.company}</em> — {job.location}
            <br />
            <button onClick={() => handleEdit(job)}>Edit</button>{" "}
            <button onClick={() => handleDelete(job.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminJobs;
