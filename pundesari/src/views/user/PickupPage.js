import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Sidebar from "../../components/Sidebar.jsx";
import "../../css/Dashboard.css";
import "../../css/sidebar.css";

// Fix Leaflet's default icon path issues with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically update map center
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function PickupPage() {
  const history = useHistory();
  const username = localStorage.getItem("nama") || "User";

  const [alamat, setAlamat] = useState("");
  const [catatan, setCatatan] = useState("");
  const [position, setPosition] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedDesa, setSelectedDesa] = useState("");

  const dataNgawi = {
    "Pangkur": ["Pangkur", "Bendo", "Cengkok", "Gandri"],
    "Karangjati": ["Karangjati", "Campurasri", "Danguk"],
    "Geneng": ["Geneng", "Kedunggalar", "Ngrambe"],
    "Wonoasri": ["Wonoasri", "Purwosari", "Buduran", "Klitik"],
  };

  useEffect(() => {
    handleGetLocation();
  }, []);

  useEffect(() => {
    if (selectedKecamatan && selectedDesa) {
      setAlamat(`${selectedDesa}, ${selectedKecamatan}, Ngawi`);
    }
  }, [selectedKecamatan, selectedDesa]);

const handleGetLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = Number(pos.coords.latitude);
          const lng = Number(pos.coords.longitude);
          
          console.log("GPS RAW:", pos.coords);
          console.log("FINAL LAT:", lat);
          console.log("FINAL LNG:", lng);
          
          setPosition([lat, lng]);

          try {
            // Memanggil API Reverse Geocoding (Gratis dari OpenStreetMap)
            // IMPORTANT: Hanya untuk alamat, koordinat tetap dari GPS
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();

            // Ambil alamat lengkap yang diformat oleh API
            // Tapi koordinat tetap menggunakan pos.coords
            if (data && data.display_name) {
              setAlamat(data.display_name);
            } else {
              setAlamat(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
            }
          } catch (err) {
            console.error("Gagal mendapatkan alamat:", err);
            setAlamat(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
          } finally {
            setIsLocating(false);
          }
        },
        (err) => {
          console.error("Geolocation Error:", err);
          setIsLocating(false);
          alert("Gagal mengakses lokasi. Pastikan izin lokasi aktif.");
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    } else {
      setIsLocating(false);
      alert("Browser Anda tidak mendukung fitur lokasi.");
    }
  };

  const handleNext = () => {
    // In a real app we might pass this via context/redux or state.
    // Here we use sessionStorage for temporary flow data
    sessionStorage.setItem("pickup_alamat", alamat);
    sessionStorage.setItem("pickup_catatan", catatan);
    if (position) {
      sessionStorage.setItem("pickup_lat", position[0]);
      sessionStorage.setItem("pickup_lng", position[1]);
    }
    history.push("/user/select-waste");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
          <Container className="py-4">
        <div className="d-flex align-items-center mb-4">
          <i 
            className="nc-icon nc-minimal-left" 
            style={{ fontSize: "24px", cursor: "pointer", marginRight: "15px" }}
            onClick={() => history.goBack()}
          ></i>
          <div>
            <h5 style={{ fontWeight: "bold", margin: 0 }}>Halo {username}</h5>
            <small className="text-muted">daur ulang sampahmu yuk!</small>
          </div>
        </div>

        <h6 style={{ fontWeight: "bold" }}>Tipe Pengangkutan Sampahmu</h6>
        <div 
          className="p-3 mb-4" 
          style={{ backgroundColor: "#D1E4FF", borderRadius: "12px", display: "flex", alignItems: "center" }}
        >
          <i className="nc-icon nc-delivery-fast text-primary mr-3" style={{ fontSize: "30px" }}></i>
          <div>
            <h6 style={{ fontWeight: "bold", margin: 0 }}>Jemput Sampah</h6>
            <small className="text-muted">Petugas kami menjemput sampahmu</small>
          </div>
        </div>

        <h6 style={{ fontWeight: "bold" }}>Lokasi Penjemputan</h6>
        <Form.Group className="mb-3">
          <Form.Control 
            type="text" 
            placeholder="masukkan alamat mu" 
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            style={{ borderRadius: "8px", border: "1px solid #4CAF50" }}
          />
        </Form.Group>

        {/* Map Area */}
        <div style={{ height: "250px", borderRadius: "12px", overflow: "hidden", border: "1px solid #ddd", marginBottom: "15px" }}>
          {isLocating && !position ? (
            <div className="d-flex justify-content-center align-items-center h-100 bg-light">
              <span>Memuat Peta...</span>
            </div>
          ) : (
            <MapContainer 
              center={position || [-6.8915, 111.4944]} 
              zoom={16} 
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              {position && (
                <>
                  <ChangeView center={position} zoom={16} />
                  <Marker position={position} icon={redIcon}>
                    <Popup>Lokasi Penjemputan</Popup>
                  </Marker>
                </>
              )}
            </MapContainer>
          )}
        </div>

        <Button 
          variant="success" 
          className="w-100 mb-4" 
          style={{ borderRadius: "20px" }}
          onClick={handleGetLocation}
        >
          <i className="nc-icon nc-pin-3 mr-2"></i> Gunakan Lokasi Saat Ini
        </Button>

        <h6 style={{ fontWeight: "bold" }}>
          <i className="nc-icon nc-chat-33 mr-2"></i> Catatan untuk petugas
        </h6>
        <Form.Group className="mb-4">
          <Form.Control 
            as="textarea" 
            rows={4} 
            placeholder="Detail Lainnya (Cth: Blok / Unit., Patokan)" 
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            style={{ borderRadius: "15px" }}
          />
        </Form.Group>

        <Row>
          <Col>
            <Button 
              variant="outline-success" 
              className="w-100" 
              style={{ borderRadius: "20px" }}
              onClick={() => history.goBack()}
            >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button 
              variant="success" 
              className="w-100" 
              style={{ borderRadius: "20px" }}
              onClick={handleNext}
            >
              Berikutnya
            </Button>
          </Col>
        </Row>
      </Container>
        </div>
      </main>
    </div>
  );
}

export default PickupPage;
