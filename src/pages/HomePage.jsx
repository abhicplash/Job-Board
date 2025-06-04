import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../features/auth/AuthContext";
import { Link } from "react-router-dom";
import PageTop from "../components/PageTop";
import "../styles/HomePage.css";

const HomePage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [titleSearch, setTitleSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const jobCollection = collection(db, "jobs");
      const jobSnapshot = await getDocs(jobCollection);
      const jobList = jobSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobList);
      setFilteredJobs(jobList);
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

  // Filter jobs when search inputs change
  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const titleMatch = job.title
        ?.toLowerCase()
        .includes(titleSearch.trim().toLowerCase());
      const locationMatch = job.location
        ?.toLowerCase()
        .includes(locationSearch.trim().toLowerCase());
      return titleMatch && locationMatch;
    });
    setFilteredJobs(filtered);
  }, [titleSearch, locationSearch, jobs]);

  return (
    <div className="HomePage-container">
      <PageTop height={"70vh"} content={"Land on Your dream job"} />
      <div className="HomePage-wrapper">
        <div className="job-Search-Container">
          <h1>Job Listings</h1>
          <div
            className="Job-Search-Wrapper"
            style={{ display: "flex", gap: 12, marginBottom: 20 }}
          >
            <input
              type="text"
              placeholder="Search job title"
              value={titleSearch}
              onChange={(e) => setTitleSearch(e.target.value)}
              style={{ flex: 1, padding: 10, fontSize: 16 }}
            />
            <input
              type="text"
              placeholder="Search location"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              style={{ flex: 1, padding: 10, fontSize: 16 }}
            />
          </div>
        </div>

        {filteredJobs.length === 0 && (
          <p>No jobs found matching your criteria.</p>
        )}

        <div className="Job-list-wrapper">
          {filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <h2>{job.title}</h2>
              <p>
                <strong>Company:</strong> {job.company}
              </p>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              {user ? (
                appliedJobs.includes(job.id) ? (
                  <p style={{ color: "green" }}>Already Applied</p>
                ) : (
                  <button>
                    <Link
                      to={`/apply/${job.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Apply Now
                    </Link>
                  </button>
                )
              ) : (
                <p>Please log in to apply.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
