import { useParams } from "react-router-dom";
import useServiceDetails from "../../../hooks/service/useServiceDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faTags,
  faListUl,
  faCoins,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useState } from "react";
import useCreateBooking from "../../../hooks/booking/useCreateBooking";
import useMe from "../../../hooks/useMe";
import Swal from "sweetalert2";

export default function ServiceDetail() {
  const { id } = useParams();
  const { service, loading, error } = useServiceDetails(id);
  const [bookingDate, setBookingDate] = useState({ date: "", time: "" });
  const createBooking = useCreateBooking();
  const { me } = useMe();

  const handleBooking = async () => {
    const { date, time } = bookingDate;
    if (!date || !time) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng chọn đầy đủ ngày và giờ.",
      });
      return;
    }

    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}:00`);
    const isToday = new Date(date).toDateString() === now.toDateString();

    if (isToday && selectedDateTime <= now) {
      Swal.fire({
        icon: "error",
        title: "Giờ không hợp lệ",
        text: "Giờ bạn chọn đã qua. Vui lòng chọn giờ trong tương lai.",
      });
      return;
    }

    // Định dạng MySQL DATETIME
    const formatToMySQLDateTime = (dateObj) => {
      const pad = (n) => n.toString().padStart(2, "0");
      const yyyy = dateObj.getFullYear();
      const mm = pad(dateObj.getMonth() + 1);
      const dd = pad(dateObj.getDate());
      const hh = pad(dateObj.getHours());
      const mi = pad(dateObj.getMinutes());
      const ss = pad(dateObj.getSeconds());
      return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    };

    const booking_time = formatToMySQLDateTime(selectedDateTime);
    const user_id = me.id;
    const total_price = service.price;
    const service_id = service.id;

    try {
      const { success } = await createBooking({
        user_id,
        service_id,
        booking_time,
        total_price,
      });

      if (success) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đặt dịch vụ thành công!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Đặt dịch vụ thất bại!",
        });
      }
    } catch (err) {
      console.error("Booking failed:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Có lỗi xảy ra khi đặt dịch vụ.",
      });
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="2x"
          className="text-primary"
        />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="text-center mt-5 text-danger">
        <p className="fs-5">Không thể tải thông tin dịch vụ.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="container my-5 px-3 px-md-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Tiêu đề dịch vụ */}
      <h2 className="fw-bold mb-3">{service.title}</h2>

      {/* Thông tin cơ bản */}
      <div className="d-flex flex-wrap mb-4 text-muted small">
        <div className="me-4 mb-2">
          <FontAwesomeIcon icon={faTags} className="me-2" />
          Danh mục: <span className="fw-semibold ms-1">{service.category}</span>
        </div>
        <div className="me-4 mb-2">
          <FontAwesomeIcon icon={faListUl} className="me-2" />
          Trạng thái:{" "}
          <span className="fw-semibold ms-1">
            {service.status === "available" ? "Hiển thị" : "Ẩn"}
          </span>
        </div>
        <div className="me-4 mb-2">
          <FontAwesomeIcon icon={faCoins} className="me-2 text-success" />
          Giá:{" "}
          <span className="fw-semibold text-primary ms-1">
            {service.price.toLocaleString()} đ
          </span>
        </div>
      </div>

      {/* Mô tả dịch vụ */}
      <div className="mb-5">
        <h5 className="fw-semibold text-secondary mb-2">Mô tả dịch vụ</h5>
        <p style={{ lineHeight: 1.7 }} className="text-body">
          {service.description || "Không có mô tả cho dịch vụ này."}
        </p>
      </div>

      {/* Đặt lịch */}
      <div className="border rounded-4 p-4 shadow-sm bg-light">
        <h5 className="fw-semibold text-secondary mb-4">Đặt dịch vụ</h5>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label" htmlFor="date">
              Ngày
            </label>
            <input
              type="date"
              id="date"
              className="form-control"
              min={new Date().toISOString().split("T")[0]} // 👈 chỉ cho chọn từ hôm nay trở đi
              value={bookingDate.date}
              onChange={(e) =>
                setBookingDate({ ...bookingDate, date: e.target.value })
              }
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label" htmlFor="time">
              Giờ
            </label>
            <input
              type="time"
              id="time"
              className="form-control"
              value={bookingDate.time}
              onChange={(e) =>
                setBookingDate({ ...bookingDate, time: e.target.value })
              }
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="btn btn-success w-100 rounded-pill mt-3"
          onClick={handleBooking}
        >
          Xác nhận đặt dịch vụ
        </motion.button>
      </div>
    </motion.div>
  );
}
