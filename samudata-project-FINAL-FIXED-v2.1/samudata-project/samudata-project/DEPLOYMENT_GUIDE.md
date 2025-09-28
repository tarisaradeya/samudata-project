# Panduan Deployment Samudata v2.0.0

## Ringkasan Perubahan

Aplikasi Samudata telah diperbaiki dan ditingkatkan sesuai dengan permintaan Anda:

### ✅ Masalah yang Telah Diperbaiki

1. **Tombol Upload Dashboard** - Dihapus dari kanan atas dashboard
2. **Aksi Cepat** - Tombol aksi cepat di dashboard sekarang berfungsi
3. **Tampilan Upload** - Form upload dibuat lebih lebar dan dapat di-scroll
4. **Tombol Upload Bidang** - Dihapus dari semua halaman bidang (kanan atas)
5. **Upload Functionality** - Semua tombol upload di bidang sekarang berfungsi
6. **Histori & Log** - Halaman baru dengan tampilan lengkap
7. **Permintaan File** - Halaman baru dengan sistem manajemen permintaan
8. **Favorit** - Tombol "Jelajahi File" sekarang berfungsi
9. **Pengaturan Akun** - Halaman lengkap dengan logout functionality

### ✅ Fitur Baru yang Ditambahkan

- **File Actions**: Download, Favorite, Archive, Edit, Delete dengan konfirmasi
- **Status Tracking**: Sistem tracking status file lengkap
- **Activity Logging**: Log semua aktivitas pengguna
- **Request Management**: Sistem permintaan file dengan status tracking
- **Enhanced UI**: Interface yang lebih responsif dan user-friendly

## Struktur File Deployment

```
samudata-project-FINAL-FIXED/
├── api/                          # Backend API
│   ├── files.php                # File management API
│   ├── upload.php               # Upload API
│   └── download.php             # Download API
├── js/                          # JavaScript files
│   ├── dashboard.js             # Dashboard functionality (FIXED)
│   ├── files.js                 # File management (ENHANCED)
│   ├── histori-log.js           # Activity logging (NEW)
│   ├── permintaan-file.js       # File requests (NEW)
│   └── pengaturan-akun.js       # Account settings (NEW)
├── css/                         # Stylesheets
├── uploads/                     # File storage (create this)
├── database_config.php          # Database config (ENHANCED)
├── database_schema.sql          # Database schema (UPDATED)
├── index.html                   # Landing page
├── dashboard.html               # Dashboard (FIXED)
├── files.html                   # File manager (IMPROVED)
├── upload.html                  # Upload form (WIDER)
├── histori-log.html             # Activity logs (NEW)
├── permintaan-file.html         # File requests (NEW)
├── pengaturan-akun.html         # Account settings (NEW)
├── favorit.html                 # Favorites (ENHANCED)
├── perikanan-tangkap.html       # Bidang page (FIXED)
├── perikanan-budidaya.html      # Bidang page (FIXED)
├── kpp.html                     # Bidang page (FIXED)
├── pengolahan-pemasaran.html    # Bidang page (FIXED)
├── ekspor-perikanan.html        # Bidang page (FIXED)
├── README.md                    # Documentation (UPDATED)
└── DEPLOYMENT_GUIDE.md          # This file
```

## Langkah-Langkah Deployment

### 1. Persiapan Server

```bash
# Install PHP dan extensions yang diperlukan
sudo apt update
sudo apt install -y php php-mysql php-curl php-json php-mbstring php-fileinfo

# Install MySQL/MariaDB
sudo apt install -y mysql-server

# Install web server (pilih salah satu)
sudo apt install -y apache2  # ATAU
sudo apt install -y nginx
```

### 2. Setup Database

```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE samudata_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Buat user (opsional, untuk keamanan)
CREATE USER 'samudata_user'@'localhost' IDENTIFIED BY 'password_yang_kuat';
GRANT ALL PRIVILEGES ON samudata_db.* TO 'samudata_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema database
mysql -u root -p samudata_db < database_schema.sql
```

### 3. Deploy Aplikasi

```bash
# Extract file ke direktori web server
sudo unzip samudata-project-FINAL-FIXED.zip -d /var/www/html/

# Atau untuk Nginx
sudo unzip samudata-project-FINAL-FIXED.zip -d /var/www/

# Set ownership dan permissions
sudo chown -R www-data:www-data /var/www/html/samudata-project/
sudo chmod -R 755 /var/www/html/samudata-project/

# Buat direktori uploads dan set permissions
sudo mkdir -p /var/www/html/samudata-project/uploads
sudo chmod 777 /var/www/html/samudata-project/uploads
sudo chown www-data:www-data /var/www/html/samudata-project/uploads
```

### 4. Konfigurasi Database

Edit file `database_config.php`:

```php
private $host = 'localhost';
private $dbname = 'samudata_db';
private $username = 'samudata_user';  // atau 'root'
private $password = 'password_yang_kuat';
```

### 5. Konfigurasi Web Server

#### Apache (Recommended)
File `.htaccess` sudah disediakan. Pastikan mod_rewrite aktif:

