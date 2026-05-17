import React from "react";
// Ganti useNavigate menjadi useHistory untuk React Router v5
import { useHistory } from "react-router-dom";
import "./landingpage.css";

// Pastikan path ini sesuai dengan struktur folder src Anda
import HeroImage from "../assets/hero.png";
import Logo from "../assets/LogoK-Trash.png";

const LandingPage = () => {
  // Inisialisasi history
  const history = useHistory();

  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo-wrapper">
            <img src={Logo} alt="logo" className="logo-img" />
            <h1 className="logo-text">K-Trash</h1>
          </div>

          <ul className="nav-menu">
            <li className="active">Beranda</li>
            <li>Fitur</li>
            <li>Cara Kerja</li>
            <li>Tentang Kami</li>
            <li>Kontak</li>
          </ul>

          {/* Gunakan history.push untuk pindah ke halaman login */}
          <button className="login-btn" onClick={() => history.push("/login")}>
            <span className="login-icon"></span> Masuk / Daftar
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-left">
          <div className="badge">🌱 Solusi Cerdas untuk Lingkungan Bersih</div>

          <h1 className="hero-title">
            Kelola Sampah,
            <br />
            Jadi Lebih Mudah,
            <br />
            <span>Bermanfaat,</span>
            <br />
            <span>dan Berkelanjutan</span>
          </h1>

          <p className="hero-description">
            K-Trash membantu Anda mengelola sampah dengan praktis. Pantau saldo,
            request jemput, dan lihat harga sampah dengan transparan.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => history.push("/login")}>
              Mulai Sekarang →
            </button>
            <button className="secondary-btn">Pelajari Lebih Lanjut</button>
          </div>

          <div className="hero-features">
            <div className="feature-item">
              <div className="feature-icon">💰</div>
              <p>Saldo Aman &amp; Transparan</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🚛</div>
              <p>Jemput Sampah Cepat &amp; Mudah</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🏷️</div>
              <p>Harga Jelas per Kg</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <img src={HeroImage} alt="Hero" className="hero-image" />
        </div>
      </section>

      {/* FITUR UTAMA */}
      <section className="feature-section">
        <div className="section-title">
          <span className="section-badge">FITUR UTAMA</span>
          <h2>
            Semua yang Anda Butuhkan
            <br />
            dalam Satu Genggaman
          </h2>
        </div>

        <div className="feature-cards">
          <div className="feature-card">
            <div className="card-icon-wrap">
              <span className="card-icon">💳</span>
            </div>
            <h3>1. Lihat Saldo</h3>
            <p>
              Pantau saldo Anda secara real-time setiap saat. Transaksi aman dan
              riwayat jelas.
            </p>
            <button className="card-btn" onClick={() => history.push("/login")}>
              Lihat Saldo
            </button>
          </div>

          <div className="feature-card">
            <div className="card-icon-wrap">
              <span className="card-icon">🚛</span>
            </div>
            <h3>2. Request Jemput Sampah</h3>
            <p>
              Ajukan penjemputan dengan mudah. Pilih jadwal, jenis sampah, dan
              lokasi Anda.
            </p>
            <button className="card-btn" onClick={() => history.push("/login")}>
              Request Jemput
            </button>
          </div>

          <div className="feature-card">
            <div className="card-icon-wrap">
              <span className="card-icon">🏷️</span>
            </div>
            <h3>3. Harga Sampah per Kg</h3>
            <p>
              Lihat daftar harga terbaru per kg. Transparan dan selalu
              diperbarui.
            </p>
            <button className="card-btn" onClick={() => history.push("/login")}>
              Lihat Harga
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo-wrapper">
              <img src={Logo} alt="logo" className="logo-img" />
              <h1 className="logo-text">K-Trash</h1>
            </div>
            <p className="footer-text">
              Platform digital untuk pengelolaan sampah yang lebih efisien,
              transparan, dan berkelanjutan.
            </p>
            <div className="footer-socials">
              <span className="social-icon">📘</span>
              <span className="social-icon">📸</span>
              <span className="social-icon">🐦</span>
              <span className="social-icon">▶️</span>
            </div>
          </div>

          <div>
            <h3>Menu</h3>
            <ul>
              <li>Beranda</li>
              <li>Fitur</li>
              <li>Cara Kerja</li>
              <li>Tentang Kami</li>
              <li>Kontak</li>
            </ul>
          </div>

          <div>
            <h3>Lainnya</h3>
            <ul>
              <li>FAQ</li>
              <li>Kebijakan Privasi</li>
              <li>Syarat &amp; Ketentuan</li>
            </ul>
          </div>

          <div>
            <h3>Kontak Kami</h3>
            <ul>
              <li>
                <span className="contact-icon">📍</span> Jl. Green City No. 123, Surabaya, Indonesia
              </li>
              <li>
                <span className="contact-icon">✉️</span> info@ktrash.id
              </li>
              <li>
                <span className="contact-icon">📞</span> 0812-3456-7890
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
