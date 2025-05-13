// src/hooks/useProviderBookings.js
import { useEffect, useState, useCallback } from "react";
import useApi from "../api/useAPI";
import useMe from "../useMe";

export default function useProviderBookings() {
  const { me, loading: meLoading } = useMe();
  const { callApi, loading: apiLoading, error } = useApi();
  const [bookings, setBookings] = useState([]);

  const fetchBookings = useCallback(async () => {
    if (!me || meLoading) return;
    try {
      const res = await callApi({ url: `/provider/bookings/${me.id}` });
      setBookings(res);
    } catch (err) {
      console.error("Failed to fetch provider bookings:", err);
    }
  }, [me?.id, meLoading, callApi]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading: apiLoading || meLoading,
    error,
    refetch: fetchBookings, // ✅ thêm refetch
  };
}
