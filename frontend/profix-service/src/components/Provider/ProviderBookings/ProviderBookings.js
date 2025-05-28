import useProviderBookings from "../../../hooks/booking/useProviderBookings";
import useUpdateBooking from "../../../hooks/booking/useUpdateBooking";
import Swal from "sweetalert2";
import { useState } from "react";
import "./ProviderBookings.css";
export default function ProviderBookings() {
  const { bookings, refetch } = useProviderBookings();
  const { updateBooking } = useUpdateBooking();
  const [activeTab, setActiveTab] = useState("pending");
  const [loadingBookingId, setLoadingBookingId] = useState(null);

  const handleConfirm = async (bookingId) => {
    const result = await Swal.fire({
      title: "Xác nhận đơn đặt?",
      text: "Bạn chắc chắn muốn xác nhận đơn này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      setLoadingBookingId(bookingId);
      await updateBooking(bookingId, { status: "confirmed" });
      Swal.fire({
        icon: "success",
        title: "Đã xác nhận thành công!",
        timer: 1500,
        showConfirmButton: false,
      });
      refetch();
    } catch (error) {
    } finally {
      setLoadingBookingId(null);
    }
  };

  const handleReject = async (bookingId) => {
    const result = await Swal.fire({
      title: "Từ chối đơn đặt?",
      text: "Bạn có chắc chắn muốn từ chối đơn này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Từ chối",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      setLoadingBookingId(bookingId);
      await updateBooking(bookingId, { status: "cancelled" });
      Swal.fire({
        icon: "success",
        title: "Đã từ chối đơn đặt!",
        timer: 1500,
        showConfirmButton: false,
      });
      refetch();
    } catch (error) {
    } finally {
      setLoadingBookingId(null);
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="badge bg-warning text-dark">Chờ xác nhận</span>;
      case "confirmed":
        return <span className="badge bg-success">Đã xác nhận</span>;
      case "cancelled":
        return <span className="badge bg-danger">Đã hủy</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const filteredBookings =
    activeTab === "pending"
      ? bookings.filter((b) => b.status === "pending")
      : bookings.filter((b) => b.status !== "pending");

  return (
    <div className="card shadow-sm mb-4 animate__animated animate__fadeIn">
      <div className="card-body">
        <h5 className="card-title mb-4 text-primary fw-bold">
          <i className="bi bi-calendar-check me-2"></i>Quản lý đơn đặt
        </h5>

        {/* Tabs */}
        <div className="d-flex gap-2 mb-3">
          <button
            className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            📥 Chờ xử lý
          </button>
          <button
            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            📜 Lịch sử đơn hàng
          </button>
        </div>

        {/* Bảng cuộn riêng */}
        <div
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            border: "1px solid #dee2e6",
            borderRadius: "0.375rem",
          }}
        >
          <table className="table table-hover align-middle mb-0">
            <thead
              className="table-light sticky-top"
              style={{ top: 0, zIndex: 1 }}
            >
              <tr className="small text-muted">
                <th className="text-start">Dịch vụ</th>
                <th className="text-start">Khách hàng</th>
                <th className="text-start">Thời gian</th>
                <th className="text-start">Trạng thái</th>
                <th className="text-end">Tổng tiền</th>
                {activeTab === "pending" && (
                  <th className="text-center">Hành động</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredBookings && filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="text-start">{b.service_name}</td>
                    <td className="text-start">{b.customer_name}</td>
                    <td className="text-start">{b.booking_time}</td>
                    <td className="text-start">{statusBadge(b.status)}</td>
                    <td className="text-end fw-semibold text-success">
                      {b.total_price.toLocaleString()} đ
                    </td>
                    {activeTab === "pending" && (
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-success me-2"
                          disabled={loadingBookingId === b.id}
                          onClick={() => handleConfirm(b.id)}
                        >
                          {loadingBookingId === b.id ? "..." : "Xác nhận"}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={loadingBookingId === b.id}
                          onClick={() => handleReject(b.id)}
                        >
                          {loadingBookingId === b.id ? "..." : "Từ chối"}
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={activeTab === "pending" ? 6 : 5}
                    className="text-center text-muted fst-italic py-3"
                  >
                    Không có đơn đặt nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
