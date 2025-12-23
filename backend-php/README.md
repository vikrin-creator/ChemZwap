# PHP Backend Installation & Deployment Guide

## ✅ What Was Converted

Your entire **Node.js/Express backend has been converted to PHP**:
- ✅ Authentication (login, register, forgot-password, reset-password)
- ✅ Products CRUD operations
- ✅ Enquiries management
- ✅ Dashboard statistics
- ✅ JWT authentication
- ✅ Email sending (PHPMailer)
- ✅ Password hashing (bcrypt → password_hash)
- ✅ CORS headers

## 📁 File Structure

```
backend-php/
├── index.php           # Main router
├── config.php          # Configuration
├── database.php        # Database connection (PDO)
├── auth.php            # JWT authentication
├── mailer.php          # Email sending
├── cors.php            # CORS headers
├── .htaccess           # URL rewriting
├── composer.json       # PHP dependencies
└── api/
    ├── auth.php        # Auth routes
    ├── products.php    # Product routes
    ├── enquiries.php   # Enquiry routes
    └── dashboard.php   # Dashboard stats
```

## 🚀 Local Installation

### 1. Install PHP Dependencies

```bash
cd backend-php
composer install
```

This will install:
- `firebase/php-jwt` - JWT token handling
- `phpmailer/phpmailer` - Email sending

### 2. Test Locally (using PHP built-in server)

```bash
php -S localhost:8000
```

Then test: `http://localhost:8000/api/health`

## 🌐 Hostinger Deployment

### Method 1: Via FTP (Recommended)

1. **Connect to Hostinger via FTP**:
   - Host: Your Hostinger FTP hostname
   - Username: Your FTP username
   - Password: Your FTP password

2. **Upload Files**:
   - Upload the entire `backend-php` folder to `/public_html/api/`
   - Make sure the uploaded path is: `/public_html/api/...`

3. **Run Composer on Server** (via SSH or Hostinger File Manager):
   ```bash
   cd public_html/api
   composer install
   ```

### Method 2: Via GitHub Actions

Create `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy PHP Backend to Hostinger

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Install Composer dependencies
      run: |
        cd backend-php
        composer install --no-dev --optimize-autoloader
    
    - name: Deploy via FTP
      uses: SamKirkland/FTP-Deploy-Action@v4.3.5
      with:
        server: ${{ secrets.HOSTINGER_FTP_SERVER }}
        username: ${{ secrets.HOSTINGER_FTP_USERNAME }}
        password: ${{ secrets.HOSTINGER_FTP_PASSWORD }}
        local-dir: ./backend-php/
        server-dir: /public_html/api/
```

## 🔧 Update Frontend Configuration

### Admin Panel

Update `admin/.env`:
```
VITE_API_URL=https://yourdomain.com/api
```

### Frontend

Update `frontend/.env` (if exists):
```
VITE_API_URL=https://yourdomain.com/api
```

## ✅ Testing Checklist

After deployment, test these endpoints:

- ✅ `GET /api/health` - Should return `{"status":"ok"}`
- ✅ `POST /api/auth/login` - Login
- ✅ `POST /api/auth/forgot-password` - Request reset code
- ✅ `POST /api/auth/reset-password` - Reset password
- ✅ `GET /api/products` - Get all products
- ✅ `GET /api/enquiries` - Get all enquiries (requires auth)
- ✅ `GET /api/dashboard/stats` - Get dashboard stats

## 🐛 Troubleshooting

### Issue: 500 Internal Server Error

1. Check Hostinger's PHP error logs
2. Ensure PHP version is 7.4 or higher
3. Verify `composer install` was run

### Issue: Database Connection Failed

1. Check `config.php` has correct database credentials
2. Ensure database exists on Hostinger
3. Verify user has correct permissions

### Issue: Email Not Sending

1. Gmail might block "less secure apps"
2. Use Gmail App Password instead of regular password
3. Check `config.php` has correct email credentials

### Issue: CORS Errors

1. Ensure `.htaccess` file is uploaded
2. Check Apache `mod_rewrite` is enabled
3. Verify CORS headers in `cors.php`

## 📝 Notes

- PHP backend uses **PDO** for database (same MySQL database)
- **Passwords are hashed** with PHP's `password_hash()`
- **JWT tokens** work the same way as before
- All API endpoints remain **exactly the same** as Node.js version
- No frontend code changes needed (except API URL)

## 🎉 You're Done!

Your backend is now PHP-based and ready for Hostinger deployment!
