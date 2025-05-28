import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ProviderBookings from "../../../components/Provider/ProviderBookings/ProviderBookings";
import ProviderServices from "../../../components/Provider/ProviderServices/ProviderServices";
import ProviderLayout from "../../../layout/ProviderLayout/ProviderLayout";
import useMe from "../../../hooks/useMe";
import ProviderAddServiceModal from "../../../components/Provider/ProviderAddServiceModal/ProviderAddServiceModal";
import useProviderStats from "../../../hooks/provider/useProviderStats";

export default function ProviderDashboard() {
  const { me } = useMe();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("services");

  const { stats, loading: statsLoading } = useProviderStats();

  const displayStats = [
    {
      key: "services",
      title: "Dịch vụ",
      value: stats?.services ?? "-",
      color: "primary",
      icon: "bi-tools",
    },
    {
      key: "todayBookings",
      title: "Đơn hôm nay",
      value: stats?.todayBookings ?? "-",
      color: "success",
      icon: "bi-calendar-check",
    },
    {
      key: "processingBookings",
      title: "Đơn đang xử lý",
      value: stats?.processingBookings ?? "-",
      color: "warning",
      icon: "bi-hourglass-split",
    },
    {
      key: "revenue",
      title: "Doanh thu",
      value: stats?.revenue?.toLocaleString() + " đ" ?? "-",
      color: "info",
      icon: "bi-cash-stack",
    },
  ];

  return (
    <ProviderLayout>
      <div className="container py-4">
        {/* Section: Tổng quan */}
        <div className="row g-3 mb-4">
          {displayStats.map((item, idx) => (
            <div className="col-12 col-md-6 col-lg-3" key={idx}>
              <div
                className={`card shadow-sm border-start border-4 border-${
                  item.color
                } ${activeTab === item.key ? "bg-light" : ""}`}
                style={{ cursor: "pointer", transition: "0.3s" }}
                onClick={() => setActiveTab(item.key)}
              >
                <div className="card-body text-center">
                  <i
                    className={`bi ${item.icon} fs-2 text-${item.color} mb-2`}
                  ></i>
                  <h6 className="fw-bold">{item.title}</h6>
                  <h4 className={`fw-bold text-${item.color}`}>
                    {statsLoading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      item.value
                    )}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section: Chức năng */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Quản lý dịch vụ</h5>
            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-outline-primary"
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-plus-circle me-1"></i> Thêm dịch vụ
              </button>
              <button className="btn btn-outline-secondary">
                <i className="bi bi-pencil-square me-1"></i> Quản lý dịch vụ
              </button>
              <button className="btn btn-outline-warning text-dark">
                <i className="bi bi-arrow-repeat me-1"></i> Cập nhật dịch vụ
              </button>
              <button className="btn btn-outline-danger">
                <i className="bi bi-trash me-1"></i> Xóa dịch vụ
              </button>
            </div>
          </div>
        </div>

        {/* Section: Nội dung tab */}
        {activeTab === "services" && <ProviderServices />}
        {(activeTab === "todayBookings" ||
          activeTab === "processingBookings") && <ProviderBookings />}

        {/* Modal: Thêm dịch vụ */}
        <ProviderAddServiceModal
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </ProviderLayout>
  );
}
