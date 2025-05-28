import React, { useState } from "react";
import useMe from "../../../hooks/useMe";
import defaultImage from "../../../image/default-avatar.png";
export default function Personal() {
  const { me, loading } = useMe();
  const [imageSrc, setImageSrc] = useState(null);

  if (loading || !me) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  const displayedImage = imageSrc || me.image_url || defaultImage;

  return (
    <div className="container py-5">
      <div className="row shadow rounded-4 overflow-hidden bg-white">
        {/* Sidebar: Avatar + tên + email */}
        <div className="col-md-4 bg-light d-flex flex-column align-items-center py-4 text-center">
          <div className="position-relative">
            <img
              src={displayedImage}
              alt={me.name}
              className="rounded-circle border border-3 border-primary"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                aspectRatio: "1", // ✅ Đảm bảo tỉ lệ 1:1 ở mọi trình duyệt hiện đại
              }}
              onError={() => {
                if (displayedImage !== defaultImage) setImageSrc(defaultImage);
              }}
            />

            <button
              className="btn btn-sm btn-outline-primary position-absolute"
              style={{ top: 0, right: -10 }}
              onClick={() => alert("Chức năng sửa thông tin sẽ được cập nhật")}
            >
              <i className="fa fa-edit me-1" />
            </button>
          </div>
          <h5 className="mt-3 mb-1 fw-semibold">{me.name}</h5>
          <p className="text-muted small">{me.email}</p>
        </div>

        {/* Main Info */}
        <div className="col-md-8 p-4">
          <h5 className="mb-4 border-bottom pb-2">Thông tin cá nhân</h5>
          <Item label="📱 Điện thoại" value={me.phone} />
          <Item label="👤 Vai trò" value={me.role} />
          <Item
            label="✅ Trạng thái"
            value={
              me.status === "active" ? "Đang hoạt động" : "Không hoạt động"
            }
            badgeClass={
              me.status === "active" ? "text-success fw-bold" : "text-muted"
            }
          />
        </div>
      </div>
    </div>
  );
}

function Item({ label, value, badgeClass = "" }) {
  return (
    <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
      <span className="text-secondary">{label}</span>
      <span className={`text-end ${badgeClass}`}>{value}</span>
    </div>
  );
}
