import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import JobPage from "./pages/JobPage";
import Navbar from "./components/Navbar";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import AdminJobs from "./pages/AdminJobs";
import RequireAdmin from "./components/RequireAdmin";
import ApplyJob from "./pages/ApplyJob";


export default function App() {
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/apply/:jobId" element={<ApplyJob />} />
        <Route
          path="/jobs/:id"
          element={
            <PrivateRoute>
              <JobPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminJobs />
            </RequireAdmin>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}
