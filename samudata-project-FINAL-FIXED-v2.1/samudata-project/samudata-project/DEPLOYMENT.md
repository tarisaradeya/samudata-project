# Panduan Deployment Samudata

## Cara Deploy Website Samudata

### 1. Persiapan Server
- Web server yang mendukung HTML5, CSS3, dan JavaScript (Apache, Nginx, IIS)
- Tidak memerlukan database atau backend khusus untuk versi frontend ini
- Pastikan server dapat melayani file statis

### 2. Upload File
1. Extract file `samudata-website.zip` ke direktori web server
2. Pastikan semua file dan folder terupload dengan benar:
   ```
   /public_html/ (atau root directory web)
   ├── index.html
   ├── dashboard.html
   ├── files.html
   ├── calendar.html
   ├── js/
   ├── css/
   ├── images/
   ├── icons/
   ├── data/
   ├── README.md
   └── .env.example
   ```

### 3. Konfigurasi Web Server

#### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static files
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/samudata-project;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### 4. Verifikasi Deployment
1. Buka browser dan akses domain/IP server
2. Pastikan halaman landing page Samudata muncul dengan benar
3. Test navigasi ke halaman Dashboard, File Manager, dan Kalender
4. Verifikasi peta interaktif berfungsi
5. Cek console browser untuk memastikan tidak ada error JavaScript

### 5. Kustomisasi (Opsional)

#### Update Data GeoJSON
- Edit file `data/real_data_jatim.json` dengan data wilayah Jawa Timur yang akurat
- Sesuaikan koordinat dan nama kabupaten/kota

#### Branding
- Ganti logo di `images/samudata-logo.png`
- Sesuaikan warna di file CSS jika diperlukan
- Update informasi kontak di footer

#### Integrasi Backend
- Untuk implementasi penuh, integrasikan dengan CodeIgniter 4 backend
- Sesuaikan endpoint API di file JavaScript
- Implementasikan autentikasi dan manajemen file

### 6. SSL/HTTPS (Direkomendasikan)
```bash
# Untuk Let's Encrypt
certbot --nginx -d your-domain.com
```

### 7. Monitoring
- Setup monitoring untuk memastikan website selalu online
- Monitor performa loading page
- Backup berkala file website

### 8. Troubleshooting

#### Masalah Umum:
1. **Peta tidak muncul**: Pastikan koneksi internet aktif untuk CDN Leaflet
2. **JavaScript error**: Cek console browser dan pastikan semua file JS terupload
3. **Gambar tidak muncul**: Verifikasi path gambar dan permission folder
4. **CSS tidak load**: Pastikan CDN Tailwind CSS dapat diakses

#### Performance:
- Aktifkan compression (gzip)
- Setup CDN untuk file statis
- Optimize gambar jika diperlukan
- Enable browser caching

### 9. Keamanan
- Pastikan direktori tidak memiliki listing
- Setup firewall yang sesuai
- Regular update web server
- Monitor access logs

### 10. Backup
```bash
# Backup otomatis (crontab)
0 2 * * * tar -czf /backup/samudata-$(date +\%Y\%m\%d).tar.gz /path/to/samudata-project
```

## Kontak Support
Untuk bantuan teknis deployment, hubungi tim IT DKP Jawa Timur.

---
**Samudata** - Lautnya Luas, Datanya Jelas – Samudata, Solusi Cerdas.

