import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Button, Spinner } from "react-bootstrap";
import Sidebar from "../../components/Sidebar.jsx";
import { ordersAPI } from "../../services/api";
import "../../css/Dashboard.css";
import "../../css/sidebar.css";

function FindDriver() {
  const history = useHistory();
  const orderId = sessionStorage.getItem("current_order_id");

  useEffect(() => {
    if (!orderId) {
      history.push("/user/dashboard");
      return;
    }

    const interval = setInterval(() => {
      ordersAPI.getOrderDetail(orderId)
        .then(res => {
          if (res.data.status === "assigned") {
            clearInterval(interval);
            // Driver found! 
            alert("Petugas Ditemukan!");
            history.push("/user/tracking-petugas"); // Redirect to tracking page
          }
        })
        .catch(err => console.error(err));
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, history]);

  const handleCancel = () => {
    // Optionally call an endpoint to cancel the order here
    history.push("/user/dashboard");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div style={{ backgroundColor: "#F0F9F1", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Container className="text-center d-flex flex-column" style={{ flexGrow: 1 }}>
        <div 
          className="w-100 py-4 mt-5" 
          style={{ backgroundColor: "rgba(180, 188, 180, 0.5)", borderRadius: "15px" }}
        >
          <h5 style={{ fontWeight: "bold", margin: 0, color: "#333" }}>Mencari Petugas Terdekat .....</h5>
          <p style={{ margin: 0, color: "#555" }}>Mohon tunggu</p>
        </div>

        <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
          <div 
            style={{ 
              width: "150px", 
              height: "150px", 
              backgroundColor: "#333", 
              borderRadius: "15px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
            }}
          >
            <Spinner animation="border" variant="light" style={{ width: "3rem", height: "3rem" }} />
            <span className="text-white mt-3" style={{ fontWeight: "bold" }}>Loading..</span>
          </div>
          
          <p className="mt-5 px-4 text-muted" style={{ lineHeight: "1.6" }}>
            Kami sedang mencari petugas yang tersedia di sekitar anda.
          </p>
        </div>

        <div className="mb-5 pb-4 w-100">
          <Button 
            variant="light" 
            className="w-100 py-3" 
            style={{ 
              borderRadius: "25px", 
              border: "2px solid #4CAF50",
              fontWeight: "bold",
              color: "#333"
            }}
            onClick={handleCancel}
          >
            Batalkan
          </Button>
        </div>
      </Container>
        </div>
      </main>
    </div>
  );
}

export default FindDriver;
