export default function ProviderBookings() {
  const bookings = [
    {
      id: 1,
      service_title: "Thay màn hình iPhone 12",
      customer_name: "Nguyễn Văn A",
      booking_time: "2025-04-28 14:00",
      status: "pending",
      total_price: 500000,
    },
    {
      id: 2,
      service_title: "Sửa điều hòa Panasonic",
      customer_name: "Trần Thị B",
      booking_time: "2025-04-28 15:30",
      status: "confirmed",
      total_price: 700000,
    },
  ];

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

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Đơn đặt gần đây</h5>
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-light">
              <tr>
                <th>Dịch vụ</th>
                <th>Khách hàng</th>
                <th>Thời gian đặt</th>
                <th>Trạng thái</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.service_title}</td>
                  <td>{b.customer_name}</td>
                  <td>{b.booking_time}</td>
                  <td>{statusBadge(b.status)}</td>
                  <td>{b.total_price.toLocaleString()} đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
