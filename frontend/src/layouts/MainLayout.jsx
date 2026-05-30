import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RouteSkeleton from "../components/RouteSkeleton";
import { useNetwork } from "../context/NetworkContext";

export default function MainLayout() {
  const location = useLocation();
  const { isOnline } = useNetwork();

  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowSkeleton(true);
      return;
    }

    setShowSkeleton(false);
  }, [isOnline, location.pathname]);

  return (
    <div className="app-shell" style={{ width: "100%", overflowX: "hidden" }}>
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      <Navbar />

      <main style={{ width: "100%", boxSizing: "border-box" }}>
        <div
          style={{
            width: "min(1600px, calc(103% - 48px))",
            margin: "30px auto",
            boxSizing: "border-box",
          }}
        >
          {showSkeleton ? <RouteSkeleton /> : <Outlet key={location.pathname} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}