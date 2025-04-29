import { useState } from "react";
import useServiceApi from "../../../hooks/service/useServiceApi";
import useMe from "../../../hooks/useMe";
import Swal from "sweetalert2";

export default function ProviderAddServiceModal({ show, onClose }) {
  const { me } = useMe();
  const { createService, loading } = useServiceApi();

  const [newService, setNewService] = useState({
    title: "",
    price: 0,
    category: "",
    status: "available",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newService.title.trim())
      newErrors.title = "Tên dịch vụ không được để trống.";
    if (!newService.price || Number(newService.price) <= 0)
      newErrors.price = "Giá dịch vụ phải lớn hơn 0.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Chuyển giá thành số thực
    let price = parseFloat(newService.price);
    if (isNaN(price) || price <= 0) {
      setErrors({ price: "Giá dịch vụ phải lớn hơn 0." });
      return;
    }

    // Tạo đối tượng dữ liệu JSON
    const serviceData = {
      title: newService.title,
      price: price, // Đảm bảo giá là một số hợp lệ
      category: newService.category,
      status: newService.status,
      description: newService.description,
      provider_id: me.id, // me.id là số rồi, gửi lên được
    };

    try {
      await createService(serviceData);

      await Swal.fire({
        icon: "success",
        title: "Đã thêm dịch vụ thành công!",
        showConfirmButton: false,
        timer: 2000,
      });

      resetForm();
      onClose(); // ✅ Đóng modal sau khi popup biến mất
    } catch (error) {
      console.error("Lỗi khi thêm dịch vụ:", error);

      // Nếu muốn bắt lỗi thì thêm luôn:
      Swal.fire({
        icon: "error",
        title: "Thêm dịch vụ thất bại",
        text: "Vui lòng thử lại!",
      });
    }
  };

  const resetForm = () => {
    setNewService({
      title: "",
      price: 0,
      category: "",
      status: "available",
      description: "",
    });
    setErrors({});
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Thêm dịch vụ mới</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              {/* Tên dịch vụ */}
              <div className="mb-3">
                <label className="form-label">Tên dịch vụ</label>
                <input
                  type="text"
                  name="title"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  value={newService.title}
                  onChange={handleInputChange}
                  required
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>

              {/* Giá */}
              <div className="mb-3">
                <label className="form-label">Giá</label>
                <input
                  type="number"
                  name="price"
                  className={`form-control ${errors.price ? "is-invalid" : ""}`}
                  value={newService.price}
                  onChange={handleInputChange}
                  required
                />
                {errors.price && (
                  <div className="invalid-feedback">{errors.price}</div>
                )}
              </div>

              {/* Phân loại */}
              <div className="mb-3">
                <label className="form-label">Phân loại</label>
                <input
                  type="text"
                  name="category"
                  className="form-control"
                  value={newService.category}
                  onChange={handleInputChange}
                />
              </div>

              {/* Trạng thái */}
              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <select
                  name="status"
                  className="form-select"
                  value={newService.status}
                  onChange={handleInputChange}
                >
                  <option value="available">Hiển thị</option>
                  <option value="unavailable">Ẩn</option>
                </select>
              </div>

              {/* Mô tả */}
              <div className="mb-3">
                <label className="form-label">Mô tả</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={newService.description}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu dịch vụ"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
