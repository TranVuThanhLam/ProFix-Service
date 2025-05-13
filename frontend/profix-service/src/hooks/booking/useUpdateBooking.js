import { useCallback } from "react";
import useApi from "../api/useAPI";

export default function useUpdateBooking() {
  const { callApi, loading, error, data } = useApi();

  const updateBooking = useCallback(
    async (bookingId, updateFields) => {
      if (!bookingId || typeof bookingId !== "number") {
        throw new Error("Invalid booking ID");
      }

      // Chỉ gửi những trường được phép
      const allowedFields = ["status", "booking_time", "total_price"];
      const filteredData = Object.fromEntries(
        Object.entries(updateFields).filter(
          ([key, value]) =>
            allowedFields.includes(key) && value !== undefined && value !== null
        )
      );

      if (Object.keys(filteredData).length === 0) {
        throw new Error("Không có trường nào hợp lệ để cập nhật");
      }

      return await callApi({
        method: "put",
        url: `provider/booking/${bookingId}`,
        body: filteredData,
      });
    },
    [callApi]
  );

  return {
    updateBooking,
    loading,
    error,
    data,
  };
}
