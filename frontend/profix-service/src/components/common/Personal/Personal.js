import React, { useState } from "react";
import useMe from "../../../hooks/useMe";

export default function Personal() {
  const { me, loading } = useMe();
  const defaultImage = "/img/default-user.png";
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
    <div className="container py-4 d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: "420px" }}>
        {/* Header */}
        <div className="text-center mb-4 position-relative">
          <img
            src={displayedImage}
            alt={me.name}
            className="rounded-circle"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              border: "4px solid #eee",
            }}
            onError={() => {
              if (displayedImage !== defaultImage) setImageSrc(defaultImage);
            }}
          />
          <h5 className="mt-3 mb-1 fw-semibold">{me.name}</h5>
          <p className="text-muted small">{me.email}</p>
          <button
            className="btn btn-outline-primary btn-sm position-absolute"
            style={{ top: 0, right: 0 }}
            onClick={() => alert("Chức năng sửa thông tin sẽ được cập nhật")}
          >
            <i className="fa fa-edit me-1" /> Sửa
          </button>
        </div>

        {/* Info Blocks */}
        <div className="bg-white rounded-4 shadow-sm p-3">
          <Item label="Điện thoại" value={me.phone} icon="📱" />
          <Item label="Vai trò" value={me.role} icon="👤" />
          <Item
            label="Trạng thái"
            value={
              me.status === "active" ? "Đang hoạt động" : "Không hoạt động"
            }
            icon="✅"
            badgeClass={
              me.status === "active" ? "text-success fw-bold" : "text-muted"
            }
          />
        </div>
      </div>
    </div>
  );
}

function Item({ label, value, icon, badgeClass = "" }) {
  return (
    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
      <div className="d-flex align-items-center gap-2">
        <span style={{ fontSize: "1.2rem" }}>{icon}</span>
        <span className="text-muted">{label}</span>
      </div>
      <span className={`text-end ${badgeClass}`}>{value}</span>
    </div>
  );
}