```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

Virtual Host (opsional):
```apache
<VirtualHost *:80>
    DocumentRoot /var/www/html/samudata-project
    ServerName samudata.yourdomain.com
    
    <Directory /var/www/html/samudata-project>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name samudata.yourdomain.com;
    root /var/www/samudata-project;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location /uploads/ {
        internal;
    }
}
```

### 6. Testing

```bash
# Test koneksi database
php -r "
require 'database_config.php';
try {
    \$pdo = new PDO('mysql:host=localhost;dbname=samudata_db', 'username', 'password');
    echo 'Database connection: OK\n';
} catch (Exception \$e) {
    echo 'Database connection: FAILED - ' . \$e->getMessage() . '\n';
}
"

# Test web server
curl -I http://localhost/samudata-project/
```

### 7. Akses Aplikasi

1. Buka browser dan akses: `http://your-server-ip/samudata-project/`
2. Pilih "Administrator" atau "User"
3. Klik "Masuk" untuk masuk ke dashboard
4. Test semua fitur yang telah diperbaiki

## Verifikasi Fitur

### ✅ Checklist Testing

- [ ] Dashboard tidak memiliki tombol upload di kanan atas
- [ ] Aksi cepat di dashboard berfungsi
- [ ] Form upload lebih lebar dan dapat di-scroll
- [ ] Semua halaman bidang tidak memiliki tombol upload di kanan atas
- [ ] Upload file berfungsi di semua bidang
- [ ] Halaman Histori & Log tampil dengan benar
- [ ] Halaman Permintaan File tampil dengan benar
- [ ] Tombol "Jelajahi File" di Favorit berfungsi
- [ ] Halaman Pengaturan Akun lengkap
- [ ] File actions (download, favorite, archive, edit, delete) berfungsi

## Troubleshooting

### Database Connection Error
```bash
# Periksa service MySQL
sudo systemctl status mysql

# Periksa kredensial di database_config.php
# Pastikan user dan password benar
```

### File Upload Error
```bash
# Periksa permissions direktori uploads
ls -la uploads/

# Set ulang permissions jika perlu
sudo chmod 777 uploads/
sudo chown www-data:www-data uploads/
```

### PHP Errors
```bash
# Periksa PHP error log
sudo tail -f /var/log/apache2/error.log
# atau
sudo tail -f /var/log/nginx/error.log
```

### Permission Denied
```bash
# Fix ownership dan permissions
sudo chown -R www-data:www-data /var/www/html/samudata-project/
sudo find /var/www/html/samudata-project/ -type d -exec chmod 755 {} \;
sudo find /var/www/html/samudata-project/ -type f -exec chmod 644 {} \;
sudo chmod 777 uploads/
```

## Keamanan Production

### 1. HTTPS Setup
```bash
# Install Certbot untuk Let's Encrypt
sudo apt install certbot python3-certbot-apache

# Generate SSL certificate
sudo certbot --apache -d samudata.yourdomain.com
```

### 2. Database Security
```sql
-- Ganti password default
ALTER USER 'samudata_user'@'localhost' IDENTIFIED BY 'password_yang_sangat_kuat';

-- Hapus user anonymous
DELETE FROM mysql.user WHERE User='';

-- Hapus database test
DROP DATABASE IF EXISTS test;
```

### 3. File Security
```bash
# Set permissions yang lebih ketat
sudo chmod 644 *.php *.html
sudo chmod 755 api/ js/ css/
sudo chmod 600 database_config.php
```

## Backup

### Database Backup
```bash
# Backup harian
mysqldump -u samudata_user -p samudata_db > backup_$(date +%Y%m%d).sql

# Setup cron untuk backup otomatis
echo "0 2 * * * mysqldump -u samudata_user -p'password' samudata_db > /backup/samudata_$(date +\%Y\%m\%d).sql" | crontab -
```

### File Backup
```bash
# Backup files
tar -czf samudata_files_$(date +%Y%m%d).tar.gz uploads/

# Backup aplikasi lengkap
tar -czf samudata_full_$(date +%Y%m%d).tar.gz /var/www/html/samudata-project/
```

## Monitoring

### Log Monitoring
```bash
# Monitor access log
sudo tail -f /var/log/apache2/access.log | grep samudata

# Monitor error log
sudo tail -f /var/log/apache2/error.log
```

### Disk Usage
```bash
# Monitor penggunaan disk uploads
du -sh uploads/

# Setup alert jika disk usage tinggi
```

## Support

Jika mengalami masalah saat deployment:

1. Periksa log error di `/var/log/apache2/error.log` atau `/var/log/nginx/error.log`
2. Pastikan semua dependencies PHP terinstall
3. Verifikasi permissions file dan direktori
4. Test koneksi database secara manual
5. Periksa konfigurasi web server

---

**Aplikasi siap untuk production deployment!** 🚀

Semua fitur yang diminta telah diimplementasi dan ditest. Aplikasi sekarang memiliki sistem manajemen file yang lengkap dengan UI yang lebih baik dan fungsionalitas yang diperbaiki.

