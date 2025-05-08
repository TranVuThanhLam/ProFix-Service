import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ProviderBookings from "../../components/Provider/ProviderBookings/ProviderBookings";
import ProviderServices from "../../components/Provider/ProviderServices/ProviderServices";
import ProviderLayout from "../../layout/ProviderLayout/ProviderLayout";
import useMe from "../../hooks/useMe";
import ProviderAddServiceModal from "../../components/Provider/ProviderAddServiceModal/ProviderAddServiceModal";

export default function ProviderDashboard() {
  const { me } = useMe();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("services"); // 👈 mặc định tab hiển thị

  const stats = [
    { key: "services", title: "Dịch vụ", value: "12" },
    { key: "todayBookings", title: "Đơn hôm nay", value: "5" },
    { key: "processingBookings", title: "Đơn đang xử lý", value: "8" },
    { key: "revenue", title: "Doanh thu", value: "12.000.000 đ" },
  ];

  return (
    <ProviderLayout>
      <div className="container mt-4">
        {/* Thống kê tổng quan */}
        <div className="row mb-4 g-3">
          {stats.map((item, idx) => (
            <div
              className="col-12 col-md-3"
              key={idx}
              onClick={() => setActiveTab(item.key)} // 👈 xử lý click
              style={{ cursor: "pointer" }}
            >
              <div
                className={`card shadow-sm text-center h-100 ${
                  activeTab === item.key ? "border-primary" : ""
                }`}
              >
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <h2 className="fw-bold">{item.value}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chức năng quản lý */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Chức năng quản lý dịch vụ</h5>
                <div className="d-grid gap-2 d-md-block">
                  <button
                    className="btn btn-primary me-2 mb-2"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="bi bi-plus-circle"></i> Thêm dịch vụ mới
                  </button>
                  <button className="btn btn-secondary me-2 mb-2">
                    <i className="bi bi-pencil-square"></i> Quản lý dịch vụ
                  </button>
                  <button className="btn btn-warning me-2 mb-2">
                    <i className="bi bi-arrow-repeat"></i> Cập nhật dịch vụ
                  </button>
                  <button className="btn btn-danger mb-2">
                    <i className="bi bi-trash"></i> Xóa dịch vụ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hiển thị component tương ứng */}
        {activeTab === "services" && <ProviderServices />}
        {(activeTab === "todayBookings" ||
          activeTab === "processingBookings") && <ProviderBookings />}
      </div>

      {/* Modal thêm dịch vụ */}
      <ProviderAddServiceModal
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </ProviderLayout>
  );
}
