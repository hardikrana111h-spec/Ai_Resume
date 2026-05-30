import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("resume_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}