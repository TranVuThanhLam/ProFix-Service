import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion"; // Import animation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("customer");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  let [showPassword, setShowPassword] = useState(false); // State for showing password
  let [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for showing password
  const [errors, setErrors] = useState({});

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min");
  }, []);

  const isValidPhone = (phone) => {
    const phoneRegex = /^(0[1-9][0-9]{8})$/;
    return phoneRegex.test(phone);
  };

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
    return passwordRegex.test(password);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    // Validation checks
    if (!name) {
      validationErrors.name = "Name is required.";
    } else if (name.length > 50) {
      validationErrors.name = "Name must not exceed 50 characters.";
    }
    if (!email) {
      validationErrors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      validationErrors.email = "Invalid email format.";
    }
    if (!phone) {
      validationErrors.phone = "Phone number is required.";
    } else if (!isValidPhone(phone)) {
      validationErrors.phone =
        "Phone number must be exactly 10 digits.(e.g. 093*******)";
    }
    if (!password) {
      validationErrors.password = "Password is required.";
    } else if (!isValidPassword(password)) {
      validationErrors.password =
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&_).";
    }
    if (!confirmPassword) {
      validationErrors.confirmpassword = "Confirm password is required.";
    }
    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log(role, name + " " + email + " " + password + " " + phone);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/register`,
        {
          Name: name,
          Email: email,
          Password: password,
          Phone: phone,
          Role: role,
        }
      );

      if (res.status === 201) {
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="container-fluid">
      <ToastContainer />

      <motion.div
        className="row min-vh-100"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.5 }}
      >
        {/* Form section */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center p-5 bg-light">
          <div className="w-100" style={{ maxWidth: "500px" }}>
            <h2 className="text-center mb-4">Register</h2>
            <form onSubmit={handleRegister}>
              {/* Name */}
              <div className="form-group mb-3">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name}</small>
                )}
              </div>

              {/* Email */}
              <div className="form-group mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>

              {/* Phone */}
              <div className="form-group mb-3">
                <label>Phone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && (
                  <small className="text-danger">{errors.phone}</small>
                )}
              </div>

              {/* Password */}
              <div className="form-group mb-3">
                <label>Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="input-group-text"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </span>
                </div>
                {errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group mb-3">
                <label>Confirm Password</label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span
                    className="input-group-text"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEye : faEyeSlash}
                    />
                  </span>
                </div>
                {errors.confirmPassword && (
                  <small className="text-danger">
                    {errors.confirmPassword}
                  </small>
                )}
              </div>

              {/* Role */}
              <div className="form-group mb-4">
                <label>Role</label>
                <select
                  className="form-control"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="customer">Customer</option>
                  <option value="provider">Provider</option>
                </select>
              </div>

              <button type="submit" className="btn btn-dark w-100 mb-2">
                Register
              </button>
              <div className="d-flex align-items-center my-2">
                <hr className="flex-grow-1" />
                <span className="mx-2">or</span>
                <hr className="flex-grow-1" />
              </div>
              <button
                onClick={() => navigate("/login")}
                className="btn btn-outline-dark w-100"
              >
                Login
              </button>
            </form>
          </div>
        </div>

        {/* Sidenav Section */}
        <div className="col-lg-6 bg-dark text-white d-flex flex-column justify-content-center align-items-center text-center p-5">
          {/* Nút Quay Lại Trang Chủ */}
          <button className="btn btn-light m-3" onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
          </button>
          <h1 className="mb-3">ProFix Service</h1>
          <h4 className="mb-3">Register Page</h4>
          <p>Create an account to get started.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
