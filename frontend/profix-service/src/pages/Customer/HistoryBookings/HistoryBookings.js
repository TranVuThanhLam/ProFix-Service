import useCustomerBookings from "../../../hooks/booking/useCustomerBookings";
import moment from "moment";

export default function HistoryBookings() {
  const { bookings, loading, error } = useCustomerBookings();

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-danger">Lỗi khi tải dữ liệu.</p>;
  // {
  //     "id": 1,
  //     "user_id": 3,
  //     "service_id": 3,
  //     "booking_time": "2025-04-30T16:57:00Z",
  //     "status": "pending",
  //     "total_price": 123000,
  //     "created_at": "2025-04-29T09:57:30Z",
  //     "service_name": "Dịch vụ nghiêm túc",
  //     "customer_name": "Trần Vũ Thanh Lâm",
  //     "provider_name": "provider"
  // },
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Lịch sử đặt dịch vụ</h5>
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Tên dịch vụ</th>
                <th>Tên nhà cung cấp</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Thời gian đặt</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, index) => (
                <tr key={b.id}>
                  <td>{index + 1}</td>
                  <td>{b.service_name || "Chưa có tên"}</td>
                  <td>{b.provider_name || "Chưa có tên"}</td>
                  <td>{b.total_price.toLocaleString()}đ</td>
                  <td>
                    <span
                      className={`badge ${
                        b.status === "pending"
                          ? "bg-warning text-dark"
                          : b.status === "confirmed"
                          ? "bg-primary"
                          : b.status === "completed"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td>{moment(b.booking_time).format("DD/MM/YYYY HH:mm")}</td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    Không có dữ liệu đặt lịch.
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
