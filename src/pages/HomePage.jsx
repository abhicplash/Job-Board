import React from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export default function HomePage() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "jobs"));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  });

  if (isLoading) return <p>Loading jobs...</p>;

  return (
    <div>
      <h1>Available Jobs</h1>
      {jobs?.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul>
          {jobs.map(job => (
            <li key={job.id}>
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
