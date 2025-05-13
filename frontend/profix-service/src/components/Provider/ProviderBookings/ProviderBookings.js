import useProviderBookings from "../../../hooks/booking/useProviderBookings";
import useUpdateBooking from "../../../hooks/booking/useUpdateBooking";
import Swal from "sweetalert2";
import { useState } from "react";

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
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Quản lý đơn đặt</h5>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              📥 Chờ xử lý
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              📜 Lịch sử đơn hàng
            </button>
          </li>
        </ul>

        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-light">
              <tr>
                <th>Dịch vụ</th>
                <th>Khách hàng</th>
                <th>Thời gian đặt</th>
                <th>Trạng thái</th>
                <th>Tổng tiền</th>
                {activeTab === "pending" && <th>Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {filteredBookings && filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.service_name}</td>
                    <td>{b.customer_name}</td>
                    <td>{b.booking_time}</td>
                    <td>{statusBadge(b.status)}</td>
                    <td>{b.total_price.toLocaleString()} đ</td>
                    {activeTab === "pending" && (
                      <td>
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
                  <td colSpan={activeTab === "pending" ? 6 : 5}>
                    Không có đơn đặt nào
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
