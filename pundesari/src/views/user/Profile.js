import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Card, Row, Col, ListGroup } from "react-bootstrap";
import Sidebar from "../../components/Sidebar.jsx";
import "../../css/Dashboard.css";
import "../../css/sidebar.css";

function Profile() {
  const history = useHistory();
  const [user] = useState({
    name: localStorage.getItem("nama") || "User",
    email: localStorage.getItem("email") || "user@example.com",
    phoneNumber: localStorage.getItem("nomor_hp") || "-",
  });

  const handleLogout = () => {
    localStorage.clear();
    history.push("/login");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div style={{ backgroundColor: "#F5F5F5", minHeight: "100vh" }}>
          <div style={{
        height: "200px",
        background: "linear-gradient(to bottom, #81C784, #C8E6C9)"
      }}></div>
      <Container style={{ marginTop: "-150px" }}>
        <Row>
          <Col md="8" className="mx-auto">
            <div className="d-flex align-items-center mb-4">
              <i 
                className="nc-icon nc-minimal-left" 
                style={{ fontSize: "24px", cursor: "pointer", marginRight: "15px" }}
                onClick={() => history.push("/user/dashboard")}
              ></i>
              <h4 style={{ fontWeight: "bold", color: "#333", margin: "0" }}>Profileku</h4>
            </div>
            
            <Card style={{ borderRadius: "15px", boxShadow: "0 5px 10px rgba(0,0,0,0.1)", border: "none" }}>
              <Card.Body className="d-flex align-items-center p-4">
                <div style={{
                  width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#eee", display: "flex", justifyContent: "center", alignItems: "center"
                }}>
                  <i className="nc-icon nc-single-02" style={{ fontSize: "40px", color: "#fff" }}></i>
                </div>
                <div className="ml-4 flex-grow-1">
                  <h5 style={{ fontWeight: "bold", margin: "0" }}>{user.name}</h5>
                  <p style={{ color: "#888", margin: "0", fontSize: "14px" }}>{user.email}</p>
                  <p style={{ color: "#888", margin: "0", fontSize: "14px" }}>{user.phoneNumber}</p>
                </div>
                <i className="nc-icon nc-settings-gear-64 text-muted"></i>
              </Card.Body>
            </Card>

            <h6 className="text-muted mt-4 mb-3" style={{ fontSize: "13px", paddingLeft: "15px" }}>Aktivitas BankTrash</h6>
            <Card style={{ borderRadius: "15px", border: "none" }}>
              <ListGroup variant="flush" style={{ borderRadius: "15px" }}>
                <ListGroup.Item action className="d-flex justify-content-between align-items-center" style={{ border: "none" }}>
                  <div><i className="nc-icon nc-pin-3 mr-3 text-dark"></i> Alamat Tersimpan</div>
                  <i className="nc-icon nc-minimal-right text-muted"></i>
                </ListGroup.Item>
                <ListGroup.Item action className="d-flex justify-content-between align-items-center" style={{ border: "none" }}>
                  <div><i className="nc-icon nc-time-alarm mr-3 text-dark"></i> Aktivitas</div>
                  <i className="nc-icon nc-minimal-right text-muted"></i>
                </ListGroup.Item>
              </ListGroup>
            </Card>

            <h6 className="text-muted mt-4 mb-3" style={{ fontSize: "13px", paddingLeft: "15px" }}>Lainnya</h6>
            <Card style={{ borderRadius: "15px", border: "none" }}>
              <ListGroup variant="flush" style={{ borderRadius: "15px" }}>
                <ListGroup.Item action className="d-flex justify-content-between align-items-center" style={{ border: "none" }}>
                  <div><i className="nc-icon nc-support-17 mr-3 text-dark"></i> Bantuan dan laporan</div>
                  <i className="nc-icon nc-minimal-right text-muted"></i>
                </ListGroup.Item>
                <ListGroup.Item action className="d-flex justify-content-between align-items-center" style={{ border: "none" }}>
                  <div><i className="nc-icon nc-paper-2 mr-3 text-dark"></i> Ketentuan layanan</div>
                  <i className="nc-icon nc-minimal-right text-muted"></i>
                </ListGroup.Item>
                <ListGroup.Item action className="d-flex justify-content-between align-items-center" style={{ border: "none" }}>
                  <div><i className="nc-icon nc-simple-remove mr-3 text-dark"></i> Hapus akun</div>
                  <i className="nc-icon nc-minimal-right text-muted"></i>
                </ListGroup.Item>
                <ListGroup.Item action onClick={handleLogout} className="d-flex justify-content-between align-items-center text-danger" style={{ border: "none", cursor: "pointer" }}>
                  <div><i className="nc-icon nc-button-power mr-3"></i> Keluar</div>
                  <i className="nc-icon nc-minimal-right"></i>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
        </div>
      </main>
    </div>
  );
}

export default Profile;
