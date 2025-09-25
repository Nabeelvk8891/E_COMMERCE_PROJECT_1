import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://json-server-backend-870m.onrender.com", // 👈 change here once, works everywhere
});

export default axiosInstance;
