import React, { useEffect, useState } from 'react';
import { marketplaceAPI } from '../../services/api';

function MarketplaceAdmin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // products or orders
  const [formValues, setFormValues] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    kategori: 'lokal',
    stok: '',
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  async function loadProducts() {
    try {
      const response = await marketplaceAPI.getProducts();
      setProducts(response.data || response);
    } catch (err) {
      console.error(err);
      setErrorMessage('Tidak dapat memuat daftar produk marketplace.');
    }
  }

  async function loadOrders() {
    try {
      const response = await marketplaceAPI.getAllOrders();
      setOrders(response.data || response);
    } catch (err) {
      console.error(err);
      setErrorMessage('Tidak dapat memuat riwayat pembelian.');
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(product) {
    setEditingProductId(product.id);
    setFormValues({
      nama: product.nama,
      deskripsi: product.deskripsi || '',
      harga: product.harga.toString(),
      kategori: product.kategori,
      stok: product.stok.toString(),
    });
    setStatusMessage(null);
    setErrorMessage(null);
  }

  function cancelEdit() {
    setEditingProductId(null);
    setFormValues({ nama: '', deskripsi: '', harga: '', kategori: 'lokal', stok: '' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const payload = {
        nama: formValues.nama,
        deskripsi: formValues.deskripsi,
        harga: Number(formValues.harga),
        kategori: formValues.kategori,
        stok: Number(formValues.stok),
      };

      if (editingProductId) {
        // Update existing product
        await marketplaceAPI.updateProduct(editingProductId, payload);
        setStatusMessage('Produk berhasil diperbarui.');
        setEditingProductId(null);
      } else {
        // Create new product
        await marketplaceAPI.createProduct(payload);
        setStatusMessage('Produk berhasil ditambahkan.');
      }

      setFormValues({ nama: '', deskripsi: '', harga: '', kategori: 'lokal', stok: '' });
      await loadProducts();
    } catch (err) {
      console.error(err);
      setErrorMessage('Gagal menyimpan produk. Pastikan semua data terisi dengan benar.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteProduct(productId) {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await marketplaceAPI.deleteProduct(productId);
        setStatusMessage('Produk berhasil dihapus.');
        await loadProducts();
      } catch (err) {
        console.error(err);
        setErrorMessage('Gagal menghapus produk.');
      }
    }
  }

  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="header">
              <h4 className="title">Marketplace Admin</h4>
              <p className="category">Kelola produk dan lihat riwayat pembelian.</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #eee' }}>
              <button
                onClick={() => setActiveTab('products')}
                style={{
                  padding: '0.5rem 1rem',
                  background: activeTab === 'products' ? '#27ae60' : '#f0f0f0',
                  color: activeTab === 'products' ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                📦 Kelola Produk
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  padding: '0.5rem 1rem',
                  background: activeTab === 'orders' ? '#27ae60' : '#f0f0f0',
                  color: activeTab === 'orders' ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                🛒 Riwayat Pembelian
              </button>
            </div>

            {statusMessage && <div className="alert alert-success" style={{ margin: '1rem' }}>{statusMessage}</div>}
            {errorMessage && <div className="alert alert-danger" style={{ margin: '1rem' }}>{errorMessage}</div>}

            {activeTab === 'products' && (
              <div className="content">
                <h5 style={{ marginTop: '1rem' }}>
                  {editingProductId ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}
                </h5>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Nama Produk</label>
                        <input
                          type="text"
                          className="form-control"
                          name="nama"
                          value={formValues.nama}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Kategori</label>
                        <select
                          className="form-control"
                          name="kategori"
                          value={formValues.kategori}
                          onChange={handleChange}
                        >
                          <option value="lokal">Lokal</option>
                          <option value="digital">Digital</option>
                          <option value="pulsa">Pulsa</option>
                          <option value="token_listrik">Token Listrik</option>
                          <option value="paket_data">Paket Data</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Harga (Rp)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="harga"
                          value={formValues.harga}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Stok</label>
                        <input
                          type="number"
                          className="form-control"
                          name="stok"
                          value={formValues.stok}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Deskripsi</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="deskripsi"
                      value={formValues.deskripsi}
                      onChange={handleChange}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Menyimpan...' : editingProductId ? 'Perbarui Produk' : 'Tambah Produk'}
                    </button>
                    {editingProductId && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={cancelEdit}
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </form>

                <hr style={{ margin: '2rem 0' }} />

                <h5>Daftar Produk Marketplace</h5>
                <div className="content table-responsive table-full-width">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>Kategori</th>
                        <th>Harga</th>
                        <th>Stok</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.nama}</td>
                          <td>
                            <span style={{ background: '#e9f5ff', color: '#0369a1', padding: '0.25rem 0.5rem', borderRadius: 4, fontSize: '0.85rem' }}>
                              {product.kategori}
                            </span>
                          </td>
                          <td>Rp {Number(product.harga).toLocaleString('id-ID')}</td>
                          <td>
                            <strong>{product.stok}</strong>
                          </td>
                          <td>{product.aktif ? '✓ Aktif' : '✗ Nonaktif'}</td>
                          <td>
                            <button
                              onClick={() => startEdit(product)}
                              style={{
                                padding: '0.4rem 0.8rem',
                                background: '#3498db',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                marginRight: '0.5rem',
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              style={{
                                padding: '0.4rem 0.8rem',
                                background: '#e74c3c',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                              }}
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="content">
                <h5>Riwayat Pembelian Pembeli</h5>
                <div className="content table-responsive table-full-width">
                  {orders.length === 0 ? (
                    <p style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>Belum ada pembelian.</p>
                  ) : (
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID Pembelian</th>
                          <th>Pembeli</th>
                          <th>Email</th>
                          <th>Produk</th>
                          <th>Jumlah</th>
                          <th>Total Harga</th>
                          <th>Status</th>
                          <th>Tanggal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{order.user_name || 'User'}</td>
                            <td>{order.user_email || '-'}</td>
                            <td>{order.product_name}</td>
                            <td>{order.jumlah}</td>
                            <td>Rp {Number(order.total_harga).toLocaleString('id-ID')}</td>
                            <td>
                              <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: 4,
                                fontSize: '0.85rem',
                                background: order.status === 'completed' ? '#d4edda' : order.status === 'cancelled' ? '#f8d7da' : '#fff3cd',
                                color: order.status === 'completed' ? '#155724' : order.status === 'cancelled' ? '#721c24' : '#856404',
                              }}>
                                {order.status === 'pending' && '⏳ Pending'}
                                {order.status === 'processing' && '⚙️ Processing'}
                                {order.status === 'completed' && '✓ Selesai'}
                                {order.status === 'cancelled' && '✗ Dibatalkan'}
                                {order.status === 'refunded' && '↩️ Refund'}
                              </span>
                            </td>
                            <td>{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketplaceAdmin;
