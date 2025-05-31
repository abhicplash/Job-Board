import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useQuery } from "@tanstack/react-query";

function fetchJobById(id) {
  const docRef = doc(db, "jobs", id);
  return getDoc(docRef).then((docSnap) => {
    if (!docSnap.exists()) throw new Error("Job not found");
    return { id: docSnap.id, ...docSnap.data() };
  });
}

export default function JobDetails() {
  const { id } = useParams();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJobById(id),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Job not found.</p>;

  return (
    <div className="container">
      <h2>{job.title}</h2>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Type:</strong> {job.type}</p>
      <p><strong>Description:</strong> {job.description}</p>
      <button>Apply Now</button>
    </div>
  );
}
