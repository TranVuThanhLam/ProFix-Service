// src/hooks/useCustomerBookings.js
import { useEffect, useState } from "react";
import useApi from "./api/useApi";

export default function useCustomerBookings() {
  const { callApi, loading, error } = useApi();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await callApi({ url: "/customer/bookings" });
        setBookings(res);
      } catch (err) {
        console.error("Failed to fetch customer bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  return { bookings, loading, error };
}
