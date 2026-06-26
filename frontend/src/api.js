import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://ai-resume-s7lv.onrender.com",
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("resume_token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export default api;