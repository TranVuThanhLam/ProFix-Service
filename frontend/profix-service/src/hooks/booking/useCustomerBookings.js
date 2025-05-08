import { useEffect, useState } from "react";
import useApi from "../api/useAPI";
import useMe from "../useMe";

export default function useCustomerBookings() {
  const { me, loading: meLoading } = useMe(); // 👈 lấy user
  const { callApi, loading: apiLoading, error } = useApi(); // 👈 API call
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!me || meLoading) return; // 👈 Chờ load xong mới gọi

    const fetchBookings = async () => {
      try {
        const res = await callApi({ url: `/customer/bookings/${me.id}` });
        setBookings(res); // 👈 giống provider
      } catch (err) {
        console.error("Failed to fetch customer bookings:", err);
      }
    };

    fetchBookings();
  }, [me?.id, meLoading, callApi]); // 👈 thêm meLoading và callApi để đảm bảo đúng dependency

  return {
    bookings,
    loading: apiLoading || meLoading,
    error,
    customerId: me?.id,
  };
}
