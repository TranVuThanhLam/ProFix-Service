// src/hooks/useProviderBookings.js
import { useEffect, useState } from "react";
import useApi from "../api/useAPI";
import useMe from "../useMe";

export default function useProviderBookings() {
  const { me, loading: meLoading } = useMe();
  const { callApi, loading: apiLoading, error } = useApi();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!me || meLoading) return;

    const fetchBookings = async () => {
      try {
        const res = await callApi({ url: `/provider/bookings/${me.id}` });
        setBookings(res);
      } catch (err) {
        console.error("Failed to fetch provider bookings:", err);
      }
    };

    fetchBookings();
  }, [me?.id, meLoading, callApi]); // ✅ OK sau khi callApi được memo hóa

  return { bookings, loading: apiLoading || meLoading, error };
}
