# Samudata - Sistem Aplikasi Manajemen untuk Data

**Slogan:** "Lautnya Luas, Datanya Jelas – Samudata, Solusi Cerdas."

## Deskripsi

Samudata adalah sistem manajemen file untuk Dinas Kelautan dan Perikanan (DKP) Jawa Timur yang dirancang untuk menyimpan, mengelola, melakukan versi, mengarsipkan, dan mencari file internal secara aman & efisien tanpa menggunakan WhatsApp atau flashdisk.

## Fitur Utama

### 🏠 Landing Page
- 5 Kartu ringkasan jumlah file per bidang:
  - Perikanan Tangkap
  - Perikanan Budidaya  
  - KPP (Kelautan, Pesisir, & Pulau-Pulau Kecil)
  - Pengolahan & Pemasaran Hasil Perikanan
  - Ekspor Perikanan
- Peta interaktif Leaflet menampilkan wilayah kabupaten/kota Jawa Timur
- Popup per kabupaten menampilkan ringkasan jumlah file per bidang

### 📁 File Manager
- Upload file satu per satu dengan metadata lengkap
- Validasi format file yang aman (PDF, DOC, DOCX, XLS, XLSX, ZIP, JPG, JPEG, PNG)
- Pencarian dan filter berdasarkan judul, bidang, kabupaten/kota, tahun, bulan
- Sistem versi file otomatis (v1.0, v1.1, dst.)
- Arsip file lama dengan pencarian tetap aktif
- File favorit untuk akses cepat

### 📊 Dashboard
- Statistik real-time per bidang
- Grafik tren upload menggunakan Chart.js
- Aktivitas terbaru dan log audit
- Aksi cepat untuk upload dan manajemen

### 📅 Kalender Upload
- Tampilan kalender dengan FullCalendar
- Jadwal dan histori upload
- Penugasan upload dengan deadline
- Legenda warna per bidang

### 🔒 Keamanan
- Akses file hanya melalui controller yang terproteksi
- Validasi dan sanitasi filename
- Throttle login anti brute force
- Backup mingguan otomatis

## Teknologi

- **Frontend:** HTML5, CSS3 (Tailwind CSS), JavaScript
- **Maps:** Leaflet.js dengan GeoJSON Jawa Timur
- **Charts:** Chart.js untuk visualisasi data
- **Calendar:** FullCalendar untuk jadwal upload
- **Tables:** DataTables untuk pencarian dan filter
- **Icons:** Font Awesome

## Struktur File

```
samudata-project/
├── index.html              # Landing page
├── dashboard.html           # Dashboard admin/user
├── files.html              # File manager
├── calendar.html           # Kalender upload
├── js/
│   ├── app.js              # JavaScript utama
│   ├── dashboard.js        # Dashboard functionality
│   ├── files.js            # File manager functionality
│   └── calendar.js         # Calendar functionality
├── css/                    # Custom CSS (jika diperlukan)
├── images/
│   ├── samudata-logo.png   # Logo aplikasi
│   ├── hero-background.png # Background hero section
│   └── fisheries-illustration.png # Ilustrasi perikanan
├── icons/
│   ├── upload-icon.png     # Ikon upload
│   ├── search-icon.png     # Ikon pencarian
│   └── archive-icon.png    # Ikon arsip
├── data/
│   └── real_data_jatim.json # GeoJSON wilayah Jawa Timur
└── README.md               # Dokumentasi ini
```

## Instalasi & Deployment

### Persiapan
1. Extract file ZIP ke direktori web server
2. Pastikan web server mendukung HTML5 dan JavaScript
3. Tidak memerlukan instalasi khusus untuk frontend

### Akses
- Buka `index.html` di web browser
- Navigasi ke halaman lain melalui menu

### Konfigurasi
- Edit file `data/real_data_jatim.json` untuk data GeoJSON yang akurat
- Sesuaikan warna dan branding di file CSS jika diperlukan

## Panduan Penggunaan

### Landing Page
1. Lihat ringkasan file per bidang di kartu statistik
2. Klik pada peta untuk melihat data per kabupaten/kota
3. Gunakan navigasi untuk mengakses fitur lain

### File Manager
1. Klik "Upload File" untuk mengunggah dokumen baru
2. Isi metadata lengkap (judul, bidang, kabupaten, dll.)
3. Gunakan filter untuk mencari file tertentu
4. Akses file melalui tombol aksi (download, favorit, arsip)

### Dashboard
1. Monitor statistik real-time
2. Lihat aktivitas terbaru
3. Gunakan aksi cepat untuk tugas umum

### Kalender
1. Lihat jadwal upload dalam tampilan kalender
2. Klik tanggal untuk menambah jadwal baru
3. Klik event untuk melihat detail

## Prinsip No Dummy Data

Aplikasi ini mengikuti prinsip **tidak ada data dummy**:
- Semua statistik menampilkan angka 0 jika belum ada data real
- Pesan motivasi ditampilkan untuk mendorong upload pertama
- Visualisasi (kartu, grafik, peta) menggunakan data real dari database
- State kosong memberikan panduan yang jelas untuk pengguna

## Keamanan File

- File disimpan di direktori privat (tidak dapat diakses langsung)
- Akses file hanya melalui controller dengan validasi role
- Validasi format file yang ketat
- Sanitasi nama file untuk mencegah path traversal
- Checksum untuk deteksi duplikat

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Changelog

### Version 2.0.0 (Current - September 2025)
- ✅ **FIXED**: Removed unnecessary upload buttons from dashboard and bidang pages
- ✅ **FIXED**: Fixed quick action buttons functionality in dashboard
- ✅ **IMPROVED**: Made upload form wider and more accessible with better scrollability
- ✅ **NEW**: Added complete file management actions (download, favorite, archive, edit, delete)
- ✅ **NEW**: Created Histori & Log page with comprehensive activity tracking
- ✅ **NEW**: Created Permintaan File page for file request management
- ✅ **ENHANCED**: Enhanced Favorit page with working "Jelajahi File" button
- ✅ **NEW**: Created comprehensive Pengaturan Akun page with profile, security, and preferences
- ✅ **IMPROVED**: Enhanced database schema with file_requests table
- ✅ **IMPROVED**: Enhanced backend APIs for all file operations
- ✅ **IMPROVED**: Added proper error handling and user notifications
- ✅ **IMPROVED**: Better responsive design and mobile compatibility

### Version 1.0.0 (Initial Release)
- Basic file management system
- Landing page with statistics
- Dashboard functionality
- File upload and basic management

## Deployment Instructions

### Quick Start (Development)
1. Extract the ZIP file to your web server directory
2. Install PHP 8.1+ and MySQL
3. Import `database_schema.sql` to create the database
4. Configure database connection in `database_config.php`
5. Set proper permissions for `uploads/` directory
6. Access via web browser

### Production Deployment
1. Use HTTPS in production
2. Configure proper web server (Apache/Nginx)
3. Set up regular database backups
4. Monitor file storage usage
5. Implement proper security measures

### System Requirements
- PHP 8.1 or higher
- MySQL 5.7+ or MariaDB 10.3+
- Web server (Apache/Nginx)
- Minimum 512MB RAM
- Minimum 1GB disk space

### PHP Extensions Required
- php-mysql
- php-curl
- php-json
- php-mbstring
- php-fileinfo

## Support

For technical support or questions, contact the DKP Jawa Timur IT team.

---

**Samudata** - Lautnya Luas, Datanya Jelas – Samudata, Solusi Cerdas.

