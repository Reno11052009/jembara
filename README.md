<div align="center">
  
  # Jembara
  ### Jembatani Keterampilan, Wujudkan Peluang
  
  [![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-success?style=for-the-badge)](https://jembara.web.id)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Reno11052009/jembara)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
  
  **Submission for ITECHNO CUP 2026 - Web Development**
  
  **By Terserah**
  
</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Unggulan](#-fitur-unggulan)
- [Demo & Screenshot](#-demo--screenshot)
- [Akun Demo Pengujian](#-akun-demo)
- [Teknologi](#-teknologi)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Instalasi & Setup](#-instalasi--setup)
- [Penggunaan](#-penggunaan)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Tim Developer](#-tim-pengembang)
- [Lisensi](#-lisensi)

---

## 👥 Tim Developer

| Nama | Peran | GitHub |
|------|-------|--------|
| **Chello Arta Sukma Hadinata** | Project Lead & UI/UX Designer | [GitHub](https://github.com/SauraAsh) |
| **Dico Zakaria Putra Aydia Subagio** | Frontend Developer | [GitHub](https://github.com/Ozakae) |
| **Arsya Mayreno Arnaldo** | Backend Developer | [GitHub](https://github.com/Reno11052009) |

---

## 🎯 Tentang Proyek

### Latar Belakang

Pengangguran masih menjadi masalah besar di Indonesia,terutama di kalangan pelajar/mahasiswa dan orang-orang yang baru lulus sekolah. Hal ini disebabkan oleh beberapa faktor, antara lain: Kurangnya kesempatan kerja, Kurangnya skill yang dimiliki, Kurangnya pengalaman kerja, Kurangnya informasi mengenai lowongan kerja, Kurangnya akses untuk mendapatkan pekerjaan, Kurangnya akses untuk mendapatkan pelatihan

### Solusi yang Ditawarkan

Dengan website Jembara ini kita dapat mengurangi jumlah pengangguran di Indonesia dengan cara memudahkan mereka untuk mencari pekerjaan yang sesuai dengan apa yang mereka inginkan.

### Tujuan Proyek

- 🎯 **Tujuan Utama**: Membantu pelajar/mahasiswa/orang-orang untuk mendapatkan pekerjaan
- 📊 **Target Pengguna**: Mahasiswa, Pengangguran, Freelancer, Pekerja part-time
- 💡 **Value Proposition**: Website pencari pekerjaan dengan sistem matchmaking dan fokus pada usaha UMKM

---

## ✨ Fitur Unggulan

### Fitur Utama

| Fitur | Deskripsi | Keunggulan |
|----------|--------------|---------------|
| **Smart Matching** | Menghitung kecocokan skill Student dengan kebutuhan setiap project dan mengurutkan rekomendasi project maupun kandidat. | Membantu Student menemukan peluang yang relevan dan UMKM menyeleksi talent secara lebih terarah. |
| **Marketplace Project UMKM** | UMKM dapat mempublikasikan project lengkap dengan budget, deadline, skill wajib, mode kerja, dan lokasi; Student dapat mencari, memfilter, serta mengajukan proposal. | Mempertemukan kebutuhan digitalisasi UMKM dengan keterampilan praktis pelajar dalam satu platform. |
| **Kolaborasi End-to-End** | Mendukung pemilihan kandidat, pembayaran melalui Midtrans, pesan dan lampiran, pengiriman hasil, review pekerjaan, hingga penyelesaian project. | Seluruh perjalanan project tercatat dan dikelola dalam alur kerja yang jelas dari `OPEN` sampai `COMPLETED`. |
| **Portfolio & Skill Passport** | Menampilkan karya, skill, status verifikasi, project selesai, rating, dan testimoni Student berdasarkan data platform. | Membantu Student membangun rekam jejak serta reputasi profesional dari pengalaman project nyata. |

### Fitur Tambahan

- **Jelita AI Assistant** - Membantu Student dan UMKM memahami fitur platform serta memberikan rekomendasi project atau talent berdasarkan data Jembara.
- **Pesan & Lampiran Project** - Memfasilitasi komunikasi antara UMKM dan Student terpilih, termasuk pengiriman lampiran melalui penyimpanan privat.
- **Dashboard Berbasis Peran** - Menyediakan ringkasan dan menu yang disesuaikan untuk Student, UMKM, dan Admin berdasarkan data platform.

---

## 📸 Demo & Screenshot

### Live Demo

🔗 **[Kunjungi Website](https://jembara.web.id)**

### 🔑 Akun Demo

Untuk kemudahan pengujian dan evaluasi alur kerja end-to-end tanpa perlu mendaftar akun baru, silakan gunakan kredensial akun demo berikut:

| Peran | Nama Akun | Email | Kata Sandi | Cakupan Pengujian |
|:---|:---|:---|:---|:---|
| **Student (Pelajar/Talenta)** | Dikonfigurasi saat seed demo | `DEMO_STUDENT_EMAIL` | `DEMO_STUDENT_PASSWORD` | Marketplace, proposal, portofolio, Skill Passport, dan pengiriman hasil. |
| **UMKM (Pemilik Usaha)** | Dikonfigurasi saat seed demo | `DEMO_UMKM_EMAIL` | `DEMO_UMKM_PASSWORD` | Lowongan, Smart Matching, pembayaran, revisi, dan approval. |
| **Admin** | Dikonfigurasi melalui environment | `ADMIN_SEED_EMAIL` | `ADMIN_SEED_PASSWORD` | Moderasi laporan, verifikasi skill, audit, dan penarikan saldo. |

Kredensial asli tidak disimpan di repository. Gunakan environment lokal yang kuat dan berbeda dari produksi.

### Screenshot Aplikasi

<div align="center">
  <img src="./docs/landing_page.png" alt="Homepage" width="800"/>
  <p><em>Homepage - Tampilan utama aplikasi</em></p>
  
  <img src="[URL_SCREENSHOT_2]" alt="Dashboard" width="800"/>
  <p><em>Dashboard - Panel kontrol pengguna</em></p>
  
  <img src="[URL_SCREENSHOT_3]" alt="Feature" width="800"/>
  <p><em>[Nama Fitur] - [Deskripsi screenshot]</em></p>
</div>


## 🛠️ Teknologi

### Tech Stack

#### Frontend
```
Framework    : Next.js 16 (App Router)
UI Library   : Tailwind CSS v4, Lucide React, React Icons
State Mgmt   : React Hooks / Context API
Validation   : Custom Validation
```

#### Backend
```
Runtime      : Node.js
Framework    : Next.js Server Actions
Database     : PostgreSQL
ORM          : Prisma ORM v7
Auth         : Custom JWT session dengan jose (satu identity authority)
```

#### DevOps & Tools
```
Deployment   : Vercel
CI/CD        : Vercel
Testing      : Vitest dan Playwright
Monitoring   : Audit log database dan structured server log
```

### Alasan Pemilihan Teknologi

| Teknologi | Alasan Pemilihan |
|-----------|------------------|
| **Next.js** | Mendukung frontend dan backend dalam satu codebase,supaya tidak perlu melakukan development dalam server terpisah. |
| **Prisma** | Mempermudah pengelolaan database dan TypeScript, mengurangi risiko error saat mengelola data pengguna dan proyek. |
| **TypeScript** | Membantu menangkap bug lebih awal pada form dan komponen yang kompleks, mempermudah kolaborasi tim. |
| **TailwindCSS** | Mempercepat proses desain langsung tanpa berpindah file CSS terpisah, mempercepat proses desain dan pengembangan dalam project. |

### Dependencies Utama

```json
{
  "dependencies": {
    "next": "16.3.3",
    "react": "19.2.8",
    "@prisma/client": "^7.9.1",
    "@supabase/supabase-js": "^2.112.3",
    "lucide-react": "^1.31.0",
    "lenis": "^1.3.26",
    "pg": "^8.23.0",
    "pgsql": "^1.0.0",
    "midtrans-client": "^1.4.3",
    "tus-js-client": "^4.3.1",
    "bcryptjs": "^3.0.3",
    "jose": "^6.2.8",
    "zod": "^4.4.3"
  }
}
```

---

## 🏗️ Arsitektur Sistem

### System Architecture

```mermaid
graph TD
    %% --- TIER 1: CLIENT ---
    subgraph Client_Environment [Client Tier]
        CC[Client Components]:::client
    end

    %% --- TIER 2: SERVER (Node.js) ---
    subgraph Server_Environment [Server Tier Node.js]
        
        subgraph Security_and_Auth [Alur Autentikasi & Keamanan]
            Proxy[proxy.ts<br/>CSP Header Control]:::server
            Session[lib/session.ts]:::server
            Decrypt[decrypt()<br/>Evaluasi Signature JWT]:::server
            Verify[verifySession()<br/>Validasi Stateful]:::server
            AuthGuard[auth-guard.ts<br/>RBAC: STUDENT, UMKM, ADMIN]:::server
        end

        subgraph Business_Logic [Alur Mutasi & Pengambilan Data]
            Actions[Server Actions app/actions/*<br/>& API Routes app/api/*]:::server
            Zod[Zod Schema<br/>Validasi Payload]:::server
            Prisma[Prisma ORM v7<br/>@prisma/adapter-pg + pg.Pool]:::server
        end
    end

    %% --- TIER 3: DATABASE ---
    subgraph Database_Environment [Database Tier PostgreSQL]
        DB_Auth[(Tabel: auth_session<br/>Idle: 24h, Exp: 7d)]:::db
        DB_Rate[(Tabel: security_rate_limit)]:::db
        DB_Main[(Tabel Transaksi Utama)]:::db
    end

    %% --- TIER 4: EKSTERNAL ---
    subgraph External_Integrations [Layanan Eksternal]
        Supabase[Supabase Storage<br/>File Media & Lampiran]:::external
        Midtrans[Midtrans Payment Gateway<br/>Transaksi Escrow]:::external
    end

    %% ==============================
    %% ALUR KONEKSI (RELASI)
    %% ==============================

    CC -->|1. Request HTTP-Only Cookie<br/>__Host-jembara_session| Proxy
    Proxy -->|2. Kontrol Keamanan| Session
    Session -->|3. Ekstrak Token| Decrypt
    Decrypt -->|4. Matematis Valid| Verify
    Verify -->|5. Cocokkan sessionId & userId| DB_Auth
    Verify -->|6. Sesi Aktif| AuthGuard
    AuthGuard -.->|7. Otorisasi Berhasil| Actions

    CC -->|8. Kirim Proposal/Proyek/Bayar| Actions
    Actions -->|9. Cek Payload| Zod
    Zod -->|10. Data Valid| Prisma
    Prisma -->|11. Cek Rate Limit| DB_Rate
    Prisma -->|12. Eksekusi Atomic| DB_Main

    Actions -->|13. Integrasi Terisolasi| Supabase
    Actions -->|14. Integrasi Terisolasi| Midtrans

    Actions -.->|15. Return Type-Safe Data| CC
```

### Database Schema

![Jembara ERD](docs/jembara_erd.svg)

### Folder Structure

```text
jembara/
|-- .github/workflows/       # Quality gate CI
|-- e2e/                     # Journey test Playwright
|-- playwright.config.ts     # Konfigurasi E2E
├── prisma/
│   ├── migrations/          # Riwayat migrasi PostgreSQL
│   ├── schema.prisma        # Model dan relasi database
│   └── seed.ts              # Data awal dan akun demo
├── public/                  # Aset statis, ikon, dan gambar
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── actions/         # Server Actions dan aturan bisnis
│   │   ├── api/             # Route Handlers, webhook, dan cron
│   │   └── dashboard/       # Halaman dashboard berbasis peran
│   ├── components/          # Komponen UI dan komponen per fitur
│   ├── config/              # Konfigurasi aplikasi dan chatbot
│   ├── contexts/            # React Context dan preferences
│   ├── fonts/               # Font lokal
│   ├── generated/prisma/    # Prisma Client hasil generate
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Data access, auth, payment, dan utilitas domain
│   ├── types/               # Tipe TypeScript
│   ├── validators/          # Schema validasi input
│   └── proxy.ts             # Proteksi dan pengalihan route
├── test/
│   ├── app/                 # Test Server Actions dan Route Handlers
│   ├── components/          # Test komponen React
│   ├── lib/                 # Test logika domain
│   └── validators/          # Test schema validasi
├── docs/                    # Dokumentasi dan diagram ERD
├── next.config.ts           # Konfigurasi Next.js
├── prisma.config.ts         # Konfigurasi Prisma
├── vitest.config.mts        # Konfigurasi test
└── package.json             # Scripts dan dependencies
```

---

## ⚙️ Instalasi & Setup

### Prerequisites

Pastikan Anda telah menginstall:
- **Node.js** (v20.9.0 atau lebih tinggi)
- **npm** / **yarn** / **pnpm**
- **Supabase**
- **Git**

### Langkah Instalasi

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/Reno11052009/jembara
cd jembara
```

#### 2️⃣ Install Dependencies

```bash
# Menggunakan npm
npm install

# Atau menggunakan yarn
yarn install

# Atau menggunakan pnpm
pnpm install
```

#### 3️⃣ Setup Environment Variables

Buat file `.env` di root directory:

```env
# Database
DATABASE_URL=
DIRECT_URL=
DATABASE_SSL_CA_BASE64=

# Authentication
SESSION_SECRET=

# API Keys
CHATBOT_AI=
CHATBOT_AI_BACKUP=

MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_ENVIRONMENT="sandbox"

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET="message-attachments"

# Other configs
CRON_SECRET=

ADMIN_SEED_NAME="Admin Jembara"
ADMIN_SEED_EMAIL="admin@jembara.web.id"
ADMIN_SEED_PASSWORD=[PASSWORD]

# Optional demo accounts (seeded only when all four are present)
DEMO_STUDENT_EMAIL=
DEMO_STUDENT_PASSWORD=
DEMO_UMKM_EMAIL=
DEMO_UMKM_PASSWORD=
```

#### 4️⃣ Setup Database

```bash
# Jalankan migrasi database
npm db:migrate

# atau
npm db:push

# Seed taxonomy dan akun admin dari environment
npm db:seed
```

#### 5️⃣ Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

---

## 🚀 Penggunaan

### Menjalankan Aplikasi

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start

# Run tests
npm test --run

# Verifikasi tipe
npx tsc --noEmit

# Install browser lalu jalankan E2E
npx playwright install chromium
npm run test:e2e

# Linting
npm run lint
```

### User Guide

#### Memulai

1. Buka aplikasi melalui [jembara.web.id](https://jembara.web.id) atau `http://localhost:3000` jika dijalankan secara lokal.
2. Untuk kemudahan pengujian, Anda dapat langsung masuk menggunakan **Akun Demo** yang telah disediakan (Student: `test-student@jembara.web.id`, UMKM: `test-umkm@jembara.web.id` dengan kata sandi `12345678`), atau membuat akun baru melalui tombol **Daftar**.
3. Jika membuat akun baru, tentukan peran akun sebagai **Student** atau **UMKM**. Peran ini menjadi identitas utama akun selama menggunakan Jembara.
4. Lengkapi profil sesuai peran agar rekomendasi project dan informasi yang ditampilkan lebih relevan.
5. Jika sudah memiliki akun, pilih **Masuk** dan gunakan email serta kata sandi yang telah didaftarkan.

#### Sebagai Student

1. Buka menu **Profil** untuk melengkapi lokasi, ketersediaan, pendidikan, skill, dan informasi pendukung lainnya.
2. Tambahkan hasil karya melalui menu **Portofolio** agar UMKM dapat menilai pengalaman dan kemampuan yang relevan.
3. Gunakan menu **Cari Proyek** untuk menelusuri lowongan berdasarkan kata kunci, kategori, mode kerja, lokasi, atau rentang budget.
4. Buka detail project untuk membaca deskripsi, kebutuhan skill, deadline, dan budget yang ditawarkan.
5. Isi proposal minimal 50 karakter, setujui budget project, kemudian tekan **Kirim Proposal**.
6. Pantau status pengajuan melalui **Proposal Saya**, aktivitas kerja melalui **Proyek Aktif**, dan komunikasi project melalui **Pesan**.
7. Periksa notifikasi pada bagian kanan atas dashboard agar tidak melewatkan pembaruan penting.
8. Simpan rekening atau e-wallet pada **Pengaturan → Pembayaran**. Setelah saldo tersedia mencapai minimal Rp10.000, buka **Penarikan Saldo**, pilih rekening tujuan, lalu kirim permintaan untuk diproses Admin.

#### Sebagai UMKM

1. Lengkapi profil usaha, kategori, website, dan alamat agar informasi bisnis mudah dipahami oleh Student.
2. Buka menu **Lowongan**, kemudian tekan tombol **Pasang Lowongan**.
3. Isi judul, deskripsi, budget tetap, skill wajib, deadline, mode kerja, dan lokasi project. Setelah dipublikasikan, project langsung berstatus **OPEN** dan tampil di marketplace.
4. Gunakan halaman **Lowongan** untuk melihat seluruh project, jumlah proposal yang masuk, dan status masing-masing project.
5. Buka menu **Pelamar** atau tombol **Lihat Pelamar** pada lowongan untuk meninjau proposal dan profil Student yang mendaftar.
6. Gunakan **Cari Talent** untuk menemukan Student berdasarkan kebutuhan project, lalu pantau kolaborasi melalui **Proyek Aktif** dan **Pesan**.
7. Setelah menerima proposal, selesaikan pembayaran melalui Midtrans. Proyek baru dimulai setelah pembayaran terverifikasi.
8. Saat Student mengirim hasil, periksa hasil pada **Proyek Aktif**, lalu pilih **Setujui & Lepas Saldo** untuk menyelesaikan proyek.

#### Sebagai Admin

1. Untuk lingkungan lokal, jalankan seed database dan masuk menggunakan kredensial `ADMIN_SEED_EMAIL` serta `ADMIN_SEED_PASSWORD` yang dikonfigurasi pada file `.env`.
2. Gunakan dashboard admin untuk memantau ringkasan pengguna, UMKM, project, dan aktivitas platform.
3. Buka menu **Daftar User**, **Daftar UMKM**, **Relasi**, **Lowongan**, atau **Monitor Pesan** sesuai data yang ingin ditinjau.
4. Buka **Penarikan Saldo** untuk memeriksa tujuan transfer, memproses pembayaran manual, atau menolak permintaan. Penolakan otomatis mengembalikan saldo Student.

> **Catatan:** Setiap pengguna hanya dapat mengakses halaman dan tindakan yang sesuai dengan perannya. Jangan membagikan kata sandi atau kredensial admin kepada pihak lain.

---

## Integrasi Pembayaran Midtrans

Jembara memakai **Snap Popup** dengan alternatif halaman pembayaran Midtrans melalui redirect. Pembayaran masuk ke akun merchant platform dan dicatat sebagai dana `HELD` pada ledger internal. Dana tidak langsung menjadi saldo Student. Setelah Student mengirim hasil dan UMKM menyetujuinya, pelepasan dana dan penambahan `user.saldo` dilakukan dalam satu transaksi database yang idempoten.

Tambahkan konfigurasi berikut ke `.env`:

```env
MIDTRANS_SERVER_KEY="SB-Mid-server-..."
MIDTRANS_CLIENT_KEY="SB-Mid-client-..."
MIDTRANS_ENVIRONMENT="sandbox"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Konfigurasikan **Payment Notification URL** pada Midtrans MAP:

```text
https://domain-anda/api/payments/midtrans/notification
```

Webhook memverifikasi signature SHA-512, mencocokkan `order_id` dan nominal dari database, serta memproses notifikasi berulang secara aman. Untuk produksi, gunakan `MIDTRANS_ENVIRONMENT="production"`, URL aplikasi HTTPS, dan Server Key produksi. Saldo Jembara adalah saldo internal; transfer aktual ke rekening Student memerlukan workflow payout/disbursement terpisah.

Alur status:

```text
Proposal diterima (PROPOSAL)
  -> pembayaran Midtrans terverifikasi (HELD, IN_PROGRESS)
  -> Student kirim hasil (REVIEW)
  -> UMKM setujui atau minta revisi maksimal 2 kali (IN_PROGRESS)
  -> UMKM menyetujui (RELEASED, COMPLETED, saldo Student bertambah)
```

---

## 📚 Integrasi API Wilayah.id

[Wilayah.id](https://wilayah.id/) menyediakan data statis wilayah administrasi Indonesia. Jembara menggunakannya untuk pilihan alamat berjenjang pada proses onboarding dan pengaturan profil Student maupun UMKM.

Base URL layanan eksternal: `https://wilayah.id/api`

| Endpoint | Kegunaan |
| --- | --- |
| `GET /provinces.json` | Mengambil seluruh provinsi. |
| `GET /regencies/{provinceCode}.json` | Mengambil kabupaten/kota dalam suatu provinsi. |
| `GET /districts/{regencyCode}.json` | Mengambil kecamatan dalam suatu kabupaten/kota. |
| `GET /villages/{districtCode}.json` | Mengambil kelurahan/desa dalam suatu kecamatan. |

Setiap respons berisi array `data` dengan objek `code` dan `name`. Pemilihan wilayah harus dilakukan berurutan karena kode wilayah induk dibutuhkan untuk mengambil tingkat berikutnya.

Frontend Jembara mengakses layanan ini melalui endpoint internal yang memerlukan sesi login:

```http
GET /api/wilayah?level=provinces
GET /api/wilayah?level=regencies&parentCode=35
GET /api/wilayah?level=districts&parentCode=35.73
GET /api/wilayah?level=villages&parentCode=35.73.05
```

Proxy internal tersebut memvalidasi parameter dan format respons, membatasi waktu permintaan, serta menyimpan data wilayah dalam cache untuk mengurangi permintaan berulang ke layanan eksternal. Dokumentasi endpoint dan sumber data selengkapnya tersedia di [wilayah.id](https://wilayah.id/).

---

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Test Coverage

Quality gate ada di `.github/workflows/quality.yml`: Prisma generate, lint, typecheck, unit/integration test, build, dan Playwright jika secret database CI tersedia. Angka coverage tidak dibekukan di README agar tidak menyesatkan; gunakan `npm run test:coverage` untuk hasil terbaru.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE) - lihat file LICENSE untuk detail lebih lanjut.

---

<div align="center">

  **Made with ❤️ by Terserah for ITECHNO CUP 2026**

  
</div>

