import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import "../../css/Dashboard.css";
import "../../css/HargaSampah.css";
import { hargaAPI } from "../../services/api";

const HargaSampah = () => {
  const [selectedCategory, setSelectedCategory] = useState("anorganik");
  const [hargaList, setHargaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch harga sampah berdasarkan kategori
    hargaAPI
      .getByJenis(selectedCategory)
      .then((res) => {
        setHargaList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedCategory]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* TOPBAR */}
        <header className="topbar">
          <div></div>
          <div className="topbar-right">
            <div className="notif-btn">🔔</div>
            <div className="user-profile">
              <div className="user-avatar">
                <img src="https://i.pravatar.cc/150?u=a" alt="avatar" />
              </div>
              <div className="user-info">
                <span className="user-name">
                  {localStorage.getItem("nama") || "User"}
                </span>
                <span className="user-id">
                  {localStorage.getItem("userId") || "001"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="dashboard-content">
          {/* HEADER */}
          <div className="harga-header">
            <div className="header-text">
              <h1>Daftar Harga Sampah</h1>
              <p>Lihat harga terkini untuk setiap jenis sampah yang bisa kami terima</p>
            </div>
          </div>

          {/* KATEGORI FILTER */}
          <div className="kategori-filter">
            {["organik", "anorganik", "lainnya"].map((kategori) => (
              <button
                key={kategori}
                className={`filter-btn ${selectedCategory === kategori ? "active" : ""}`}
                onClick={() => setSelectedCategory(kategori)}
              >
                {kategori.charAt(0).toUpperCase() + kategori.slice(1)}
              </button>
            ))}
          </div>

          {/* HARGA LIST */}
          <div className="harga-grid">
            {loading ? (
              <p className="text-center">Memuat data...</p>
            ) : hargaList.length === 0 ? (
              <p className="text-center">Data tidak ditemukan</p>
            ) : (
              hargaList.map((item) => (
                <div key={item.id} className="harga-card">
                  <div className="harga-card-icon">🗂️</div>
                  <div className="harga-card-info">
                    <h4>{item.sub_jenis}</h4>
                    <p className="harga-price">Rp {item.harga}/kg</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HargaSampah;
