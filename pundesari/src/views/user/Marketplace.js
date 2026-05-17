import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import "../../css/Dashboard.css";
import "../../css/sidebar.css";
import { dashboardAPI, marketplaceAPI } from "../../services/api";

function Marketplace() {
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [balanceData, setBalanceData] = useState({
    saldo: 0,
    saldo_hold: 0,
    available_balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [processingProductId, setProcessingProductId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const userId = localStorage.getItem("userId") || 1;

  useEffect(() => {
    loadMarketplace();
  }, [userId]);

  const loadMarketplace = async () => {
    setLoading(true);
    setFeedback(null);

    try {
      const [productsRes, balanceRes] = await Promise.all([
        marketplaceAPI.getProducts(),
        dashboardAPI.getUserBalance(userId),
      ]);

      setProducts(productsRes.data || []);
      setBalanceData({
        saldo: balanceRes.data.saldo || 0,
        saldo_hold: balanceRes.data.saldo_hold || 0,
        available_balance: balanceRes.data.available_balance || 0,
      });
    } catch (err) {
      console.error("Error loading marketplace:", err);
      setFeedback({
        type: "danger",
        message: err.response?.data?.message || "Gagal memuat marketplace.",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshBalance = async () => {
    setRefreshing(true);
    try {
      const balanceRes = await dashboardAPI.getUserBalance(userId);
      setBalanceData({
        saldo: balanceRes.data.saldo || 0,
        saldo_hold: balanceRes.data.saldo_hold || 0,
        available_balance: balanceRes.data.available_balance || 0,
      });
    } catch (err) {
      console.error("Failed to refresh balance:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePurchase = async (product) => {
    if (processingProductId || product.stok <= 0) {
      return;
    }

    const quantity = 1;
    const totalPrice = Number(product.harga || 0) * quantity;
    if (balanceData.available_balance < totalPrice) {
      setFeedback({ type: "warning", message: "Saldo tersedia tidak cukup untuk membeli produk ini." });
      return;
    }

    // Show confirmation modal instead of immediate purchase
    setConfirmModal({
      product,
      quantity,
      totalPrice,
    });
  };

  const confirmPurchase = async () => {
    if (!confirmModal) return;

    const { product, quantity, totalPrice } = confirmModal;
    setProcessingProductId(product.id);
    setConfirmModal(null);
    setFeedback(null);

    try {
      const { data } = await marketplaceAPI.createOrder(product.id, {
        jumlah: quantity,
        catatan: `Beli ${product.nama} x${quantity}`,
      });

      setFeedback({
        type: "success",
        message: `✓ ${quantity} ${product.nama} berhasil dibayar dengan saldo! Silahkan ambil di koperasi. Total: Rp ${Number(totalPrice).toLocaleString('id-ID')}`,
      });
      await Promise.all([loadMarketplace(), refreshBalance()]);
    } catch (err) {
      console.error("Marketplace purchase failed:", err);
      setFeedback({
        type: "danger",
        message: err.response?.data?.message || "Gagal melakukan pembelian. Coba lagi.",
      });
    } finally {
      setProcessingProductId(null);
    }
  };

  const cancelPurchase = () => {
    setConfirmModal(null);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <header className="topbar">
          <div className="page-title">
            <h2>Marketplace</h2>
            <p>Belanja produk dengan saldo tersedia, tanpa mengurangi saldo hol yang tertahan.</p>
          </div>
          <div className="topbar-right">
            <button className="link-btn" onClick={() => history.push('/user/dashboard')}>
              Kembali ke Dashboard
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {feedback && (
            <div className={`alert ${feedback.type === 'success' ? 'alert-success' : feedback.type === 'warning' ? 'alert-warning' : 'alert-danger'}`}>
              {feedback.message}
            </div>
          )}

          <section
            className="hero-banner"
            style={{
              padding: '1.75rem',
              marginBottom: '1.75rem',
              borderRadius: 24,
              background: 'linear-gradient(135deg, #1d976c 0%, #93f9b9 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className="hero-banner-text" style={{ maxWidth: '60%' }}>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.6rem' }}>Belanja Pintar di K-TRASH Marketplace</h3>
              <p style={{ margin: 0, opacity: 0.95, lineHeight: 1.6 }}>
                Gunakan saldo tersedia untuk membeli produk favoritmu, langsung bayar dengan saldo, tanpa ribet dan tanpa mengurangi saldo hol.
              </p>
            </div>
            <div className="hero-banner-summary" style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>Saldo Tersedia</div>
              <h2 style={{ margin: '0.35rem 0', fontSize: '2.4rem', letterSpacing: '0.02em' }}>
                Rp {Number(balanceData.available_balance).toLocaleString('id-ID')}
              </h2>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>Saldo total: Rp {Number(balanceData.saldo).toLocaleString('id-ID')}</p>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.95rem' }}>Saldo tertahan: Rp {Number(balanceData.saldo_hold).toLocaleString('id-ID')}</p>
              <button
                className="link-btn"
                onClick={refreshBalance}
                disabled={refreshing}
                style={{
                  marginTop: '1rem',
                  borderRadius: 999,
                  padding: '0.65rem 1.2rem',
                  border: '1px solid rgba(255,255,255,0.45)',
                  color: '#fff',
                  background: 'rgba(255,255,255,0.12)',
                  transition: 'all 0.2s ease',
                }}
              >
                {refreshing ? 'Menyegarkan...' : 'Segarkan Saldo'}
              </button>
            </div>
          </section>

          <section className="info-card" style={{ padding: 0 }}>
            <div className="info-card-header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Daftar Produk Marketplace</h3>
              <button className="link-btn" onClick={loadMarketplace} disabled={loading}>
                {loading ? 'Memuat...' : 'Segarkan Daftar'}
              </button>
            </div>

            {loading ? (
              <div style={{ padding: 20, textAlign: 'center' }}>Memuat produk...</div>
            ) : products.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center' }}>Belum ada produk marketplace.</div>
            ) : (
              <div
                className="marketplace-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                  padding: '1rem',
                }}
              >
                {products.map((product) => {
                  const price = Number(product.harga || 0);
                  const canBuy = product.stok > 0 && balanceData.available_balance >= price;
                  return (
                    <div
                      key={product.id}
                      className="marketplace-card"
                      style={{
                        padding: '1.35rem',
                        border: '1px solid rgba(98, 90, 255, 0.12)',
                        borderRadius: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: 250,
                        background: '#fff',
                        boxShadow: '0 18px 32px rgba(15, 23, 42, 0.06)',
                      }}
                    >
                      <div>
                        <div
                          className="marketplace-card-header"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '1rem',
                          }}
                        >
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>{product.nama}</h4>
                            <p className="text-muted" style={{ margin: '0.35rem 0', color: '#6b7280', lineHeight: 1.6 }}>
                              {product.deskripsi || 'Produk marketplace'}.
                            </p>
                          </div>
                          <span
                            className="product-badge"
                            style={{
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              padding: '0.4rem 0.9rem',
                              borderRadius: 999,
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {product.kategori || 'Lokal'}
                          </span>
                        </div>
                        <div style={{ margin: '1.2rem 0' }}>
                          <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#111827' }}>
                            Rp {price.toLocaleString('id-ID')}
                          </p>
                          <p style={{ margin: '0.5rem 0 0', color: '#6b7280', fontSize: '0.95rem' }}>
                            Stok: {product.stok}
                          </p>
                        </div>
                      </div>
                      <button
                        className="cta-btn"
                        style={{
                          width: '100%',
                          padding: '0.95rem',
                          borderRadius: 14,
                          background: canBuy ? '#2563eb' : '#e5e7eb',
                          color: canBuy ? '#fff' : '#6b7280',
                          border: 'none',
                          fontWeight: 700,
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          boxShadow: canBuy ? '0 12px 24px rgba(37, 99, 235, 0.18)' : 'none',
                          cursor: !canBuy || processingProductId === product.id ? 'not-allowed' : 'pointer',
                        }}
                        disabled={!canBuy || processingProductId === product.id}
                        onClick={() => handlePurchase(product)}
                      >
                        {processingProductId === product.id
                          ? 'Memproses...'
                          : product.stok <= 0
                          ? 'Habis'
                          : canBuy
                          ? 'Beli Sekarang'
                          : 'Saldo Tidak Cukup'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {confirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '2rem',
            maxWidth: 400,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            textAlign: 'center',
          }}>
            <h3 style={{ marginTop: 0 }}>Konfirmasi Pembayaran</h3>
            <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                Produk: <strong>{confirmModal.product.nama}</strong>
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    const quantity = Math.max(1, confirmModal.quantity - 1);
                    const totalPrice = Number(confirmModal.product.harga || 0) * quantity;
                    setConfirmModal({ ...confirmModal, quantity, totalPrice });
                  }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    border: '1px solid #ddd',
                    background: '#fff',
                    cursor: confirmModal.quantity === 1 ? 'not-allowed' : 'pointer',
                    color: confirmModal.quantity === 1 ? '#ccc' : '#111',
                  }}
                  disabled={confirmModal.quantity === 1}
                >
                  −
                </button>
                <div style={{ minWidth: 64, textAlign: 'center', fontSize: '1.1rem', fontWeight: 700 }}>
                  {confirmModal.quantity}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const quantity = Math.min(confirmModal.product.stok, confirmModal.quantity + 1);
                    const totalPrice = Number(confirmModal.product.harga || 0) * quantity;
                    setConfirmModal({ ...confirmModal, quantity, totalPrice });
                  }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    border: '1px solid #ddd',
                    background: '#fff',
                    cursor: confirmModal.quantity >= confirmModal.product.stok ? 'not-allowed' : 'pointer',
                    color: confirmModal.quantity >= confirmModal.product.stok ? '#ccc' : '#111',
                  }}
                  disabled={confirmModal.quantity >= confirmModal.product.stok}
                >
                  +
                </button>
              </div>
              <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#27ae60', margin: '1rem 0' }}>
                Total: Rp {Number(confirmModal.totalPrice).toLocaleString('id-ID')}
              </p>
              <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0.3rem' }}>
                Saldo setelah membeli: Rp {Number(balanceData.available_balance - confirmModal.totalPrice).toLocaleString('id-ID')}
              </p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Bayar langsung dengan saldo tersedia.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={cancelPurchase}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  background: '#f5f5f5',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                Batal
              </button>
              <button
                onClick={confirmPurchase}
                disabled={processingProductId === confirmModal.product.id || balanceData.available_balance < confirmModal.totalPrice}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: balanceData.available_balance < confirmModal.totalPrice ? '#9ca3af' : '#16a34a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: balanceData.available_balance < confirmModal.totalPrice || processingProductId === confirmModal.product.id ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                  opacity: processingProductId === confirmModal.product.id ? 0.6 : 1,
                }}
              >
                {processingProductId === confirmModal.product.id ? 'Memproses...' : 'Bayar dengan Saldo'}
              </button>
            </div>
            {balanceData.available_balance < confirmModal.totalPrice && (
              <p style={{ marginTop: '1rem', color: '#b91c1c', fontSize: '0.9rem' }}>
                Saldo tidak cukup untuk jumlah ini. Kurangi jumlah atau isi saldo terlebih dahulu.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Marketplace;
