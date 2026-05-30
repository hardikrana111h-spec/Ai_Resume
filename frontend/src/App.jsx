import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Analyzer from "./pages/Analyzer";
import History from "./pages/History";
import ReportDetails from "./pages/ReportDetails";
import ResumeBuilder from "./pages/ResumeBuilder";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import ScrollToTop from "./components/ScrollToTop";
import { NetworkProvider } from "./context/NetworkContext";


export default function App() {
  return (
    <>
      <NetworkProvider>
      <ScrollToTop />
      
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyzer />} />
        <Route path="/history" element={<History />} />
        <Route path="/report/:id" element={<ReportDetails />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </NetworkProvider>
    </>
  );
}