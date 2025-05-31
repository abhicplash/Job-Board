import React from "react";
import { useParams } from "react-router-dom";
import ApplyJobForm from "./ApplyJobForm";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const fetchJob = async (jobId) => {
  const docRef = doc(db, "jobs", jobId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error("Job not found");
  return { id: docSnap.id, ...docSnap.data() };
};

const JobDetails = () => {
  const { jobId } = useParams();
  const { data: job, isLoading, error } = useQuery(["job", jobId], () =>
    fetchJob(jobId)
  );

  if (isLoading) return <p>Loading job details...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>{job.title}</h2>
      <p>{job.company}</p>
      <p>{job.description}</p>
      {/* Add other job details */}

      <ApplyJobForm jobId={job.id} />
    </div>
  );
};

export default JobDetails;
