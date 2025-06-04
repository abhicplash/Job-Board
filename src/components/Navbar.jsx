import { useAuth } from "../features/auth/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Navbar.css";
import { FaBars } from "react-icons/fa";
import { useState } from "react";

function Navbar() {
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

  const [view, setView] = useState(false);

  return (
    <div className="NavWrapper">
      <nav>
        <h1>
          <Link to="/">JOB</Link>
        </h1>

        <div className="navInfoWrapper">
          {user ? (
            <>
              <span style={{ marginRight: "15px" }}>
                Welcome, {user.displayName || user.email}
              </span>
              <Link to="/dashboard" style={{ marginRight: "15px" }}>
                Dashboard
              </Link>

              {user.isAdmin && (
                <Link to="/admin" style={{ marginRight: "15px" }}>
                  Admin Panel
                </Link>
              )}

              <button  className="nav-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: "10px" }}>
                Login
              </Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
        {view ? (
          <div className="navInfoWrapper-mob">
            {user ? (
              <>
                <span style={{ marginRight: "15px" }}>
                  Welcome, {user.displayName || user.email}
                </span>
                <Link
                  onClick={() => {
                    setView(!view);
                  }}
                  to="/dashboard"
                  style={{ marginRight: "15px" }}
                >
                  Dashboard
                </Link>

                {user.isAdmin && (
                  <Link
                    onClick={() => {
                      setView(!view);
                    }}
                    to="/admin"
                    style={{ marginRight: "15px" }}
                  >
                    Admin Panel
                  </Link>
                )}

                <button className="nav-button" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => {
                    setView(!view);
                  }}
                  style={{ marginRight: "10px" }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => {
                    setView(!view);
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        ) : null}
        <FaBars className="navIcon" onClick={() => setView(!view)} />
      </nav>
    </div>
  );
}
export default Navbar;
