import useApi from "../api/useAPI";

export default function useCreateBooking() {
  const { callApi } = useApi();

  const createBooking = async ({
    user_id,
    service_id,
    booking_time,
    total_price,
  }) => {
    try {
      const data = await callApi({
        method: "post",
        url: "/booking",
        body: {
          user_id,
          service_id,
          booking_time,
          total_price,
        },
      });

      return { success: true, data };
    } catch (error) {
      // Không cần hiển thị lỗi ở đây vì useApi đã xử lý Swal
      return { success: false, error };
    }
  };

  return createBooking;
}
