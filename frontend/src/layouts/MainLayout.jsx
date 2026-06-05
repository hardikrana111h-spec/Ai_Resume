import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SiteNotice from "../components/SiteNotice";
import UpgradeBanner from "../components/UpgradeBanner";
import { SITE_UPGRADE_MODE } from "../config/siteConfig";

export default function MainLayout() {
  return (
    <div className="app-shell">

      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      <div className="page-wrap">
        <Navbar />

        <main className="page-motion-wrap">
          <Outlet />
        </main>

        <Footer />
        <SiteNotice />
      </div>
    </div>
  );
}