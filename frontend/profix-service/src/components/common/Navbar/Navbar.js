import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import useMe from "../../../hooks/useMe";
function Navbar() {
  const navigate = useNavigate();
  const { me, loading } = useMe(true);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid d-flex justify-content-center align-items-center">
        {/* Left Section */}
        <div className="d-flex align-items-center justify-content-center">
          <img
            src="image/profix-service-logo.png"
            alt="ProFix Logo"
            style={{ width: "80px" }}
          />
          <a
            className="navbar-brand"
            href="#"
            onClick={() => handleNavigation("/")}
          >
            ProFix
          </a>
        </div>

        {/* Center Section */}
        <div className="collapse navbar-collapse d-flex justify-content-center">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={() => handleNavigation("/")}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={() => handleNavigation("/provider")}
              >
                Provider
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={() => handleNavigation("/services")}
              >
                Services
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={() => handleNavigation("/history-bookings")}
              >
                History-Bookings
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={() => handleNavigation("/chat")}
              >
                Chat
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={() => handleNavigation("/personal")}
              >
                Personal
              </a>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="d-flex align-items-center justify-content-center">
          <ul className="navbar-nav">
            {!me ? (
              <>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    onClick={() => handleNavigation("/login")}
                  >
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    onClick={() => handleNavigation("/register")}
                  >
                    Register
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    onClick={() => handleNavigation("/personal")}
                  >
                    {me.name}
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    onClick={() => handleNavigation("/logout")}
                  >
                    Logout
                  </a>
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
