// src/hooks/useMe.js
import { useEffect, useState } from "react";
import useApi from "./api/useApi";

export default function useMe() {
  const { data, loading, error, callApi } = useApi();
  const [me, setMe] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await callApi({ method: "get", url: "/me" });
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
