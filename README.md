# 🚗 JelajahCar — Platform Rental Mobil Indonesia

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)
![PHP](https://img.shields.io/badge/PHP-8-777BB4?logo=php&logoColor=white&style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white&style=for-the-badge)

**Platform rental mobil modern untuk traveler Indonesia.**
Dirancang dengan antarmuka yang responsif, animasi halus, dan proses booking yang cepat.

[Demo](#demo) · [Instalasi](#-instalasi--setup) · [Fitur](#-fitur-utama) · [Dokumentasi API](#-api-endpoints)

</div>

---

## 📋 Deskripsi

**JelajahCar** adalah platform web rental mobil yang menghubungkan traveler dengan armada kendaraan berkualitas di seluruh Indonesia. Dibangun dengan arsitektur **React SPA + PHP REST API**, platform ini menawarkan pengalaman booking yang mulus — mulai dari menjelajahi armada, melihat detail spesifikasi, hingga melakukan reservasi secara online.

### 🎯 Tujuan Produk
- Mengonversi pengunjung menjadi booking melalui UI yang transparan dan mudah digunakan
- Meminimalisir friksi dari tahap tertarik hingga konfirmasi booking
- Memberikan pengalaman premium yang terpercaya tanpa terasa berlebihan

---

## ✨ Fitur Utama

### 🖥️ Frontend
| Fitur | Deskripsi |
|-------|-----------|
| **Halaman Beranda** | Hero section, armada unggulan, cara kerja, statistik, testimoni, FAQ, dan CTA |
| **Halaman Armada** | Katalog lengkap dengan filter kategori (City Car, MPV, SUV, Sedan, Premium) |
| **Halaman Keunggulan** | Penjelasan mengapa memilih JelajahCar |
| **Halaman Kontak** | Formulir kontak dan informasi perusahaan |
| **Popup Detail Mobil** | Modal animasi slide-up dengan spesifikasi lengkap (kursi, transmisi, BBM, harga) |
| **Booking Modal** | Formulir booking lengkap dengan validasi dan integrasi WhatsApp |
| **Autentikasi** | Registrasi, login, dan manajemen sesi pengguna (JWT-based) |
| **Riwayat Booking** | Daftar booking yang pernah dilakukan pengguna (khusus user terdaftar) |
| **Animasi** | Framer Motion untuk transisi halaman, scroll reveal, dan interaksi modal |
| **Responsif** | Layout adaptif untuk desktop, tablet, dan mobile |

### ⚙️ Backend
| Fitur | Deskripsi |
|-------|-----------|
| **REST API** | Endpoint PHP native untuk semua operasi CRUD |
| **Autentikasi JWT** | Access token (15 menit) + refresh token (7 hari) |
| **Rate Limiting** | Maksimum 5 percobaan login per 15 menit |
| **Caching** | File-based cache untuk response API yang sering diakses |
| **Database** | MySQL dengan foreign key, index komposit, dan pencegahan N+1 |

---

## 🏗️ Tech Stack

### Frontend
- **React 19** — Library UI berbasis komponen
- **Vite 8** — Build tool yang super cepat dengan HMR
- **Tailwind CSS 4** — Utility-first CSS framework
- **Framer Motion** — Library animasi deklaratif untuk React
- **React Router DOM 7** — Client-side routing (SPA)
- **Axios** — HTTP client untuk komunikasi API
- **Phosphor Icons** — Ikon modern dan konsisten
- **Lucide React** — Ikon tambahan

### Backend
- **PHP 8** — Backend API (native, tanpa framework)
- **MySQL 8** — Database relasional
- **PDO** — Database abstraction layer
- **JWT** — Token-based authentication (custom implementation)

### Tools
- **XAMPP** — Local development server (Apache + MySQL + PHP)
- **Git** — Version control

---

## 📁 Struktur Project

```
rentcar/
├── api/                        # Backend PHP API
│   ├── cache/                  # File cache storage
│   ├── auth.php                # Endpoint autentikasi (register, login, refresh, logout)
│   ├── booking.php             # Endpoint pembuatan booking baru
│   ├── bookings.php            # Endpoint daftar booking pengguna
│   ├── cars.php                # Endpoint data armada mobil
│   ├── testimonials.php        # Endpoint testimoni pelanggan
│   ├── faq.php                 # Endpoint FAQ
│   ├── cache.php               # Helper sistem caching
│   ├── config.php              # Konfigurasi JWT (secret key, TTL)
│   ├── db.php                  # Koneksi database & helper CRUD
│   ├── index.php               # Router utama API
│   ├── create_tables.sql       # DDL skema database
│   └── seed.sql                # Data awal (mobil, testimoni, FAQ, user test)
│
├── src/                        # Frontend React
│   ├── components/             # Komponen UI
│   │   ├── Navbar.jsx          # Navigasi utama (sticky, responsive)
│   │   ├── Hero.jsx            # Hero section beranda
│   │   ├── FleetShowcase.jsx   # Grid armada unggulan (4 kolom + stagger animation)
│   │   ├── CarDetailModal.jsx  # Popup detail mobil (framer-motion)
│   │   ├── BookingModal.jsx    # Modal formulir booking
│   │   ├── BookingForm.jsx     # Komponen form booking
│   │   ├── BookingHistory.jsx  # Riwayat booking pengguna
│   │   ├── AuthModal.jsx       # Modal login & registrasi
│   │   ├── HowItWorks.jsx      # Section "Cara Kerja"
│   │   ├── WhyUs.jsx           # Section keunggulan
│   │   ├── StatsCounter.jsx    # Counter animasi statistik
│   │   ├── Testimonials.jsx    # Slider testimoni
│   │   ├── FAQ.jsx             # Accordion FAQ
│   │   ├── PromoDeals.jsx      # Section promo & penawaran
│   │   ├── CTABanner.jsx       # Call-to-action banner
│   │   ├── CoverageMap.jsx     # Peta area layanan
│   │   ├── TrustStrip.jsx      # Strip kepercayaan (badge/ikon)
│   │   ├── Footer.jsx          # Footer website
│   │   ├── Layout.jsx          # Layout wrapper (Navbar + Outlet + Footer)
│   │   ├── BackToTop.jsx       # Tombol scroll ke atas
│   │   ├── ScrollToTop.jsx     # Auto-scroll saat pindah route
│   │   └── WhatsAppButton.jsx  # Floating WhatsApp button
│   │
│   ├── context/
│   │   └── AuthContext.jsx     # Context provider autentikasi global
│   │
│   ├── hooks/
│   │   ├── useCountUp.js       # Hook animasi counter angka
│   │   └── useScrollReveal.js  # Hook scroll-triggered reveal animation
│   │
│   ├── pages/
│   │   ├── HomePage.jsx        # Halaman beranda (komposisi komponen)
│   │   ├── FleetPage.jsx       # Halaman katalog armada lengkap
│   │   ├── WhyUsPage.jsx       # Halaman keunggulan
│   │   └── ContactPage.jsx     # Halaman kontak
│   │
│   ├── App.jsx                 # Root component + routing
│   ├── main.jsx                # Entry point React
│   └── index.css               # Stylesheet global (Tailwind imports + custom)
│
├── index.html                  # HTML entry point
├── vite.config.js              # Konfigurasi Vite (proxy, plugins)
├── package.json                # Dependency & scripts
└── PRODUCT.md                  # Dokumentasi brand & design principles
```

---

## 🚀 Instalasi & Setup

### Prasyarat

Pastikan software berikut sudah terinstal di komputer Anda:

| Software | Versi Minimum | Kegunaan |
|----------|---------------|----------|
| [Node.js](https://nodejs.org/) | v18+ | Runtime JavaScript |
| [XAMPP](https://www.apachefriends.org/) | v8.0+ | Apache + MySQL + PHP |
| [Git](https://git-scm.com/) | v2.x | Version control |

### Langkah 1 — Clone Repository

```bash
git clone https://github.com/dimsdevv/rent-car.git
cd rent-car
```

### Langkah 2 — Setup Database

1. **Buka XAMPP Control Panel** → Jalankan **Apache** dan **MySQL**
2. Buka **phpMyAdmin** di browser: `http://localhost/phpmyadmin`
3. Jalankan file SQL secara berurutan:

```sql
-- 1. Buat tabel
SOURCE /path/to/rent-car/api/create_tables.sql;

-- 2. Isi data awal
SOURCE /path/to/rent-car/api/seed.sql;
```

Atau bisa juga melalui tab **Import** di phpMyAdmin:
- Import `api/create_tables.sql` terlebih dahulu
- Lalu import `api/seed.sql`

### Langkah 3 — Jalankan Backend API

Buka terminal baru dan jalankan PHP built-in server:

```bash
cd api
php -S localhost:8000
```

> ⚠️ **Penting**: Pastikan MySQL XAMPP sudah aktif sebelum menjalankan backend. Tanpa MySQL, semua request API akan gagal.

### Langkah 4 — Jalankan Frontend

Buka terminal baru (biarkan backend tetap berjalan):

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Frontend akan berjalan di: **http://localhost:5173**

### Langkah 5 — Selesai! 🎉

Buka browser dan akses `http://localhost:5173` untuk melihat website JelajahCar.

---

## 🗄️ Skema Database

Database **`jelajahcar`** terdiri dari 6 tabel:

```
┌──────────────┐     ┌──────────────────┐
│    users     │     │  car_categories  │
│──────────────│     │──────────────────│
│ id (PK)      │     │ id (PK)          │
│ name         │     │ slug (UNIQUE)    │
│ email (UQ)   │     │ name             │
│ phone        │     │ sort_order       │
│ password_hash│     └────────┬─────────┘
│ is_active    │              │
│ created_at   │              │ 1:N
│ updated_at   │              │
└──────┬───────┘     ┌────────▼─────────┐
       │             │      cars        │
       │             │──────────────────│
       │             │ id (PK)          │
       │             │ name             │
       │  1:N        │ category_id (FK) │
       │             │ price_per_day    │
       │             │ seats            │
       │             │ fuel             │
       │             │ transmission     │
       │             │ image_url        │
       │             │ is_featured      │
       │             │ is_active        │
       │             │ description      │
       │             └────────┬─────────┘
       │                      │
       │         N:1          │ N:1
       │                      │
┌──────▼──────────────────────▼──┐
│           bookings             │
│────────────────────────────────│
│ id (PK)                       │
│ user_id (FK → users)          │
│ car_id  (FK → cars)           │
│ booking_code (UNIQUE)         │
│ name, email, phone            │
│ pickup_location               │
│ pickup_date, return_date      │
│ car_type, status, notes       │
│ total_price                   │
└────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ testimonials │     │     faq      │     │ cache_store  │
│──────────────│     │──────────────│     │──────────────│
│ id (PK)      │     │ id (PK)      │     │ cache_key(PK)│
│ name, role   │     │ question     │     │ expires_at   │
│ rating (1-5) │     │ answer       │     │ created_at   │
│ text         │     │ is_active    │     └──────────────┘
│ is_featured  │     │ sort_order   │
│ is_active    │     └──────────────┘
│ sort_order   │
└──────────────┘
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:8000`

### Autentikasi

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/api/auth` | Registrasi user baru | ❌ |
| `POST` | `/api/auth?action=login` | Login (mendapatkan JWT) | ❌ |
| `POST` | `/api/auth?action=refresh` | Refresh access token | 🔑 Refresh Token |
| `POST` | `/api/auth?action=logout` | Logout (invalidate token) | 🔑 Access Token |
| `GET`  | `/api/auth?action=me` | Mendapatkan data user saat ini | 🔑 Access Token |

### Armada Mobil

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET`  | `/api/cars` | Daftar semua mobil aktif | ❌ |
| `GET`  | `/api/cars?featured=true` | Daftar mobil unggulan | ❌ |
| `GET`  | `/api/cars?category=suv` | Filter berdasarkan kategori | ❌ |

### Booking

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/api/booking` | Buat booking baru | ❌ (guest) / 🔑 (user) |
| `GET`  | `/api/bookings` | Riwayat booking user | 🔑 Access Token |

### Konten

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET`  | `/api/testimonials` | Daftar testimoni | ❌ |
| `GET`  | `/api/faq` | Daftar FAQ | ❌ |

---

## 🔐 Autentikasi

Sistem autentikasi menggunakan **JWT (JSON Web Token)** dengan mekanisme dual-token:

```
┌─────────┐   POST /auth (login)   ┌──────────┐
│  Client  │ ───────────────────→  │  Server  │
│          │ ←─────────────────── │          │
│          │   access_token (15m)  │          │
│          │   refresh_token (7d)  │          │
└─────────┘                        └──────────┘

Access Token expired?
┌─────────┐  POST /auth?refresh    ┌──────────┐
│  Client  │ ───────────────────→  │  Server  │
│          │ ←─────────────────── │          │
│          │   new access_token    │          │
└─────────┘                        └──────────┘
```

- **Access Token**: Berlaku 15 menit, dikirim via header `Authorization: Bearer <token>`
- **Refresh Token**: Berlaku 7 hari, digunakan untuk mendapatkan access token baru
- **Rate Limiting**: Maksimum 5 kali percobaan login per 15 menit per IP

---

## 📱 Halaman & Routing

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/` | Beranda | Landing page utama dengan semua section |
| `/armada` | Armada | Katalog lengkap mobil dengan filter kategori |
| `/keunggulan` | Keunggulan | Alasan memilih JelajahCar |
| `/kontak` | Kontak | Formulir kontak dan informasi perusahaan |

---

## 🛠️ Scripts

```bash
# Development server (hot reload)
npm run dev

# Build untuk production
npm run build

# Preview build production
npm run preview
```

---

## 🧪 Akun Test

Setelah menjalankan `seed.sql`, Anda bisa login dengan akun berikut:

| Email | Password |
|-------|----------|
| `test@jelajahcar.id` | `password123` |

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan ikuti langkah berikut:

1. **Fork** repository ini
2. **Buat branch** fitur baru (`git checkout -b fitur/nama-fitur`)
3. **Commit** perubahan (`git commit -m 'feat: tambah fitur baru'`)
4. **Push** ke branch (`git push origin fitur/nama-fitur`)
5. Buat **Pull Request**

---

## 📄 Lisensi

Project ini dibuat untuk keperluan pembelajaran dan pengembangan.

---

<div align="center">

Dibuat dengan ❤️ oleh [dimsdevv](https://github.com/dimsdevv)

</div>
