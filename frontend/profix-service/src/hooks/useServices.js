// src/hooks/useMe.js
import { useEffect, useState } from "react";
import useApi from "../hooks/api/useAPI";

export default function useServices() {
  const { data, loading, error, callApi } = useApi();
  const [services, setServices] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await callApi({ method: "get", url: "/services" });
      } catch (error) {
        console.log("Error fetching /me", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (data) {
      setServices(data);
    }
  }, [data]);

  return { services, loading, error };
}
