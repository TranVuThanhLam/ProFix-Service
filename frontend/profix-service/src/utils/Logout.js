// pages/Logout.jsx (hoặc đường dẫn tương tự)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // Giả sử đường dẫn đúng
import { RingLoader } from "react-spinners"; // Import spinner
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true); // Trạng thái loading

  useEffect(() => {
    const handleLogout = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/logout`,
          {},
          { withCredentials: true }
        );
        toast.success("Bạn đã đăng xuất thành công!", {
          position: "top-left", // Vị trí toast ở góc trên bên trái
          autoClose: 2000,
        });

        // Đợi toast hiển thị xong rồi mới chuyển hướng và gọi logout context
        setTimeout(() => {
          logout(); // Xóa trạng thái người dùng trong context
          navigate("/"); // Chuyển hướng về homepage
        }, 2000);
      } catch (error) {
        console.error("Đăng xuất thất bại:", error);
        toast.error("Đăng xuất thất bại. Vui lòng thử lại.", {
          position: "top-left", // Vị trí toast ở góc trên bên trái
        });
        setLoading(false); // Dừng loading nếu có lỗi

        // Nếu lỗi, có thể muốn chuyển hướng ngay lập tức hoặc vẫn cho người dùng ở lại trang lỗi
        // Tùy thuộc vào hành vi bạn muốn sau khi logout thất bại
        setTimeout(() => {
          navigate("/"); // Chuyển hướng về homepage ngay cả khi lỗi để tránh bị kẹt
        }, 2000);
      }
    };

    handleLogout(); // Gọi hàm logout khi component được mount
  }, [navigate, logout]); // Thêm navigate và logout vào dependency array

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Chiếm toàn bộ chiều cao màn hình
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {loading && (
        <RingLoader
          color={"#1a73e8"} // Màu sắc của spinner
          loading={loading}
          size={80} // Kích thước spinner
        />
      )}
      {!loading && <p>Đang chuyển hướng...</p>}{" "}
      {/* Hiển thị khi không loading nhưng chưa chuyển hướng */}
    </div>
  );
};

export default Logout;
