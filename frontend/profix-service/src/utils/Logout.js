import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Logout = async () => {
  try {
    axios.post(
      `${process.env.REACT_APP_API_URL}/logout`,
      {},
      { withCredentials: true }
    );
    toast.success("You have logged out successfully!", {
      position: "top-center",
      autoClose: 2000, // 2 seconds delay before redirect
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 2000); // Wait for the toast to finish before redirecting
  } catch (error) {
    console.error("Logout failed:", error);
    toast.error("Logout failed. Please try again.", {
      position: "top-center",
    });
  }
};

export default Logout;
