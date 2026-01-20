# SMTP Email Setup Guide for ChemZwap

## Overview
Your contact form now sends emails automatically via the backend using PHPMailer. You need to configure SMTP credentials in `backend-php/email-config.php` to enable email delivery.

## Quick Setup Guide

### Step 1: Choose Your Email Provider

You can use any of these options:

#### Option A: Hostinger Email (Recommended if you have Hostinger hosting)
- **SMTP Host:** `smtp.hostinger.com`
- **SMTP Port:** `587`
- **SMTP Secure:** `tls`
- **Username:** Your Hostinger email address (e.g., `info@chemzwap.com`)
- **Password:** Your email password

#### Option B: Gmail
- **SMTP Host:** `smtp.gmail.com`
- **SMTP Port:** `587`
- **SMTP Secure:** `tls`
- **Username:** Your Gmail address
- **Password:** App Password (not your regular password)

**Important:** For Gmail, you need to create an App Password:
1. Go to your Google Account settings
2. Security → 2-Step Verification → App passwords
3. Generate a new app password for "Mail"
4. Use this 16-character password in the config

#### Option C: Outlook/Office365
- **SMTP Host:** `smtp-mail.outlook.com`
- **SMTP Port:** `587`
- **SMTP Secure:** `tls`
- **Username:** Your Outlook email address
- **Password:** Your email password

### Step 2: Update Email Configuration

1. Open `backend-php/email-config.php`
2. Update these lines with your SMTP credentials:

```php
const SMTP_HOST = 'smtp.hostinger.com'; // or smtp.gmail.com, etc.
const SMTP_USERNAME = 'info@chemzwap.com'; // Your email
const SMTP_PASSWORD = 'your-actual-password'; // Your password
```

3. Update the email addresses:

```php
const FROM_EMAIL = 'noreply@chemzwap.com'; // Sender address
const ADMIN_EMAIL = 'info@chemzwap.com'; // Where form submissions go
const REPLY_TO_EMAIL = 'info@chemzwap.com'; // Reply-to address
```

### Step 3: Test the Configuration

1. Save the configuration file
2. Submit a test contact form on your website
3. Check if you receive an email at the configured admin email address

## Troubleshooting

### Email not sending?

1. **Check PHP error logs:**
   - Look in `backend-php/` for error logs
   - Check your server's PHP error log

2. **Test SMTP credentials:**
   - Verify your username and password are correct
   - Make sure your email provider allows SMTP access

3. **Firewall issues:**
   - Ensure port 587 is not blocked on your server
   - Try port 465 with `ssl` if port 587 doesn't work

4. **Fallback to PHP mail():**
   If SMTP continues to fail, you can temporarily use PHP's built-in mail function:
   
   In `email-config.php`, change:
   ```php
   const USE_SMTP = false;
   ```

### Gmail specific issues:

- Make sure 2-Step Verification is enabled
- Use an App Password, not your regular Gmail password
- Check that "Less secure app access" is not blocking the connection

### Hostinger specific issues:

- Verify you're using the correct email account created in Hostinger
- Check that the email account has been activated
- Ensure SMTP is enabled for your hosting plan

## What Happens Now

✅ When someone submits the contact form:
1. The form data is saved to your database
2. A beautifully formatted email is automatically sent to `info@chemzwap.com`
3. The email includes all the form details (name, email, phone, enquiry type, message)
4. The customer sees a success message

✅ The same applies to product enquiries from your marketplace!

## Security Notes

⚠️ **Important:** Never commit `email-config.php` with real credentials to a public repository!

If using Git, add this line to your `.gitignore`:
```
backend-php/email-config.php
```

Then create a template file for others:
```
backend-php/email-config.template.php
```

## Need Help?

If you encounter any issues:
1. Check the error logs
2. Verify your SMTP credentials with your email provider
3. Test sending a simple email from your server using a test script
4. Contact your hosting provider for SMTP support

---

**Next Steps:**
1. Update `backend-php/email-config.php` with your SMTP credentials
2. Test by submitting the contact form
3. Check your email inbox for the notification
