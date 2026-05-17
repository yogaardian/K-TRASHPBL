import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import "../css/sidebar.css";

const navItems = [
  { icon: "🏠", label: "Beranda", path: "/user/dashboard" },
  { icon: "💳", label: "Saldo & Poin", path: "/user/saldo" },
  { icon: "🛒", label: "Marketplace", path: "/user/marketplace" },
  { icon: "🚛", label: "Jemput Sampah", path: "/user/pickup" },
  { icon: "🏷️", label: "Harga Sampah", path: "/user/harga" },
  { icon: "🕐", label: "Riwayat", path: "/user/history" },
  // { icon: "🔔", label: "Notifikasi", path: "/user/notifications", badge: 2 },
  { icon: "⚙️", label: "Pengaturan", path: "/user/profile" },
];

const Sidebar = () => {
  const history = useHistory();
  const location = useLocation();

  return (
    <aside className="user-sidebar">
      <div className="user-sidebar-logo" onClick={() => history.push("/user/dashboard")}>
        <span className="user-sidebar-logo-text">K-Trash</span>
      </div>

      <nav className="user-sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.label}
            className={`user-sidebar-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => history.push(item.path)}
          >
            <span className="user-sidebar-item-icon">{item.icon}</span>
            <span className="user-sidebar-item-label">{item.label}</span>
            {item.badge && (
              <span className="user-sidebar-badge">{item.badge}</span>
            )}
          </div>
        ))}
      </nav>

      <div className="user-sidebar-leaf">🌿</div>
    </aside>
  );
};

export default Sidebar;
