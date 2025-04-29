import { useState } from "react";
import { Link } from "react-router-dom";
import useServices from "../../hooks/useServices";
import { motion } from "framer-motion";

export default function Services() {
  const { services, loading } = useServices();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const filteredServices = (services || []).filter((service) => {
    const matchesSearch = service.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? service.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Danh sách dịch vụ</h1>

      {/* Tìm kiếm và lọc */}
      <div className="row mb-4">
        <div className="col-12 col-md-6 mb-2 mb-md-0">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset trang về 1 khi tìm kiếm
            }}
          />
        </div>
        <div className="col-12 col-md-6">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1); // Reset trang về 1 khi lọc
            }}
          >
            <option value="">Tất cả phân loại</option>
            <option value="aa">Phân loại A</option>
            <option value="bb">Phân loại B</option>
            {/* Thêm các phân loại khác nếu cần */}
          </select>
        </div>
      </div>

      {/* Hiển thị danh sách dịch vụ */}
      {paginatedServices.length > 0 ? (
        <div className="row g-4">
          {paginatedServices.map((service, index) => (
            <motion.div
              key={service.id}
              className="col-12 col-md-6 col-lg-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{service.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {service.category}
                  </h6>
                  <p className="card-text flex-grow-1">
                    {service.description || "Không có mô tả"}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fw-bold text-primary">
                      {service.price.toLocaleString()} đ
                    </span>
                    <span
                      className={`badge ${
                        service.status === "available"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {service.status === "available" ? "Hiển thị" : "Ẩn"}
                    </span>
                  </div>

                  {/* Nút xem chi tiết */}
                  <Link
                    to={`/services/${service.id}`}
                    className="btn btn-outline-primary mt-3"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-5 text-muted">
          Không tìm thấy dịch vụ nào.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Trước
              </button>
            </li>

            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Sau
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
