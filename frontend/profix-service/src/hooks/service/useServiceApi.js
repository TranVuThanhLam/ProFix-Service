import useApi from "../../hooks/api/useAPI";

export default function useServiceApi() {
  const { data, loading, error, callApi } = useApi();

  // 1. Tạo dịch vụ mới
  const createService = async (serviceData) => {
    return callApi({
      method: "post",
      url: "/provider/service",
      body: JSON.stringify(serviceData), // Chuyển đổi dữ liệu thành chuỗi JSON
      config: {
        headers: {
          "Content-Type": "application/json", // Đảm bảo Content-Type là application/json
        },
      },
    });
  };

  // 2. Lấy tất cả dịch vụ
  const getAllServices = async () => {
    return callApi({
      method: "get",
      url: "/services",
    });
  };

  // 3. Lấy chi tiết dịch vụ theo ID
  const getServiceById = async (id) => {
    return callApi({
      method: "get",
      url: `/services/${id}`,
    });
  };

  // 4. Cập nhật dịch vụ (có thể dùng FormData hoặc JSON tùy bạn)
  const updateService = async (id, updatedData) => {
    return callApi({
      method: "put",
      url: `/services/${id}`,
      body: updatedData,
      config: {
        headers: {
          "Content-Type": "application/json", // Nếu dùng JSON
        },
      },
    });
  };

  // 5. Xóa dịch vụ
  const deleteService = async (id) => {
    return callApi({
      method: "delete",
      url: `/services/${id}`,
    });
  };

  return {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
    data,
    loading,
    error,
  };
}
