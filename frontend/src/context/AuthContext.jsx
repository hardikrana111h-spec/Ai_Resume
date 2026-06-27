import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("resume_token");
      const storedUser = localStorage.getItem("resume_user");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("resume_token");
        localStorage.removeItem("resume_user");
      }
    } catch (err) {
      console.error(err);

      localStorage.removeItem("resume_token");
      localStorage.removeItem("resume_user");

      setUser(null);
    }

    setLoading(false);
  }, []);

  const logout = () => {
    // Clear every session
    localStorage.removeItem("resume_token");
    localStorage.removeItem("resume_user");

    sessionStorage.clear();

    setUser(null);

    window.location.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);