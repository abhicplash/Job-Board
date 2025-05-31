import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

async function fetchJob(id) {
  const docRef = doc(db, "jobs", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error("Job not found");
  return { id: docSnap.id, ...docSnap.data() };
}

export default function JobPage() {
  const { id } = useParams();
  // const { data: job, isLoading, error } = useQuery(["job", id], () => fetchJob(id));
  const {
    data: job,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJob(id),
  });

  if (isLoading) return <p>Loading job details...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{job.title}</h2>
      <p>
        <strong>Company:</strong> {job.company}
      </p>
      <p>
        <strong>Location:</strong> {job.location}
      </p>
      <p>
        <strong>Type:</strong> {job.type}
      </p>
      <p>
        <strong>Description:</strong>
      </p>
      <p>{job.description}</p>
      {/* Add Apply button/form in next step */}
    </div>
  );
}
