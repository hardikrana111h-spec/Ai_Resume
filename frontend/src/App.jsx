import { Routes, Route, Navigate } from "react-router-dom";
import { SITE_UPGRADE_MODE } from "./config/siteConfig";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Analyzer from "./pages/Analyzer";
import History from "./pages/History";
import ReportDetails from "./pages/ReportDetails";
// import ResumeBuilder from "./pages/ResumeBuilder";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import ScrollToTop from "./components/ScrollToTop";
import { NetworkProvider } from "./context/NetworkContext";
import UpgradeBlock from "./components/UpgradeBlock";

function UpgradeRoute({ children, block = false }) {
  if (SITE_UPGRADE_MODE && block) {
    return <UpgradeBlock />;
  }
  return children;
}

export default function App() {
  return (
    <NetworkProvider>
      <ScrollToTop />
      <Routes>
        <Route
          path="/login"
          element={
            <UpgradeRoute block={true}>
              <Login />
            </UpgradeRoute>
          }
        />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/analyze"
            element={
              <UpgradeRoute block={true}>
                <Analyzer />
              </UpgradeRoute>
            }
          />
          <Route
            path="/history"
            element={
              <UpgradeRoute block={true}>
                <History />
              </UpgradeRoute>
            }
          />
          <Route
            path="/report/:id"
            element={
              <UpgradeRoute block={true}>
                <ReportDetails />
              </UpgradeRoute>
            }
          />
          {/* <Route
            path="/resume-builder"
            element={
              <UpgradeRoute block={true}>
                <ResumeBuilder />
              </UpgradeRoute>
            }
          />
          {/* <Route
            path="/resume-builder"
            element={
              <UpgradeRoute block={true}>
                <ResumeBuilder />
              </UpgradeRoute>
            }
          /> */}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NetworkProvider>
  );
}