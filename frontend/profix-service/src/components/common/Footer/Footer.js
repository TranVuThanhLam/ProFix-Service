import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start border-top">
      <div className="container py-5">
        <div className="row">
          {/* Quick Links Section */}
          <div className="col-lg-4 col-md-6 mb-4">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h5 className="fw-bold mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-dark text-decoration-none">
                    <i className="bi bi-chevron-right me-2"></i>Home
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-dark text-decoration-none">
                    <i className="bi bi-chevron-right me-2"></i>About Us
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-dark text-decoration-none">
                    <i className="bi bi-chevron-right me-2"></i>Services
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-dark text-decoration-none">
                    <i className="bi bi-chevron-right me-2"></i>Contact
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-dark text-decoration-none">
                    <i className="bi bi-chevron-right me-2"></i>Privacy Policy
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Branding Section */}
          <div className="col-lg-4 col-md-6 mb-4">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="/image/profix-service.png"
                alt="ProFix Logo"
                className="img-fluid mb-3"
                style={{ width: "120px" }}
              />
              <h5 className="fw-bold">ProFix Service</h5>
              <p className="text-muted">
                Your trusted partner for professional repair and maintenance
                services.
              </p>
            </motion.div>
          </div>

          {/* Contact Section */}
          <div className="col-lg-4 col-md-12 mb-4">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h5 className="fw-bold mb-3">Contact Us</h5>
              <p className="text-muted">
                <i className="bi bi-geo-alt-fill me-2 text-primary"></i>03 Main
                Street, City, Country
              </p>
              <p className="text-muted">
                <i className="bi bi-telephone-fill me-2 text-primary"></i>+84
                694 2241
              </p>
              <p className="text-muted">
                <i className="bi bi-envelope-fill me-2 text-primary"></i>
                profixservice@gmail.com
              </p>
              <div className="d-flex justify-content-center">
                <a href="#" className="text-dark me-3">
                  <i className="bi bi-facebook fs-4"></i>
                </a>
                <a href="#" className="text-dark me-3">
                  <i className="bi bi-twitter fs-4"></i>
                </a>
                <a href="#" className="text-dark me-3">
                  <i className="bi bi-instagram fs-4"></i>
                </a>
                <a href="#" className="text-dark">
                  <i className="bi bi-linkedin fs-4"></i>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-dark text-white py-3">
        <div className="container text-center">
          <p className="mb-0">
            © 2025 ProFix. All rights reserved. | Created by Trần Vũ Thanh Lâm
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
