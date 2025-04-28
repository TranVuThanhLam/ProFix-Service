// axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  //   timeout: 10000,
});

// axiosClient.interceptors.request.use(
//   //   (config) => {
//   //     const token = localStorage.getItem("token");
//   //     if (token) {
//   //       config.headers.Authorization = `Bearer ${token}`;
//   //     }
//   //     return config;
//   //   },
// //   (error) => Promise.reject(error)
// );

// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("Axios error:", error);
//     console.error("Status:", error.response?.status);
//     console.error("Message:", error.response?.data?.message || error.message);
//     return Promise.reject(error);
//   }
// );

export default axiosClient;
