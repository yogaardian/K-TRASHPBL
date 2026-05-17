import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ordersAPI } from "../../services/api";

function OrderDetail() {
  const history = useHistory();
  const location = useLocation();
  const order = location.state?.order;
  const driverId = localStorage.getItem("userId") || 1;

  if (!order) {
    history.push("/driver/dashboard");
    return null;
  }

  const handleAcceptOrder = async () => {
    try {
      const response = await ordersAPI.acceptOrder(order.id, parseInt(driverId));
      if (response.data.status === "success") {
        alert("Order Berhasil Diterima!");
        const acceptedOrder = { ...order, status: "assigned", driver_id: parseInt(driverId) };
        sessionStorage.setItem("tracking_order", JSON.stringify(acceptedOrder));
        sessionStorage.setItem("current_order_id", order.id);
        history.push("/driver/tracking-user", { order: acceptedOrder });
      } else {
        alert(response.data.message || "Gagal menerima order");
      }
    } catch (err) {
      console.error(err);
      alert("Error menerima order");
    }
  };

  const centerMap = order.user_lat && order.user_lng 
    ? [order.user_lat, order.user_lng] 
    : [-7.8, 110.3]; // Default fallback

  return (
    <div style={{ backgroundColor: "#F7F1F1", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div className="p-3 bg-white shadow-sm d-flex align-items-center">
        <i 
          className="nc-icon nc-minimal-left" 
          style={{ fontSize: "24px", cursor: "pointer", marginRight: "15px" }}
          onClick={() => history.goBack()}
        ></i>
        <h5 style={{ fontWeight: "bold", margin: 0 }}>Detail Order</h5>
      </div>

      {/* Map Snapshot */}
      <div className="p-3">
        <div style={{ height: "200px", borderRadius: "16px", overflow: "hidden", zIndex: 0 }}>
          <MapContainer center={centerMap} zoom={15} style={{ height: "100%", width: "100%" }} zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={centerMap}>
              <Popup>{order.address}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow-1 bg-white p-4" style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}>
        
        {/* Profile */}
        <Row className="mb-4 align-items-center">
          <Col xs="auto">
            <div style={{ width: "50px", height: "50px", backgroundColor: "#4CAF50", color: "white", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px", fontWeight: "bold" }}>
              U
            </div>
          </Col>
          <Col>
            <h5 style={{ fontWeight: "bold", margin: 0 }}>User {order.user_id}</h5>
            <small className="text-muted">{order.address}</small>
          </Col>
        </Row>

        {/* Info Order */}
        <div className="p-3 mb-4" style={{ backgroundColor: "#F5F5F5", borderRadius: "12px" }}>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Kode Customer</span>
            <span style={{ fontWeight: "bold" }}>{order.id}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Jenis Sampah</span>
            <span style={{ fontWeight: "bold" }}>{order.jenis_sampah || "Tidak ada"}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Catatan</span>
            <span style={{ fontWeight: "bold", textAlign: "right", maxWidth: "60%" }}>{order.catatan || "Tidak ada catatan"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <Row className="mb-4">
          <Col>
            <Button variant="outline-primary" className="w-100" style={{ borderRadius: "10px", fontWeight: "bold" }}>
              Chat
            </Button>
          </Col>
          <Col>
            <Button variant="success" className="w-100" style={{ backgroundColor: "#4CAF50", border: "none", borderRadius: "10px", fontWeight: "bold" }}>
              Telepon
            </Button>
          </Col>
        </Row>

        <div className="mt-auto pt-3">
          <Button 
            className="w-100 py-3" 
            style={{ backgroundColor: "#4CAF50", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "bold" }}
            onClick={handleAcceptOrder}
          >
            Ambil order
          </Button>
        </div>

      </div>
    </div>
  );
}

export default OrderDetail;
