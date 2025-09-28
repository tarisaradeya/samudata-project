# Samudata Database Setup Guide

## Prerequisites
1. **Laragon** harus sudah terinstall dan berjalan
2. **MySQL** service di Laragon harus aktif
3. **PHP** harus sudah terinstall (biasanya sudah include di Laragon)

## Langkah-langkah Setup

### 1. Persiapan Laragon
1. Buka Laragon
2. Klik **Start All** untuk menjalankan Apache dan MySQL
3. Pastikan status MySQL menunjukkan "Running"

### 2. Setup Database
1. Copy seluruh folder `samudata-project` ke dalam folder `www` di Laragon (biasanya di `C:\laragon\www\`)
2. Buka browser dan akses: `http://localhost/samudata-project/setup_database.php`
3. Script akan otomatis:
   - Membuat database `samudata_db`
   - Membuat semua tabel yang diperlukan
   - Mengisi data default (kategori dan wilayah)
   - Menampilkan statistik database

### 3. Verifikasi Setup
Setelah setup berhasil, Anda dapat:
- Mengakses homepage: `http://localhost/samudata-project/index.html`
- Mengakses file manager: `http://localhost/samudata-project/files.html`
- Test upload file melalui interface

## Struktur Database

### Tabel Utama:
- **regions**: Data kabupaten/kota di Jawa Timur
- **categories**: Kategori file (Tangkap, Budidaya, KPP, Pengolahan, Ekspor)
- **files**: Data file yang diupload
- **file_access_logs**: Log akses file
- **settings**: Pengaturan sistem

### API Endpoints:
- `api/upload.php` - Upload file
- `api/files.php` - List, filter, dan statistik file
- `api/download.php` - Download file

## Konfigurasi Database

File `database_config.php` berisi konfigurasi koneksi database:
```php
DB_HOST = 'localhost'
DB_PORT = '3306'
DB_NAME = 'samudata_db'
DB_USER = 'root'
DB_PASS = '' // Default Laragon kosong
```

## Fitur yang Tersedia

### Upload File:
- Validasi tipe file (PDF, DOC, DOCX, XLS, XLSX, ZIP, JPG, JPEG, PNG)
- Maksimal ukuran file: 50MB
- Deteksi duplikat berdasarkan hash file
- Metadata lengkap (kategori, wilayah, pengunggah, dll)

### Manajemen File:
- List semua file dengan pagination
- Filter berdasarkan kategori, wilayah, dan pencarian
- Download file dengan tracking
- Statistik file per kategori dan wilayah

### Keamanan:
- Validasi input
- Prepared statements untuk mencegah SQL injection
- File hash untuk deteksi duplikat
- Log akses file

## Troubleshooting

### Error "Database connection failed":
1. Pastikan Laragon berjalan
2. Pastikan MySQL service aktif
3. Cek konfigurasi database di `database_config.php`

### Error "Permission denied":
1. Pastikan folder `uploads/` memiliki permission write
2. Jalankan Laragon sebagai administrator jika perlu

### File upload gagal:
1. Cek ukuran file (maksimal 50MB)
2. Cek tipe file yang diizinkan
3. Pastikan folder `uploads/` ada dan writable

## Data Real DKP Jatim

Database sudah diisi dengan data real kabupaten/kota di Jawa Timur dan kategori sesuai dengan struktur DKP Jatim:

### Kategori:
- **Perikanan Tangkap**: Data dan dokumen terkait perikanan tangkap
- **Perikanan Budidaya**: Data dan dokumen terkait perikanan budidaya  
- **KPP**: Data dan dokumen terkait Kesatuan Pengelolaan Perikanan
- **Pengolahan & Pemasaran**: Data dan dokumen terkait pengolahan dan pemasaran hasil perikanan
- **Ekspor Perikanan**: Data dan dokumen terkait ekspor produk perikanan

### Wilayah:
Semua 38 kabupaten/kota di Jawa Timur sudah tersedia dalam database.

## Backup & Restore

### Backup Database:
```bash
mysqldump -u root -p samudata_db > samudata_backup.sql
```

### Restore Database:
```bash
mysql -u root -p samudata_db < samudata_backup.sql
```

## Support

Jika mengalami masalah, periksa:
1. Log error di browser console (F12)
2. Log error PHP di Laragon
3. Pastikan semua file API dapat diakses via browser

