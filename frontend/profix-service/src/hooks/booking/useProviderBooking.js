// src/hooks/useProviderBookings.js
import { useEffect, useState } from "react";
import useApi from "./api/useApi";

export default function useProviderBookings() {
  const { callApi, loading, error } = useApi();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await callApi({ url: "/provider/bookings" });
        setBookings(res);
      } catch (err) {
        console.error("Failed to fetch provider bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  return { bookings, loading, error };
}
