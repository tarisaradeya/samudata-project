# 🚀 Panduan Deployment Aplikasi Samudata DKP Jawa Timur

## Deskripsi Aplikasi

**Samudata** adalah Sistem Aplikasi Manajemen untuk Data Dinas Kelautan dan Perikanan Jawa Timur. Aplikasi ini dirancang untuk mengelola data dan dokumen terkait berbagai bidang perikanan di seluruh wilayah Jawa Timur.

### Fitur Utama
- **Dashboard Interaktif**: Statistik dan overview data real-time
- **Upload File**: Sistem upload dengan validasi dan kategorisasi
- **Peta Wilayah**: Peta interaktif Jawa Timur dengan penanda kantor DKP
- **Kalender**: Timeline upload dan aktivitas
- **File Manager**: Pengelolaan file per bidang dan wilayah
- **Sistem Login**: Akses bertingkat untuk admin dan user publik
- **Arsip Digital**: Sistem arsip dan pencarian dokumen

## Persyaratan Sistem

### Server Requirements
- **Web Server**: Apache 2.4+ atau Nginx 1.18+
- **PHP**: Versi 7.4 atau lebih tinggi (Recommended: PHP 8.0+)
- **Database**: MySQL 5.7+ atau MariaDB 10.3+
- **Storage**: Minimum 1GB ruang kosong (untuk upload files)
- **Memory**: Minimum 512MB RAM

### PHP Extensions Required
```
- php-mysql (PDO MySQL)
- php-gd (untuk image processing)
- php-json
- php-mbstring
- php-fileinfo
- php-zip
```

## Cara Deploy

### Metode 1: Deploy di Shared Hosting

#### Langkah 1: Upload Files
1. Download file `samudata-project-final.zip`
2. Extract file ZIP di komputer Anda
3. Upload semua file ke folder `public_html` atau `www` di hosting Anda
4. Pastikan struktur folder seperti ini:
   ```
   public_html/
   ├── index.html
   ├── login.html
   ├── dashboard.html
   ├── setup_database.php
   ├── database_config.php
   ├── api/
   ├── js/
   ├── css/
   ├── uploads/
   └── ...
   ```

#### Langkah 2: Setup Database
1. Buat database MySQL melalui cPanel atau panel hosting Anda
2. Catat nama database, username, dan password
3. Edit file `database_config.php`:
   ```php
   private const DB_HOST = 'localhost'; // atau IP server database
   private const DB_NAME = 'nama_database_anda';
   private const DB_USER = 'username_database';
   private const DB_PASS = 'password_database';
   ```

#### Langkah 3: Inisialisasi Database
1. Buka browser dan akses: `https://domain-anda.com/setup_database.php`
2. Tunggu proses setup selesai
3. Jika berhasil, Anda akan melihat pesan "Setup Complete!"
4. Hapus file `setup_database.php` untuk keamanan (opsional)

#### Langkah 4: Test Aplikasi
1. Akses: `https://domain-anda.com`
2. Anda akan diarahkan ke halaman login
3. Pilih "User" untuk akses publik (tanpa password)
4. Pilih "Administrator" dan masukkan kode: `dkpjatim2024`

### Metode 2: Deploy di VPS/Dedicated Server

#### Langkah 1: Persiapan Server
```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Apache, PHP, MySQL
sudo apt install apache2 php php-mysql php-gd php-json php-mbstring php-fileinfo php-zip mysql-server -y

# Enable Apache modules
sudo a2enmod rewrite
sudo systemctl restart apache2
```

#### Langkah 2: Setup MySQL
```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Login ke MySQL
sudo mysql -u root -p

# Buat database dan user
CREATE DATABASE samudata_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'samudata_user'@'localhost' IDENTIFIED BY 'password_yang_kuat';
GRANT ALL PRIVILEGES ON samudata_db.* TO 'samudata_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Langkah 3: Deploy Aplikasi
```bash
# Pindah ke direktori web
cd /var/www/html

# Upload dan extract file
sudo wget https://link-ke-file-zip-anda/samudata-project-final.zip
sudo unzip samudata-project-final.zip
sudo mv samudata-project/* .
sudo rm -rf samudata-project samudata-project-final.zip

# Set permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
sudo chmod -R 777 uploads/
```

#### Langkah 4: Konfigurasi
1. Edit `database_config.php` dengan kredensial database yang benar
2. Akses `http://server-ip/setup_database.php` untuk inisialisasi
3. Test aplikasi di `http://server-ip`

### Metode 3: Deploy dengan Docker (Advanced)

#### Langkah 1: Buat Dockerfile
```dockerfile
FROM php:8.0-apache

# Install extensions
RUN docker-php-ext-install pdo pdo_mysql gd

# Copy application files
COPY . /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html
RUN chmod -R 777 /var/www/html/uploads

# Enable Apache rewrite
RUN a2enmod rewrite

EXPOSE 80
```

#### Langkah 2: Docker Compose
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
    depends_on:
      - db
    volumes:
      - ./uploads:/var/www/html/uploads
  
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: samudata_db
      MYSQL_USER: samudata_user
      MYSQL_PASSWORD: userpassword
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## Konfigurasi Lanjutan

### Keamanan
1. **Ganti Password Admin**: Edit file `login.html` dan ubah password default
2. **SSL Certificate**: Install SSL untuk HTTPS
3. **Firewall**: Konfigurasi firewall untuk membatasi akses
4. **Backup**: Setup backup otomatis database dan files

### Optimasi Performance
1. **PHP OPcache**: Enable OPcache di PHP
2. **Gzip Compression**: Enable compression di web server
3. **CDN**: Gunakan CDN untuk static assets
4. **Database Indexing**: Pastikan index database optimal

### Monitoring
1. **Error Logs**: Monitor PHP dan Apache error logs
2. **Disk Space**: Monitor penggunaan disk untuk uploads
3. **Database Size**: Monitor pertumbuhan database
4. **Performance**: Monitor response time aplikasi

## Troubleshooting

### Error Database Connection
```
Solusi:
1. Periksa kredensial database di database_config.php
2. Pastikan MySQL service berjalan
3. Periksa firewall dan port 3306
4. Cek user privileges di MySQL
```

### Upload File Gagal
```
Solusi:
1. Periksa permissions folder uploads/ (harus 777)
2. Cek PHP upload_max_filesize dan post_max_size
3. Pastikan disk space cukup
4. Periksa allowed file extensions di settings
```

### Halaman Blank/Error 500
```
Solusi:
1. Periksa PHP error logs
2. Pastikan semua PHP extensions terinstall
3. Cek file permissions
4. Periksa syntax error di PHP files
```

## Maintenance

### Backup Rutin
```bash
# Backup database
mysqldump -u username -p samudata_db > backup_$(date +%Y%m%d).sql

# Backup files
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

### Update Aplikasi
1. Backup database dan files
2. Upload file aplikasi terbaru
3. Jalankan migration script jika ada
4. Test fungsionalitas

### Monitoring Logs
```bash
# Monitor Apache access logs
tail -f /var/log/apache2/access.log

# Monitor PHP error logs
tail -f /var/log/apache2/error.log
```

## Support & Kontak

Untuk bantuan teknis atau pertanyaan terkait deployment:
- **Email**: support@dkp.jatimprov.go.id
- **Dokumentasi**: Lihat file README.md untuk detail teknis
- **Issues**: Laporkan bug atau request fitur

---

**Aplikasi Samudata DKP Jawa Timur**  
*Lautnya Luas, Datanya Jelas – Samudata, Solusi Cerdas*

© 2024 Dinas Kelautan dan Perikanan Provinsi Jawa Timur

