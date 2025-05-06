// src/hooks/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // 🔥 tự động gửi cookie cho tất cả request
});

// Optional: Xử lý lỗi tập trung
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios error:", error);
    return Promise.reject(error);
  }
);

export default axiosClient;
