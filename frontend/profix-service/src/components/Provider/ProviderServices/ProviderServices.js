import useProviderServices from "../../../hooks/service/useProviderServices";

export default function ProviderServices() {
  const { services } = useProviderServices();

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xoá dịch vụ này?")) {
      console.log("Xoá dịch vụ ID:", id);
    }
  };

  return (
    <div className="card shadow-sm mb-4 animate__animated animate__fadeIn">
      <div className="card-body">
        <h5 className="card-title mb-4 text-primary fw-bold">
          <i className="bi bi-list-task me-2"></i>Dịch vụ của bạn
        </h5>

        {/* Khung cuộn với chiều cao cố định */}
        <div
          style={{
            maxHeight: "400px", // chiều cao cố định
            overflowY: "auto", // scroll dọc nếu dữ liệu nhiều
            border: "1px solid #dee2e6",
            borderRadius: "0.375rem",
          }}
        >
          <table className="table table-striped align-middle mb-0">
            <thead
              className="table-light sticky-top"
              style={{ top: 0, zIndex: 1 }}
            >
              <tr className="text-muted small text-uppercase">
                <th style={{ minWidth: "180px" }}>Tên dịch vụ</th>
                <th>Mô tả</th>
                <th>Phân loại</th>
                <th>Giá</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {services && services.length > 0 ? (
                services.map((s) => (
                  <tr key={s.id}>
                    <td className="fw-semibold">{s.title}</td>
                    <td className="text-truncate" style={{ maxWidth: "200px" }}>
                      <span className="text-muted small">{s.description}</span>
                    </td>
                    <td>
                      <span className="badge bg-info-subtle text-dark">
                        {s.category}
                      </span>
                    </td>
                    <td className="text-success fw-bold">
                      {s.price.toLocaleString()} đ
                    </td>
                    <td>
                      <span className="text-muted small">
                        {new Date(s.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge rounded-pill px-3 py-2 ${
                          s.status === "available"
                            ? "bg-success-subtle text-success"
                            : "bg-secondary-subtle text-muted"
                        }`}
                      >
                        {s.status === "available" ? "Đang hiển thị" : "Ẩn"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(s.id)}
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-muted fst-italic text-center">
                    Không có dịch vụ nào được cung cấp.
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
