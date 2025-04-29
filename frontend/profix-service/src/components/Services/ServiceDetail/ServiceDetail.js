import { useParams } from "react-router-dom";
import useServiceDetails from "../../../hooks/service/useServiceDetails"; // Không cần dấu `//`

export default function ServiceDetail() {
  const { id } = useParams();
  const { service, loading, error } = useServiceDetails(id);

  if (loading) return <p>Loading...</p>;
  if (error || !service) return <p>Error loading service details.</p>; // 👈 fix chính ở đây

  return (
    <div className="service-detail container my-5">
      <h1>{service.title}</h1>
      <p>
        <strong>Category:</strong> {service.category}
      </p>
      <p>
        <strong>Price:</strong> {service.price.toLocaleString()} VND
      </p>
      <p>
        <strong>Description:</strong> {service.description || "Không có mô tả"}
      </p>

      <button className="btn btn-success">Đặt dịch vụ</button>
    </div>
  );
}
