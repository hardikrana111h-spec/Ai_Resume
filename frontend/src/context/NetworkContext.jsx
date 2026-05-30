import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../api";

const NetworkContext = createContext(null);

function getConnectionInfo() {
  if (typeof navigator === "undefined") {
    return {
      effectiveType: "4g",
      downlink: 10,
      rtt: 0,
      saveData: false,
      tier: "fast",
    };
  }

  const conn =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  const effectiveType = conn?.effectiveType || "4g";
  const downlink = Number(conn?.downlink || 10);
  const rtt = Number(conn?.rtt || 0);
  const saveData = Boolean(conn?.saveData);

  let tier = "fast";

  if (
    saveData ||
    effectiveType === "slow-2g" ||
    effectiveType === "2g" ||
    downlink < 1.5
  ) {
    tier = "slow";
  } else if (
    effectiveType === "3g" ||
    downlink < 6 ||
    rtt > 220
  ) {
    tier = "medium";
  }

  return {
    effectiveType,
    downlink,
    rtt,
    saveData,
    tier,
  };
}

export function NetworkProvider({ children }) {
  const [connection, setConnection] = useState(getConnectionInfo);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    const onConnectionChange = () => setConnection(getConnectionInfo());

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    const conn =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    conn?.addEventListener?.("change", onConnectionChange);

    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        setPendingRequests((count) => count + 1);
        return config;
      },
      (error) => {
        setPendingRequests((count) => Math.max(0, count - 1));
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        setPendingRequests((count) => Math.max(0, count - 1));
        return response;
      },
      (error) => {
        setPendingRequests((count) => Math.max(0, count - 1));
        return Promise.reject(error);
      }
    );

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      conn?.removeEventListener?.("change", onConnectionChange);
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const value = useMemo(
    () => ({
      isOnline,
      pendingRequests,
      isLoading: pendingRequests > 0,
      ...connection,
      isSlowNetwork: connection.tier !== "fast",
      networkLabel:
        connection.tier === "slow"
          ? "Slow network"
          : connection.tier === "medium"
          ? "Moderate network"
          : "Fast network",
    }),
    [isOnline, pendingRequests, connection]
  );

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) {
    throw new Error("useNetwork must be used inside NetworkProvider");
  }
  return ctx;
}