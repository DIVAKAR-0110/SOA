import axios from "axios";

const base = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: base, // backend URL (use VITE_API_URL when set)
});

export default api;
