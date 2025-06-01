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

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const jobRef = doc(db, "jobs", id);
      const jobSnap = await getDoc(jobRef);

      if (jobSnap.exists()) {
        setJob({ id: jobSnap.id, ...jobSnap.data() });
      }

      if (user) {
        setFullName(user.displayName || "");
        setEmail(user.email || "");

        // Check if already applied
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

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to apply.");

    if (!fullName || !email) {
      return alert("Please fill all required fields.");
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "applications"), {
        userId: user.uid,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        fullName,
        email,
        phone,
        coverLetter,
        appliedAt: serverTimestamp(),
      });
      setApplied(true);
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Failed to apply:", error);
      alert("Something went wrong. Try again.");
    }
    setSubmitting(false);
  };

  if (loading) return <p>Loading job details...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{job.title}</h1>
      <p>
        <strong>Company:</strong> {job.company}
      </p>
      <p>
        <strong>Location:</strong> {job.location}
      </p>
      <p>
        <strong>Description:</strong>
      </p>
      <p>{job.description}</p>

      {user ? (
        applied ? (
          <p style={{ color: "green" }}>
            You have already applied to this job.
          </p>
        ) : (
          <form
            onSubmit={handleApply}
            style={{ marginTop: "20px", maxWidth: "400px" }}
          >
            <div>
              <label>
                Full Name*:
                <br />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  style={{ width: "100%" }}
                />
              </label>
            </div>
            <div>
              <label>
                Email*:
                <br />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: "100%" }}
                />
              </label>
            </div>
            <div>
              <label>
                Phone:
                <br />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: "100%" }}
                />
              </label>
            </div>
            <div>
              <label>
                Cover Letter:
                <br />
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  style={{ width: "100%" }}
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{ marginTop: "10px" }}
            >
              {submitting ? "Submitting..." : "Apply Now"}
            </button>
          </form>
        )
      ) : (
        <p>
          <em>Please log in to apply.</em>
        </p>
      )}
    </div>
  );
};

export default JobPage;
