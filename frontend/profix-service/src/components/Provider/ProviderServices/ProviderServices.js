export default function ProviderServices() {
  const services = [
    {
      id: 1,
      title: "Thay màn hình iPhone 12",
      price: 1200000,
      category: "Điện thoại",
      status: "available",
    },
    {
      id: 2,
      title: "Sửa điều hòa Panasonic",
      price: 700000,
      category: "Điều hòa",
      status: "available",
    },
    {
      id: 3,
      title: "Thay pin Samsung S21",
      price: 500000,
      category: "Điện thoại",
      status: "unavailable",
    },
  ];

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Dịch vụ của bạn</h5>
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-light">
              <tr>
                <th>Tên dịch vụ</th>
                <th>Giá</th>
                <th>Phân loại</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td>{s.price.toLocaleString()} đ</td>
                  <td>{s.category}</td>
                  <td>
                    <span
                      className={`badge ${
                        s.status === "available" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {s.status === "available" ? "Đang hiển thị" : "Ẩn"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
