import axios from "axios";

// Base URL comes from the environment. In Docker the Vite dev server proxies
// "/api" to the backend container, so the default relative path works both
// locally and inside containers without any hardcoded host.
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Normalize backend error responses into plain Error objects so components
// can rely on `err.message`, `err.status`, and `err.details`.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response;
    let message = "Something went wrong. Please try again.";
    let details = null;

    if (res && res.data && res.data.error) {
      message = res.data.error.message || message;
      details = res.data.error.details || null;
    } else if (error.code === "ECONNABORTED") {
      message = "The request timed out. Please try again.";
    } else if (error.message) {
      message = error.message;
    }

    const normalized = new Error(message);
    normalized.status = res ? res.status : null;
    normalized.details = details;
    return Promise.reject(normalized);
  }
);

export default api;
