-- Marketplace schema for K-TRASH
-- Run these statements in the bank_sampah database.

-- 1. Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  harga DECIMAL(15,2) NOT NULL,
  kategori ENUM('lokal','digital','pulsa','token_listrik','paket_data') NOT NULL DEFAULT 'lokal',
  stok INT NOT NULL DEFAULT 0,
  gambar VARCHAR(500),
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. Create product_orders table
CREATE TABLE IF NOT EXISTS product_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  jumlah INT NOT NULL DEFAULT 1,
  total_harga DECIMAL(15,2) NOT NULL,
  status ENUM('pending','processing','completed','cancelled') NOT NULL DEFAULT 'pending',
  catatan TEXT,
  processed_by INT,
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. Create product_order_items table (for future extensibility)
CREATE TABLE IF NOT EXISTS product_order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  jumlah INT NOT NULL,
  harga_satuan DECIMAL(15,2) NOT NULL,
  subtotal DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES product_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. Seed initial products
INSERT INTO products (nama, deskripsi, harga, kategori, stok, aktif) VALUES
('Pulsa XL 10.000', 'Pulsa XL 10.000 untuk semua kartu', 10000, 'pulsa', 100, TRUE),
('Pulsa Telkomsel 25.000', 'Pulsa Telkomsel 25.000', 25000, 'pulsa', 100, TRUE),
('Token PLN 50.000', 'Token listrik 50.000 kWh', 52000, 'token_listrik', 50, TRUE),
('Paket Data Indosat 5GB', 'Paket data Indosat 5GB 30 hari', 25000, 'paket_data', 100, TRUE),
('Keripik Tempe Lokal', 'Keripik tempe buatan UMKM lokal', 15000, 'lokal', 20, TRUE),
('Madu Hutan', 'Madu hutan asli dari petani lokal', 75000, 'lokal', 10, TRUE);