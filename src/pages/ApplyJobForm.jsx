import React, { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
import { db, storage } from "../services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ApplyJobForm = ({ jobId }) => {
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!resumeFile) {
      setError("Please upload your resume.");
      return;
    }

    try {
      // Upload resume to Firebase Storage
      const storageRef = ref(storage, `resumes/${user.uid}/${resumeFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, resumeFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          setError(error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Save application to Firestore
          await addDoc(collection(db, "applications"), {
            userId: user.uid,
            jobId,
            coverLetter,
            resumeUrl: downloadURL,
            appliedAt: serverTimestamp(),
          });

          setSuccess(true);
          setCoverLetter("");
          setResumeFile(null);
          setUploadProgress(0);
        }
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Apply for this job</h3>

      <label>
        Cover Letter (optional)
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Write your cover letter here"
        />
      </label>

      <label>
        Upload Resume *
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
      </label>

      {uploadProgress > 0 && <p>Uploading: {uploadProgress}%</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Application submitted!</p>}

      <button type="submit">Submit Application</button>
    </form>
  );
};

export default ApplyJobForm;