import React, { use, useEffect } from "react";
import CustomerLayout from "../../layout/CustomerLayout/CustomerLayout";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Home() {
  // if (loading) return <div>Loading...</div>;
  return (
    <CustomerLayout>
      <div className="container text-center my-5">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-5"
        >
          <h1 className="display-4 fw-bold">Welcome to ProFix Service</h1>
          <p className="lead text-muted">
            Your trusted partner for professional repair and maintenance
            services.
          </p>
        </motion.div>

        {/* Introduction Section */}
        <div className="row align-items-center my-5 ">
          <div className="col-md-6 ">
            <motion.img
              src="/image/profix-service.png"
              alt="ProFix Logo"
              className="img-fluid rounded shadow"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <div className="col-md-6 bg-dark text-light border rounded p-4">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="fw-bold">Why Choose ProFix?</h2>
              <p className="text-secondary">
                At ProFix, we specialize in providing top-notch repair and
                maintenance services for your devices. Whether it's your
                smartphone, laptop, or other electronics, our team of experts
                ensures quality and reliability.
              </p>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Expert Technicians
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Affordable Pricing
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Fast and Reliable Service
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Services Section */}
        <div className="my-5">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="fw-bold mb-4">Our Services</h2>
            <div className="row">
              <div className="col-md-4">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <i className="bi bi-phone-fill display-4 text-primary mb-3"></i>
                    <h5 className="card-title">Smartphone Repair</h5>
                    <p className="card-text text-muted">
                      Quick and reliable repair services for all smartphone
                      brands.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <i className="bi bi-laptop-fill display-4 text-primary mb-3"></i>
                    <h5 className="card-title">Laptop Repair</h5>
                    <p className="card-text text-muted">
                      Comprehensive solutions for hardware and software issues.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <i className="bi bi-tools display-4 text-primary mb-3"></i>
                    <h5 className="card-title">Maintenance Services</h5>
                    <p className="card-text text-muted">
                      Regular maintenance to keep your devices running smoothly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </CustomerLayout>
  );
}

export default Home;
