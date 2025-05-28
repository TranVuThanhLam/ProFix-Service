import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";
import useCustomerBookings from "../../../hooks/booking/useCustomerBookings";
import moment from "moment";
import { AnimatePresence } from "framer-motion";
import "../HistoryBookings/HistoryBookings.css";

export default function HistoryBookings() {
  const { bookings, loading, error } = useCustomerBookings();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setSelectedBooking(null);
      setIsClosing(false);
    }, 300);
  };

  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleConfirmComplete = () => {
    // TODO: Gọi API xác nhận hoàn thành dịch vụ
    console.log("Xác nhận hoàn thành booking:", selectedBooking.id);
    setShowModal(false);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const keyword = searchTerm.toLowerCase();
      return (
        b.service_name.toLowerCase().includes(keyword) ||
        b.provider_name.toLowerCase().includes(keyword)
      );
    });
  }, [bookings, searchTerm]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const displayedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return (
      <div className="text-center my-5">
        <ClipLoader size={40} color="#0d6efd" loading={true} />
        <p>Đang tải dữ liệu...</p>
      </div>
    );

  if (error)
    return <p className="text-danger text-center">Lỗi khi tải dữ liệu.</p>;

  return (
    <motion.div
      className="card shadow-lg border-0 mb-5"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="card-body">
        <h4 className="card-title text-primary mb-4">
          <FontAwesomeIcon icon={faSearch} className="me-2" />
          Lịch sử đặt dịch vụ
        </h4>

        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control shadow-sm"
            placeholder="Tìm theo dịch vụ hoặc nhà cung cấp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="input-group-text bg-white">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>

        <div className="table-responsive">
          <table className="table custom-table align-middle text-center">
            <thead className="thead">
              <tr>
                <th>#</th>
                <th>Dịch vụ</th>
                <th>Nhà cung cấp</th>
                <th>Khách hàng</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {displayedBookings.map((b, index) => (
                <motion.tr
                  key={b.id}
                  onClick={() => handleRowClick(b)}
                  whileHover={{ scale: 1.01, backgroundColor: "#eef2ff" }}
                  style={{ cursor: "pointer" }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{b.service_name}</td>
                  <td>{b.provider_name}</td>
                  <td>{b.customer_name}</td>
                  <td className="text-success fw-bold">
                    {b.total_price.toLocaleString()}đ
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill px-3 py-2 text-uppercase fw-semibold ${
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
                  <td className="text-nowrap">
                    <div className="d-flex flex-column text-end">
                      <span className="fw-bold">
                        {moment(b.booking_time).format("DD/MM/YYYY")}
                      </span>
                      <small className="text-muted">
                        {moment(b.booking_time).format("HH:mm")}
                      </small>
                    </div>
                  </td>
                  <td className="text-nowrap">
                    <div className="d-flex flex-column text-end">
                      <span className="fw-bold">
                        {moment(b.created_at).format("DD/MM/YYYY")}
                      </span>
                      <small className="text-muted">
                        {moment(b.created_at).format("HH:mm")}
                      </small>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {displayedBookings.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-muted">
                    Không có dữ liệu phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination mb-0">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <li
                    key={num}
                    className={`page-item ${
                      currentPage === num ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(num)}
                  >
                    <span className="page-link" role="button">
                      {num}
                    </span>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
        <AnimatePresence>
          {showModal && selectedBooking && !isClosing && (
            <div className="modal-backdrop" onClick={handleCloseModal}>
              <motion.div
                className="modal-backdrop"
                onClick={handleCloseModal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="modal-content-custom shadow-lg"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                  key={selectedBooking?.id}
                >
                  <h4 className="modal-title text-center text-primary mb-4">
                    📄 Chi tiết đặt dịch vụ
                  </h4>

                  <div className="row g-4 mb-4 border-bottom pb-3">
                    <div className="col-6">
                      <label className="text-muted small">Dịch vụ</label>
                      <div className="fw-semibold">
                        {selectedBooking.service_name}
                      </div>
                    </div>
                    <div className="col-6">
                      <label className="text-muted small">Nhà cung cấp</label>
                      <div className="fw-semibold">
                        {selectedBooking.provider_name}
                      </div>
                    </div>
                  </div>

                  <div className="row g-4 mb-4 border-bottom pb-3">
                    <div className="col-6">
                      <label className="text-muted small">Khách hàng</label>
                      <div>{selectedBooking.customer_name}</div>
                    </div>
                    <div className="col-6">
                      <label className="text-muted small">Giá</label>
                      <div className="text-success fw-bold">
                        {selectedBooking.total_price.toLocaleString()}₫
                      </div>
                    </div>
                  </div>

                  <div className="row g-4 mb-4 border-bottom pb-3">
                    <div className="col-6">
                      <label className="text-muted small">Thời gian</label>
                      <div>
                        {moment(selectedBooking.booking_time).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </div>
                    </div>
                    <div className="col-6">
                      <label className="text-muted small">Ngày tạo</label>
                      <div>
                        {moment(selectedBooking.created_at).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-muted small mb-2 d-block">
                      Trạng thái hiện tại
                    </label>
                    <div className="border rounded d-flex justify-content-between align-items-center p-3 shadow-sm bg-light">
                      <span className="fw-semibold">Trạng thái:</span>
                      <span
                        className={`badge rounded-pill px-3 py-2 text-uppercase fw-semibold fs-6 ${
                          selectedBooking.status === "confirmed"
                            ? "bg-primary"
                            : selectedBooking.status === "completed"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {selectedBooking.status}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    {selectedBooking.status === "confirmed" && (
                      <button
                        className="btn btn-success"
                        onClick={handleConfirmComplete}
                      >
                        ✅ Xác nhận hoàn thành
                      </button>
                    )}
                    <button
                      className="btn btn-outline-danger"
                      onClick={handleCloseModal}
                    >
                      Đóng
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
