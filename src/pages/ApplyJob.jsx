import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import ApplyJobForm from "../pages/ApplyJobForm";
import PageTop from "../components/PageTop";
import '../styles/global.css'

const ApplyJobPage = () => {
  const { jobId } = useParams();
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      try {
        const jobRef = doc(db, "jobs", jobId);
        const jobSnap = await getDoc(jobRef);
        if (jobSnap.exists()) {
          setJobTitle(jobSnap.data().title);
        } else {
          setJobTitle("Unknown Job");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        setJobTitle("Unknown Job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) return <p>Loading job details...</p>;

  return (
    <div className="Applyjob-container">
      <PageTop content={"Apply for this Job"} height={"50vh"} />
      <h1 className="job-title">Apply for Job: {jobTitle}</h1>
      <ApplyJobForm jobId={jobId} jobTitle={jobTitle} />
    </div>
  );
};

export default ApplyJobPage;
