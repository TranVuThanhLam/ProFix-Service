import { useEffect, useState } from "react";
import useApi from "./../api/useAPI";
import useMe from "../useMe";

export default function useProviderServices() {
  const { me, loading: meLoading } = useMe(); // 👈 lấy loading từ useMe
  const { callApi, loading: apiLoading, error } = useApi();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      if (!me || meLoading) return;

      try {
        const res = await callApi({ url: `/provider/services/${me.id}` });
        setServices(res);
      } catch (err) {
        console.error("Failed to fetch provider services:", err);
      }
    };

    fetchServices();
  }, [me, meLoading, callApi]);

  return { services, loading: apiLoading || meLoading, error };
}
