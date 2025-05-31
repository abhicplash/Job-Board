import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "../services/jobsApi";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs
  });

  if (isLoading) return <p>Loading jobs...</p>;
  if (error) return <p>Failed to load jobs.</p>;

  return (
    <div className="container">
      <h2>Latest Jobs</h2>
      {jobs.map((job) => (
        <div key={job.id} style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}>
          <Link to={`/jobs/${job.id}`}>
            <h3>{job.title}</h3>
            <p>{job.company} – {job.location} ({job.type})</p>
          </Link>
        </div>
      ))}
    </div>
  );
}
