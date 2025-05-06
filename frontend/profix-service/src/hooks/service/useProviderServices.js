// src/hooks/useProviderServices.js
import { useEffect, useState } from "react";
import useApi from "./api/useApi";

export default function useProviderServices() {
  const { callApi, loading, error } = useApi();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await callApi({ url: "/provider/services" });
        setServices(res);
      } catch (err) {
        console.error("Failed to fetch provider services:", err);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, error };
}
