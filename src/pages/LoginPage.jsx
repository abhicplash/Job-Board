import { Link } from "react-router-dom";
import LoginForm from "../features/auth/LoginForm";
import "../styles/global.css";

function LoginPage() {
  return (
    <div className="Login-container">
      <LoginForm />
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default LoginPage;