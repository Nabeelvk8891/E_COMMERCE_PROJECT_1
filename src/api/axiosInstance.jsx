import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // dynamically set from .env or deployment
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
