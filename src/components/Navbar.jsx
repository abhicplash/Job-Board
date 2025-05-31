import { useAuth } from "../features/auth/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "15px" }}>
        Home
      </Link>

      {user ? (
        <>
          <span style={{ marginRight: "15px" }}>Welcome, {user.email}</span>
          <Link to="/dashboard" style={{ marginRight: "15px" }}>
            Dashboard
          </Link>

          {/* Show admin link if user.isAdmin === true */}
          {user.isAdmin && (
            <Link to="/admin" style={{ marginRight: "15px" }}>
              Admin Panel
            </Link>
          )}

          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: "10px" }}>
            Login
          </Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
