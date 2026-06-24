-- ============================================================
-- JelajahCar Seed Data
-- Run after create_tables.sql
-- ============================================================

USE jelajahcar;

-- ------------------------------------------------------------
-- Test User
-- ------------------------------------------------------------
INSERT INTO users (name, email, phone, password_hash, is_active) VALUES
('Test User', 'test@jelajahcar.id', '081234567890',
 '$2y$12$x/j3mX3vjgS5GqGC1F1u2./Nnz4rnfWfcxG4Fv2SlUTMeY5/rHasG',
 TRUE)
ON DUPLICATE KEY UPDATE email = email;

-- ------------------------------------------------------------
-- Car Categories
-- ------------------------------------------------------------
INSERT INTO car_categories (slug, name, sort_order) VALUES
('city-car', 'City Car', 1),
('mpv',      'MPV',      2),
('suv',      'SUV',      3),
('sedan',    'Sedan',    4),
('premium',  'Premium',  5)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ------------------------------------------------------------
-- Cars (Fleet)
-- ------------------------------------------------------------
INSERT INTO cars (name, category_id, price_per_day, seats, fuel, transmission, image_url, is_featured, description) VALUES
('Toyota Avanza', 2, 350000, 7, 'Bensin', 'Manual / AT',
 '/img/unsplash/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
 FALSE, 'MPV andalan keluarga Indonesia. Irit bahan bakar, muat 7 orang, bagasi luas.'),

('Honda HR-V', 3, 550000, 5, 'Bensin', 'CVT',
 '/img/unsplash/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=800&q=80',
 TRUE, 'Compact SUV stylish dengan fitur keselamatan lengkap dan konsumsi BBM efisien.'),

('Mitsubishi Pajero Sport', 3, 850000, 7, 'Diesel', 'AT',
 '/img/unsplash/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
 FALSE, 'SUV premium bertenaga diesel, cocok untuk perjalanan jauh dan medan berat.'),

('Toyota Alphard', 5, 1500000, 7, 'Bensin', 'AT',
 '/img/unsplash/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
 FALSE, 'Premium MPV dengan kabin super luas, cocok untuk acara bisnis atau wedding.'),

('Honda Brio', 1, 280000, 5, 'Bensin', 'Manual / CVT',
 '/img/unsplash/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
 FALSE, 'City car lincah dan irit, sempurna untuk perjalanan dalam kota.'),

('Toyota Camry', 4, 950000, 5, 'Bensin', 'AT',
 '/img/unsplash/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
 FALSE, 'Sedan eksekutif dengan kenyamanan kelas atas dan fitur keselamatan terbaru.')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ------------------------------------------------------------
-- Testimonials
-- ------------------------------------------------------------
INSERT INTO testimonials (name, role, rating, text, is_featured, sort_order) VALUES
('Andi Pratama', 'Business Trip, Jakarta', 5,
 'Proses booking sangat cepat. Konfirmasi langsung masuk WhatsApp, tidak perlu telepon berulang. Mobil bersih dan AC dingin, sangat membantu untuk meeting klien.',
 TRUE, 1),

('Sari Dewi', 'Liburan Keluarga, Bali', 5,
 'Bawa keluarga 5 orang, dikasih MPV yang nyaman. Anak-anak senang, supir ramah dan tahu jalan. Pasti repeat order.',
 FALSE, 2),

('Budi Hartono', 'Airport Transfer, Surabaya', 5,
 'Pes landing jam 2 pagi, supir sudah standby. Harga sudah termasuk tol dan parkir, tidak ada biaya tambahan. Transparan banget.',
 FALSE, 3),

('Maya Anggraini', 'Wedding Trip, Yogyakarta', 5,
 'Untuk wedding trip kami, mobilnya dihias cantik tanpa biaya tambahan. Detail kecil yang bikin terkesan.',
 TRUE, 4);

-- ------------------------------------------------------------
-- FAQ
-- ------------------------------------------------------------
INSERT INTO faq (question, answer, sort_order) VALUES
('Bagaimana cara booking mobil di JelajahCar?',
 'Isi form booking di halaman ini dengan data lengkap, lalu klik "Cari & Booking". Tim kami akan menghubungi Anda via WhatsApp dalam 1x24 jam untuk konfirmasi detail dan pembayaran.',
 1),

('Apakah harga sudah termasuk asuransi?',
 'Ya, semua harga yang tertera sudah termasuk asuransi dasar (all-risk), pajak, dan biaya admin. Tidak ada biaya tersembunyi. Asuransi tambahan tersedia sebagai opsi.',
 2),

('Bisakah antar-jemput mobil ke lokasi saya?',
 'Bisa. Layanan antar-jemput tersedia gratis untuk area dalam kota (radius 15 km). Untuk luar area, dikenakan biaya tambahan yang akan diinformasikan saat konfirmasi.',
 3),

('Apa yang terjadi jika mobil mogok di jalan?',
 'Hubungi tim support 24/7 kami. Kami akan mengirim mekanik atau mobil pengganti dalam waktu 1-2 jam tergantung lokasi. Semua biaya ditanggung JelajahCar.',
 4),

('Berapa lama proses konfirmasi booking?',
 'Konfirmasi awal otomatis via WhatsApp dalam 5 menit setelah booking. Konfirmasi final (termasuk detail mobil dan supir) maksimal 1x24 jam sebelum hari pemakaian.',
 5),

('Apakah bisa booking tanpa supir (lepas kunci)?',
 'Bisa, dengan syarat menyerahkan fotokopi KTP dan SIM A yang masih berlaku. Deposit keamanan Rp 1.000.000 akan dikembalikan saat mobil dikembalikan dalam kondisi baik.',
 6);
