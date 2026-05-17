import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import "../../css/Dashboard.css";
import "../../css/sidebar.css";
import { dashboardAPI, marketplaceAPI } from "../../services/api";

const CATEGORIES = ['Semua', 'Beras', 'Minyak', 'Telur', 'Gula', 'Tepung', 'Bumbu', 'Minuman', 'Paket'];

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
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const userId = localStorage.getItem("userId") || 1;

  const getCategoryPlaceholder = (category) => {
    const categoryKey = (category || '').toLowerCase();
    const placeholders = {
      beras: 'https://dummyimage.com/520x320/16a34a/ffffff&text=Beras',
      minyak: 'https://dummyimage.com/520x320/16a34a/ffffff&text=Minyak',
      telur: 'https://dummyimage.com/520x320/16a34a/ffffff&text=Telur',
      gula: 'https://dummyimage.com/520x320/16a34a/ffffff&text=Gula',
      tepung: 'https://dummyimage.com/520x320/16a34a/ffffff&text=Tepung',
      bumbu: 'https://dummyimage.com/520x320/16a34a/ffffff&text=Bumbu',
      minuman: 'https://dummyimage.com/520x320/16a34a/ffffff&text=Minuman',
      paket: 'https://dummyimage.com/520x320/16a34a/ffffff&text=Paket',
    };
    return placeholders[categoryKey] || 'https://via.placeholder.com/520x320/ffffff/16a34a?text=Produk+Sembako';
  };

  const getProductImage = (product) => {
    if (product?.gambar) return product.gambar;
    return getCategoryPlaceholder(product?.kategori || product?.nama);
  };

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
        saldo: Number(balanceRes.data.saldo || 0),
        saldo_hold: Number(balanceRes.data.saldo_hold || 0),
        available_balance: Number(balanceRes.data.available_balance || 0),
      });
    } catch (err) {
      console.error("Error loading marketplace:", err);
      setFeedback({
        type: "danger",
        message: err.response?.data?.message || "Gagal memuat marketplace.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshBalance = async () => {
    setRefreshing(true);
    try {
      const balanceRes = await dashboardAPI.getUserBalance(userId);
      setBalanceData({
        saldo: Number(balanceRes.data.saldo || 0),
        saldo_hold: Number(balanceRes.data.saldo_hold || 0),
        available_balance: Number(balanceRes.data.available_balance || 0),
      });
    } catch (err) {
      console.error("Failed to refresh balance:", err);
      setFeedback({
        type: "danger",
        message: err.response?.data?.message || "Gagal menyegarkan saldo.",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      product.nama.toLowerCase().includes(term) ||
      (product.deskripsi || '').toLowerCase().includes(term);

    const matchesCategory =
      selectedCategory === 'Semua' ||
      product.kategori?.toLowerCase() === selectedCategory.toLowerCase() ||
      product.nama.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handlePurchase = (product) => {
    if (processingProductId || product.stok <= 0) return;

    const quantity = 1;
    const totalPrice = Number(product.harga || 0) * quantity;
    if (balanceData.available_balance < totalPrice) {
      setFeedback({
        type: "warning",
        message: "Saldo tersedia tidak cukup untuk membeli produk ini.",
      });
      return;
    }

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
      await marketplaceAPI.createOrder(product.id, {
        jumlah: quantity,
        catatan: `Beli ${product.nama} x${quantity}`,
      });

      await Promise.all([loadMarketplace(), refreshBalance()]);
      setFeedback({
        type: "success",
        message: "Pesanan selesai! Silahkan ambil di koperasi desa.",
      });
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

  const cancelPurchase = () => setConfirmModal(null);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main" style={{ background: '#f8fafc' }}>
        <div style={{ padding: '1.5rem 1.5rem 2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: '1 1 520px', minWidth: 280, borderRadius: 28, padding: '2rem', background: '#ffffff', boxShadow: '0 24px 80px rgba(15, 23, 42, 0.08)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ maxWidth: 520 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', padding: '0.55rem 1rem', borderRadius: 999, background: '#d9f99d', color: '#166534', fontWeight: 700, fontSize: '0.85rem' }}>
                    Kebutuhan Sembako
                  </div>
                  <h1 style={{ margin: '1rem 0 0.8rem', fontSize: '2.45rem', lineHeight: 1.05, color: '#0f172a' }}>Marketplace untuk urusan sembako</h1>
                  <p style={{ margin: 0, maxWidth: 560, color: '#475569', lineHeight: 1.8, fontSize: '1rem' }}>
                    Pilih produk kebutuhan pokok yang lengkap, bayar langsung dengan saldo, dan nikmati belanja tanpa antrian.
                  </p>
                </div>
                <div style={{ minWidth: 250, borderRadius: 28, padding: '1.75rem', background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)', color: '#fff' }}>
                  <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>Saldo marketplace</div>
                  <div style={{ margin: '1rem 0', fontSize: '2.25rem', fontWeight: 700 }}>Rp {Number(balanceData.available_balance).toLocaleString('id-ID')}</div>
                  <div style={{ display: 'grid', gap: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                      <span>Saldo total</span>
                      <strong>Rp {Number(balanceData.saldo).toLocaleString('id-ID')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                      <span>Saldo tertahan</span>
                      <strong>Rp {Number(balanceData.saldo_hold).toLocaleString('id-ID')}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={refreshBalance}
                    disabled={refreshing}
                    style={{
                      marginTop: '1.5rem',
                      width: '100%',
                      padding: '0.95rem 1rem',
                      borderRadius: 18,
                      border: 'none',
                      background: '#fff',
                      color: '#166534',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {refreshing ? 'Menyegarkan...' : 'Segarkan Saldo'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <section style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '0.7rem 1rem',
                    borderRadius: 999,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    background: selectedCategory === category ? '#16a34a' : '#fff',
                    color: selectedCategory === category ? '#fff' : '#0f172a',
                    cursor: 'pointer',
                    fontWeight: 700,
                    minWidth: 100,
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari produk, kategori, atau kebutuhan..."
                style={{
                  flex: 1,
                  minWidth: 240,
                  padding: '0.95rem 1rem',
                  borderRadius: 18,
                  border: '1px solid #d1d5db',
                  outline: 'none',
                  fontSize: '0.95rem',
                }}
              />
              <button
                type="button"
                onClick={loadMarketplace}
                disabled={loading}
                style={{
                  padding: '0.95rem 1.25rem',
                  borderRadius: 18,
                  border: 'none',
                  background: '#16a34a',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {loading ? 'Memuat...' : 'Segarkan'}
              </button>
            </div>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#0f172a' }}>Marketplace Produk</h2>
                <p style={{ margin: '0.45rem 0 0', color: '#475569' }}>Semua produk sembako sudah disiapkan untuk kebutuhan harian.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ padding: '0.85rem 1rem', borderRadius: 18, background: '#fff', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Produk</div>
                  <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{filteredProducts.length}</div>
                </div>
                <div style={{ padding: '0.85rem 1rem', borderRadius: 18, background: '#fff', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Filter</div>
                  <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{selectedCategory}</div>
                </div>
              </div>
            </div>

            {feedback && (
              <div style={{ marginBottom: '1rem', padding: '1rem 1.25rem', borderRadius: 20, background: feedback.type === 'success' ? '#dcfce7' : feedback.type === 'warning' ? '#fef3c7' : '#fee2e2', color: feedback.type === 'danger' ? '#b91c1c' : feedback.type === 'warning' ? '#92400e' : '#166534' }}>
                {feedback.message}
              </div>
            )}

            {loading ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b' }}>Memuat produk...</div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b' }}>Tidak ada produk yang cocok.</div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {filteredProducts.map((product) => {
                  const price = Number(product.harga || 0);
                  const canBuy = product.stok > 0 && balanceData.available_balance >= price;
                  return (
                    <div key={product.id} style={{ borderRadius: 28, overflow: 'hidden', background: '#fff', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ position: 'relative', minHeight: 240, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                        <img
                          src={getProductImage(product)}
                          alt={product.nama}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = getCategoryPlaceholder(product.kategori); }}
                          style={{ maxWidth: '100%', maxHeight: 220, objectFit: 'contain' }}
                        />
                        <div style={{ position: 'absolute', top: 16, left: 16, padding: '0.45rem 0.85rem', borderRadius: 999, background: 'rgba(22, 163, 74, 0.9)', color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>
                          {product.kategori || 'Sembako'}
                        </div>
                      </div>
                      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>{product.nama}</h3>
                          <p style={{ margin: '0.75rem 0 0', color: '#64748b', lineHeight: 1.7 }}>{product.deskripsi}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
                          <div>
                            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Harga</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827' }}>Rp {price.toLocaleString('id-ID')}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Stok</div>
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: product.stok > 0 ? '#16a34a' : '#dc2626' }}>{product.stok}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePurchase(product)}
                          disabled={!canBuy || processingProductId === product.id}
                          style={{
                            width: '100%',
                            padding: '0.95rem 1rem',
                            borderRadius: 18,
                            border: 'none',
                            background: canBuy ? '#16a34a' : '#e5e7eb',
                            color: canBuy ? '#fff' : '#64748b',
                            fontWeight: 700,
                            cursor: !canBuy || processingProductId === product.id ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {processingProductId === product.id ? 'Memproses...' : product.stok <= 0 ? 'Habis' : canBuy ? 'Beli Sekarang' : 'Saldo Tidak Cukup'}
                        </button>
                      </div>
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
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          zIndex: 9999,
        }}>
          <div style={{ width: '100%', maxWidth: 460, borderRadius: 28, background: '#fff', padding: '1.75rem', boxShadow: '0 24px 70px rgba(15, 23, 42, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Konfirmasi Pesanan</h3>
                <p style={{ margin: '0.5rem 0 0', color: '#64748b' }}>Pembayaran akan otomatis dipotong dari saldo Anda.</p>
              </div>
              <button
                type="button"
                onClick={cancelPurchase}
                style={{ border: 'none', background: 'transparent', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div style={{ borderRadius: 24, background: '#f8fafc', padding: '1.2rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#0f172a', fontWeight: 700 }}>Produk</span>
                  <span>{confirmModal.product.nama}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#0f172a', fontWeight: 700 }}>Jumlah</span>
                  <span>{confirmModal.quantity}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#0f172a', fontWeight: 700 }}>Metode</span>
                  <span>Saldo</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#0f172a', fontWeight: 700 }}>Saldo Tersedia</span>
                  <span>Rp {balanceData.available_balance.toLocaleString('id-ID')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 700, fontSize: '1rem' }}>
                  <span>Total Bayar</span>
                  <span>Rp {confirmModal.totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={cancelPurchase}
                style={{ flex: 1, minWidth: 140, padding: '0.95rem 1rem', borderRadius: 18, border: '1px solid #d1d5db', background: '#fff', color: '#0f172a', fontWeight: 700, cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmPurchase}
                disabled={processingProductId === confirmModal.product.id || balanceData.available_balance < confirmModal.totalPrice}
                style={{
                  flex: 1,
                  minWidth: 140,
                  padding: '0.95rem 1rem',
                  borderRadius: 18,
                  border: 'none',
                  background: balanceData.available_balance < confirmModal.totalPrice ? '#9ca3af' : '#16a34a',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: balanceData.available_balance < confirmModal.totalPrice || processingProductId === confirmModal.product.id ? 'not-allowed' : 'pointer',
                }}
              >
                {processingProductId === confirmModal.product.id ? 'Memproses...' : 'Bayar dengan Saldo'}
              </button>
            </div>
            {balanceData.available_balance < confirmModal.totalPrice && (
              <p style={{ marginTop: '1rem', color: '#b91c1c', fontSize: '0.95rem' }}>
                Saldo tidak cukup. Kurangi jumlah atau isi saldo terlebih dahulu.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Marketplace;
