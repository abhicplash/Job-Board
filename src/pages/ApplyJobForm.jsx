import React, { useState } from "react";
import "../styles/ApplyJobForm.css";
import { useAuth } from "../features/auth/AuthContext";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ApplyJobForm = ({ jobId }) => {
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const isValidPhone = (phone) =>
    phone === "" || /^\+?[0-9\s\-]{7,15}$/.test(phone.trim());

  const isValidCoverLetter = coverLetter.length <= 1000;

  const isFormValid =
    fullName.trim().length > 0 &&
    isValidEmail(email) &&
    isValidPhone(phone) &&
    isValidCoverLetter;

  const handleSkillsChange = (e) => {
    setSkillsInput(e.target.value);
    const skillsArray = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    setSkills(skillsArray);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError("Please fill all required fields correctly.");
      return;
    }

    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "applications"), {
        userId: user.uid,
        jobId,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        coverLetter: coverLetter.trim(),
        skills,
        experience: experience.trim(),
        appliedAt: serverTimestamp(),
      });

      setSuccess(true);
      setFullName("");
      setEmail(user?.email || "");
      setPhone("");
      setCoverLetter("");
      setSkillsInput("");
      setSkills([]);
      setExperience("");

      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError("Failed to submit application. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="apply-form">
      <h3 className="apply-text-head">Apply for this job</h3>

      <label htmlFor="fullName">
        Full Name <span className="required">*</span>
      </label>
      <input
        id="fullName"
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Your full name"
        disabled={isSubmitting}
        required
      />

      <label htmlFor="email">
        Email <span className="required">*</span>
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        disabled={isSubmitting}
        required
      />
      {!isValidEmail(email) && email.length > 0 && (
        <p className="error">Please enter a valid email address.</p>
      )}

      <label htmlFor="phone">Phone Number (optional)</label>
      <input
        id="phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+91-"
        disabled={isSubmitting}
      />
      {!isValidPhone(phone) && phone.length > 0 && (
        <p className="error">Please enter a valid phone number.</p>
      )}

      <label htmlFor="skills">Skills (comma separated)</label>
      <input
        id="skills"
        type="text"
        value={skillsInput}
        onChange={handleSkillsChange}
        placeholder="e.g. JavaScript, React, CSS"
        disabled={isSubmitting}
      />

      <label htmlFor="experience">Experience</label>
      <textarea
        id="experience"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        placeholder="Describe your work experience here"
        rows={5}
        disabled={isSubmitting}
      />

      <label htmlFor="coverLetter">Cover Letter (optional)</label>
      <textarea
        id="coverLetter"
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        placeholder="Write your cover letter here"
        maxLength={1000}
        rows={6}
        disabled={isSubmitting}
      />
      <div className="char-count">{coverLetter.length} / 1000 characters</div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">Application submitted!</p>}

      <button
        type="submit"
        disabled={isSubmitting || !isFormValid}
        className="submit-btn"
        aria-busy={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
};

export default ApplyJobForm;