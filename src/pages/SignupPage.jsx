import { Link } from "react-router-dom";
import SignupForm from "../features/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="Login-container">
      <SignupForm />
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
