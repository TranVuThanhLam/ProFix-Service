import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../../context/AuthContext";
import Spinner from "../Spinner/Spinner";
import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logout");
  };

  const isCustomer = user?.role === "customer";
  const isProvider = user?.role === "provider";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/image/profix-service-logo.png"
            alt="ProFix Logo"
            style={{ width: "50px", marginRight: "10px" }}
          />
          <strong>ProFix</strong>
        </Link>

        {/* Toggle (mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Main Links */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {user?.name && (
              <li className="nav-item">
                <Link className="nav-link" to="/chat">
                  Chat
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link" to="/providers">
                Providers
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/services">
                Services
              </Link>
            </li>

            {isProvider && (
              <li className="nav-item">
                <Link className="nav-link" to="/provider-dashboard">
                  Dashboard
                </Link>
              </li>
            )}

            {isCustomer && (
              <li className="nav-item">
                <Link className="nav-link" to="/history-bookings">
                  Booking History
                </Link>
              </li>
            )}
          </ul>

          {/* User Info & Actions */}
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            {user?.name ? (
              <>
                <li className="nav-item user-info pe-2">
                  <span className="text-white">
                    {user.name} ({user.role})
                  </span>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-outline-warning btn-sm me-2"
                    to="/personal"
                  >
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link className="btn btn-outline-light btn-sm" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-warning btn-sm" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
