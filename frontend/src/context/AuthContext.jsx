import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (token, userData) => {
    localStorage.setItem("resume_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("resume_token");
    setUser(null);
  };

  // This is the magic part that fixes the refresh issue!
  useEffect(() => {
    const token = localStorage.getItem("resume_token");
    
    if (token) {
      try {
        // Decode the JWT token to get the user's payload (email, name, etc.)
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Put the decoded data back into the user state
        setUser({
          email: payload.email,
          name: payload.name || payload.email.split('@')[0], // Fallback to email prefix if no name
          picture: payload.picture,
          token: token
        });
      } catch (error) {
        console.error("Failed to decode token on refresh", error);
        // If the token is broken or expired, clear it out
        localStorage.removeItem("resume_token");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};