import { useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import axiosClient from "./axiosClient";

export default function useApi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const callApi = async ({
    method = "get",
    url,
    body = null,
    config = {},
    silent = false,
    customErrorHandler = null, // ✨ Cho phép custom riêng
  }) => {
    setLoading(true);
    setError(null);

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
      return response.data;
    } catch (err) {
      if (axios.isCancel?.(err)) {
        console.log("Request cancelled");
      } else {
        console.error(err);
        setError(err);

        // Nếu không silent và có lỗi thực sự
        if (!silent) {
          if (customErrorHandler) {
            customErrorHandler(err); // ✨ Ưu tiên custom riêng trước
          } else {
            showDefaultError(err); // ✨ Còn không thì show lỗi mặc định
          }
        }
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const showDefaultError = (err) => {
    const status = err?.response?.status;
    const message =
      err?.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại!";

    switch (status) {
      case 400:
        Swal.fire({
          icon: "warning",
          title: "Dữ liệu không hợp lệ",
          text: message,
        });
        break;
      case 401:
        Swal.fire({
          icon: "error",
          title: "Phiên đăng nhập hết hạn",
          text: "Vui lòng đăng nhập lại.",
        }).then(() => {
          window.location.href = "/login"; // 👉 Tự động chuyển login nếu muốn
        });
        break;
      case 403:
        Swal.fire({
          icon: "error",
          title: "Không có quyền truy cập",
          text: "Bạn không có quyền thực hiện hành động này.",
        });
        break;
      case 404:
        Swal.fire({
          icon: "error",
          title: "Không tìm thấy",
          text: "Dữ liệu bạn yêu cầu không tồn tại.",
        });
        break;
      case 500:
        Swal.fire({
          icon: "error",
          title: "Lỗi hệ thống",
          text: "Máy chủ gặp sự cố. Vui lòng thử lại sau.",
        });
        break;
      default:
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: message,
        });
        break;
    }
  };

  return { data, loading, error, callApi };
}
