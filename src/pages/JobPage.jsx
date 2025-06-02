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
  console.log("✅ Rendering form-based JobPage");

  const { id } = useParams();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

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

    if (!user) {
      alert("Please log in to apply.");
      return;
    }

    if (!fullName || !email) {
      alert("Full name and email are required.");
      return;
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
      alert("Application submitted!");
    } catch (err) {
      console.error("Error submitting application:", err);
      alert("Something went wrong.");
    }

    setSubmitting(false);
  };

  if (loading) return <p>Loading job...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>{job.title}</h1>
      <p>
        <strong>Company:</strong> {job.company}
      </p>
      <p>
        <strong>Location:</strong> {job.location}
      </p>
      <p>
        <strong>Description:</strong> {job.description}
      </p>

      {user ? (
        applied ? (
          <p style={{ color: "green" }}>You have already applied.</p>
        ) : (
          <form
            onSubmit={handleApply}
            style={{
              marginTop: "30px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (optional)"
            />
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Cover Letter (optional)"
              rows={4}
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Apply Now"}
            </button>
          </form>
        )
      ) : (
        <p>Please log in to apply.</p>
      )}
    </div>
  );
};

export default JobPage;
