import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    const q = query(collection(db, "jobs"), orderBy("postedAt", "desc"));
    const querySnapshot = await getDocs(q);
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

  if (loading) return <p>Loading jobs...</p>;

  if (jobs.length === 0) return <p>No jobs available at the moment.</p>;

  return (
    <div>
      <h1>Available Jobs</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {jobs.map((job) => (
          <li
            key={job.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <h3>{job.title}</h3>
            <p>
              <strong>Company:</strong> {job.company}
            </p>
            <p>
              <strong>Location:</strong> {job.location}
            </p>
            <p>{job.description.substring(0, 150)}...</p>
            <button
              onClick={() =>
                alert(`Apply functionality coming soon for ${job.title}`)
              }
              style={{ padding: "8px 12px", cursor: "pointer" }}
            >
              Apply Now
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;