import { Navigate } from "react-router-dom";
import UpgradeBlock from "./UpgradeBlock";
import { SITE_UPGRADE_MODE } from "../config/siteConfig";

export default function UpgradeRoute({ children, block = false }) {
  if (SITE_UPGRADE_MODE && block) {
    return <UpgradeBlock />;
  }

  return children;
}