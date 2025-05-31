import { Link } from "react-router-dom";
import LoginForm from "../features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="container">
      <LoginForm />
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}
