# Panduan Deployment Aplikasi Samudata DKP Jawa Timur

## Fitur yang Telah Diperbaiki

### ✅ Perbaikan Utama
1. **Wilayah Diseragamkan**: Semua dropdown wilayah menggunakan daftar lengkap kabupaten/kota Jawa Timur
2. **Simbol Bidang**: KPP dan Pengolahan & Pemasaran kini memiliki simbol di peta dan kalender
3. **Tombol Back**: Tersedia di semua halaman dengan fungsi history.back()
4. **Scroll Bar**: Sidebar navigation memiliki scroll bar untuk menu yang panjang
5. **Form Upload**: Field tag dan email telah dihapus
6. **Tampilan Seragam**: Semua halaman bidang memiliki 4 kartu statistik yang sama
7. **Login System**: Sistem login untuk admin dan user publik
8. **Peta DKP**: Penanda lokasi kantor DKP di seluruh Jawa Timur

### 🔐 Sistem Login
- **User Publik**: Akses langsung tanpa password untuk melihat data
- **Administrator**: Memerlukan kode akses "dkpjatim2024" untuk akses penuh

### 🗺️ Fitur Peta
- Penanda kantor pusat DKP di Surabaya
- Cabang dinas di Malang dan Blitar
- Unit Pelaksana Teknis (UPT) di berbagai lokasi
- Popup informasi dengan alamat dan kontak

## Cara Deploy

### 1. Persiapan Server
```bash
# Upload file ke web server
# Pastikan server mendukung PHP 7.4+ dan MySQL 5.7+
```

### 2. Konfigurasi Database
```bash
# Import database schema
mysql -u username -p database_name < database_schema.sql

# Konfigurasi koneksi database di database_config.php
```

### 3. Pengaturan File
```bash
# Set permission untuk folder uploads
chmod 755 uploads/
chmod 644 uploads/.htaccess

# Copy .env.example ke .env dan sesuaikan konfigurasi
cp .env.example .env
```

### 4. Akses Aplikasi
- Buka browser dan akses domain/URL aplikasi
- Pilih jenis akses (User Publik atau Administrator)
- Untuk admin, gunakan kode akses: **dkpjatim2024**

## Struktur Aplikasi

### Frontend
- HTML5 dengan Tailwind CSS
- JavaScript vanilla untuk interaktivitas
- Leaflet.js untuk peta interaktif
- Chart.js untuk visualisasi data

### Backend
- PHP untuk API endpoints
- MySQL untuk database
- File upload system dengan validasi

### Fitur Utama
1. **Dashboard**: Statistik dan overview data
2. **Upload File**: Form upload dengan validasi
3. **Peta Wilayah**: Peta interaktif Jawa Timur dengan penanda DKP
4. **Kalender**: Timeline upload dan aktivitas
5. **File Manager**: Pengelolaan file per bidang
6. **Arsip**: Sistem arsip dan pencarian

## Keamanan
- Validasi file upload
- Sanitasi input form
- Session management
- Access control berdasarkan user type

## Support
Untuk bantuan teknis atau pertanyaan, hubungi tim DKP Jawa Timur.

---
**Aplikasi Samudata DKP Jawa Timur**  
*Sistem Manajemen Data Kelautan dan Perikanan*

