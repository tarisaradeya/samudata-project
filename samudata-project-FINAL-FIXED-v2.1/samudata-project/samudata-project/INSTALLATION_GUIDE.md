# Panduan Instalasi Samudata

## Sistem Aplikasi Manajemen untuk Data DKP Jawa Timur

### Persyaratan Sistem
- **Laragon** (sudah terinstall dan berjalan)
- **PHP** 7.4 atau lebih baru
- **MySQL** 5.7 atau lebih baru
- **Apache** web server
- Browser modern (Chrome, Firefox, Safari, Edge)

---

## Langkah Instalasi

### 1. Persiapan Laragon
1. **Download dan Install Laragon** (jika belum ada)
   - Download dari: https://laragon.org/download/
   - Install dengan pengaturan default

2. **Jalankan Laragon**
   - Buka aplikasi Laragon
   - Klik tombol **"Start All"**
   - Pastikan Apache dan MySQL berstatus "Running"

### 2. Deploy Aplikasi
1. **Extract File Aplikasi**
   - Extract file `samudata.zip` yang Anda terima
   - Copy folder `samudata-project` ke dalam folder `www` di Laragon
   - Lokasi biasanya: `C:\laragon\www\samudata-project\`

2. **Set Permissions** (jika diperlukan)
   - Pastikan folder `uploads/` dapat ditulis (writable)
   - Jika ada masalah permission, jalankan Laragon sebagai Administrator

### 3. Setup Database
1. **Akses Setup Script**
   - Buka browser
   - Kunjungi: `http://localhost/samudata-project/setup_database.php`
   
2. **Jalankan Setup**
   - Script akan otomatis:
     - Membuat database `samudata_db`
     - Membuat semua tabel yang diperlukan
     - Mengisi data default (38 kabupaten/kota Jawa Timur)
     - Mengisi kategori file (Tangkap, Budidaya, KPP, Pengolahan, Ekspor)
   
3. **Verifikasi Setup**
   - Jika berhasil, akan muncul pesan "✅ Database setup completed successfully!"
   - Jika gagal, periksa status MySQL di Laragon

### 4. Akses Aplikasi
Setelah setup berhasil, akses aplikasi melalui:

- **Homepage**: `http://localhost/samudata-project/index.html`
- **File Manager**: `http://localhost/samudata-project/files.html`
- **Dashboard**: `http://localhost/samudata-project/dashboard.html`
- **Peta Wilayah**: `http://localhost/samudata-project/map.html`

---

## Fitur Utama

### 🗂️ **Upload File**
- Mendukung format: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, JPEG, PNG, ZIP, RAR
- Maksimal ukuran: 50MB per file
- Validasi duplikat otomatis
- Metadata lengkap (kategori, wilayah, pengunggah, dll)

### 🔍 **Pencarian & Filter**
- Pencarian berdasarkan judul dan deskripsi
- Filter berdasarkan kategori (Tangkap, Budidaya, KPP, Pengolahan, Ekspor)
- Filter berdasarkan wilayah (38 kabupaten/kota Jawa Timur)
- Filter berdasarkan status file

### 📊 **Dashboard & Statistik**
- Statistik file per kategori
- Statistik file per wilayah
- Grafik interaktif
- Peta wilayah dengan data file

### 🗺️ **Peta Interaktif**
- Peta Jawa Timur dengan data file per wilayah
- Klik wilayah untuk melihat detail file
- Visualisasi data geografis

---

## Struktur Database

### Tabel Utama:
- **`regions`**: Data 38 kabupaten/kota Jawa Timur
- **`categories`**: 5 kategori file DKP
- **`files`**: Data file yang diupload
- **`file_access_logs`**: Log akses dan download
- **`settings`**: Pengaturan sistem

### API Endpoints:
- **`api/upload.php`**: Upload file baru
- **`api/files.php`**: List, filter, dan statistik file
- **`api/download.php`**: Download file

---

## Troubleshooting

### ❌ **Error "Database connection failed"**
**Solusi:**
1. Pastikan Laragon berjalan
2. Pastikan MySQL service aktif (hijau di Laragon)
3. Restart Laragon jika perlu
4. Coba akses `http://localhost/phpmyadmin` untuk test MySQL

### ❌ **Error "Permission denied" saat upload**
**Solusi:**
1. Pastikan folder `uploads/` ada
2. Set permission folder `uploads/` menjadi writable
3. Jalankan Laragon sebagai Administrator
4. Restart Apache di Laragon

### ❌ **File upload gagal**
**Solusi:**
1. Cek ukuran file (maksimal 50MB)
2. Cek format file yang didukung
3. Pastikan form diisi lengkap
4. Cek console browser (F12) untuk error JavaScript

### ❌ **Halaman tidak dapat diakses**
**Solusi:**
1. Pastikan Apache berjalan di Laragon
2. Cek URL: harus `http://localhost/samudata-project/`
3. Pastikan file ada di folder `www/samudata-project/`
4. Restart Apache di Laragon

---

## Konfigurasi Lanjutan

### Mengubah Batas Upload File
Edit file `database_config.php`, cari baris:
```php
'max_file_size', '52428800' // 50MB dalam bytes
```

### Menambah Format File
Edit file `database_config.php`, cari baris:
```php
'allowed_extensions', '["pdf","doc","docx",...]'
```

### Backup Database
Gunakan phpMyAdmin atau command line:
```bash
mysqldump -u root -p samudata_db > backup.sql
```

---

## Keamanan

### ✅ **Fitur Keamanan yang Sudah Diterapkan:**
- Validasi tipe file upload
- Deteksi duplikat file
- SQL injection protection (prepared statements)
- XSS protection
- File access logging
- Folder uploads dilindungi dari eksekusi PHP

### 🔒 **Rekomendasi Tambahan:**
- Gunakan HTTPS di production
- Set password MySQL yang kuat
- Backup database secara berkala
- Monitor log akses file

---

## Support & Bantuan

### 📋 **Checklist Instalasi:**
- [ ] Laragon terinstall dan berjalan
- [ ] Apache dan MySQL status "Running"
- [ ] File aplikasi di folder `www/samudata-project/`
- [ ] Database setup berhasil
- [ ] Dapat akses homepage aplikasi
- [ ] Dapat upload file test

### 🆘 **Jika Masih Bermasalah:**
1. Cek log error di Laragon
2. Cek console browser (F12) untuk error JavaScript
3. Pastikan semua file API dapat diakses
4. Test koneksi database manual

---

## Informasi Teknis

- **Framework**: PHP Native + MySQL
- **Frontend**: HTML5, CSS3, JavaScript, Tailwind CSS
- **Map**: Leaflet.js
- **Charts**: Chart.js
- **Database**: MySQL dengan PDO
- **Security**: Prepared statements, input validation, file type validation

**Versi**: 1.0  
**Tanggal**: 2024  
**Kompatibilitas**: Laragon 6.0+, PHP 7.4+, MySQL 5.7+

