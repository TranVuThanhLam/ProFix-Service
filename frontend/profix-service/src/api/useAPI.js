// src/hooks/api/useApi.js
import { useState, useRef } from "react";
import axiosClient from "./axiosClient";

export default function useApi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const callApi = async ({ method = "get", url, body = null, config = {} }) => {
    setLoading(true);
    setError(null);

    // Hủy request cũ nếu có
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();

    try {
      const response = await axiosClient({
        method,
        url,
        data: body,
        signal: controllerRef.current.signal,
        ...config,
      });
      setData(response.data);
      return response.data; // ✅ trả kết quả luôn nếu muốn xử lý tiếp
    } catch (err) {
      if (axios.isCancel?.(err)) {
        console.log("Request cancelled");
      } else {
        console.error(err);
        setError(err);
      }
      throw err; // ✅ cho phép bắt lỗi bên ngoài nếu cần
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, callApi };
}
