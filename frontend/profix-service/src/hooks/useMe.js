// src/hooks/useMe.js
import { useEffect, useState } from "react";
import useApi from "./api/useAPI";

export default function useMe(silent = false) {
  const { data, loading, error, callApi } = useApi();
  const [me, setMe] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await callApi({ method: "get", url: "/me", silent: silent });
      } catch (error) {
        console.log("Error fetching /me", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (data?.user) {
      setMe(data.user);
    }
  }, [data]);

  return { me, loading, error };
}
