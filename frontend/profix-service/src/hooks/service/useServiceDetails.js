// src/hooks/useServiceDetails.js
import { useEffect, useState } from "react";
import useApi from "../api/useAPI";

export default function useServiceDetails(id) {
  const { callApi, loading, error } = useApi();
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const data = await callApi({
          method: "get",
          url: `/service/${id}`, // Đảm bảo endpoint đúng RESTful
        });
        setService(data);
      } catch (err) {
        // lỗi đã được xử lý sẵn trong useApi
      }
    };

    if (id) fetchServiceDetails();
  }, [id]);

  return { service, loading, error };
}
