# Security Audit Report - ChemZwap Application

**Date:** June 13, 2026  
**Scope:** Backend-PHP and Frontend Applications  
**Severity Levels:** Critical, High, Medium, Low

---

## Executive Summary

This security audit identified **23 security vulnerabilities** across the backend-PHP and frontend applications. The findings include **5 Critical**, **8 High**, **7 Medium**, and **3 Low** severity issues that compromise the overall security posture of the application.

---

## Critical Severity Issues

### 1. Hardcoded Credentials in config.php
**Location:** `backend-php/config.php` (Lines 35-45)  
**Severity:** Critical  
**CWE:** CWE-798 (Use of Hard-coded Credentials)

**Description:**
The configuration file contains hardcoded database credentials, JWT secrets, and email passwords as fallback values. These credentials are exposed in the source code and can be accessed by anyone with repository access.

**Vulnerable Code:**
```php
if (!defined('DB_USER')) define('DB_USER', 'u177524058_Chemzwap');
if (!defined('DB_PASSWORD')) define('DB_PASSWORD', 'Chemzwap@123');
if (!defined('DB_NAME')) define('DB_NAME', 'u177524058_Chemzwap');
if (!defined('JWT_SECRET')) define('JWT_SECRET', 'chemzwap_super_secret_jwt_key_2024_hostinger_prod');
if (!defined('EMAIL_PASS')) define('EMAIL_PASS', 'rvsq zyhf qmtj apqb');
```

**Impact:**
- Full database access
- Ability to forge JWT tokens
- Email account compromise
- Complete system compromise

**Recommendation:**
- Remove all hardcoded credentials immediately
- Use environment variables exclusively
- Ensure .env file is properly secured and not committed to version control
- Rotate all exposed credentials immediately

---

### 2. Weak JWT Secret
**Location:** `backend-php/config.php` (Line 40)  
**Severity:** Critical  
**CWE:** CWE-327 (Use of a Broken or Risky Cryptographic Algorithm)

**Description:**
The JWT secret key is weak, predictable, and hardcoded. Using a weak secret makes it trivial for attackers to forge tokens and bypass authentication.

**Vulnerable Code:**
```php
if (!defined('JWT_SECRET')) define('JWT_SECRET', 'chemzwap_super_secret_jwt_key_2024_hostinger_prod');
```

**Impact:**
- Attackers can forge valid JWT tokens
- Complete authentication bypass
- Unauthorized access to admin functionality
- User impersonation

**Recommendation:**
- Generate a cryptographically strong random secret (minimum 256 bits)
- Store in environment variables
- Implement token rotation mechanism
- Use shorter token expiration times with refresh tokens

---

### 3. Email Password Exposure
**Location:** `backend-php/config.php` (Line 44)  
**Severity:** Critical  
**CWE:** CWE-312 (Cleartext Storage of Sensitive Information)

**Description:**
Gmail app password is hardcoded in plaintext in the configuration file, exposing email credentials to anyone with source code access.

**Vulnerable Code:**
```php
if (!defined('EMAIL_PASS')) define('EMAIL_PASS', 'rvsq zyhf qmtj apqb');
```

**Impact:**
- Email account compromise
- Ability to send malicious emails
- Access to password reset functionality
- Phishing attacks using legitimate email

**Recommendation:**
- Remove hardcoded password immediately
- Use environment variables
- Rotate the exposed Gmail app password
- Consider using OAuth2 for email authentication instead of app passwords

---

### 4. Error Information Disclosure
**Location:** `backend-php/api/products.php` (Line 84), `enquiries.php` (Line 97), `categories.php` (Line 47)  
**Severity:** Critical  
**CWE:** CWE-209 (Information Exposure Through an Error Message)

**Description:**
Stack traces and detailed error messages are exposed to clients in production error responses, revealing internal system information.

**Vulnerable Code:**
```php
echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage(), 'error_detail' => $e->getTraceAsString()]);
```

**Impact:**
- Exposure of file paths and directory structure
- Revelation of database schema information
- Assistance in crafting targeted attacks
- Information about server configuration

**Recommendation:**
- Remove stack traces from all error responses
- Implement generic error messages for production
- Log detailed errors server-side only
- Use environment-based error handling

---

### 5. No Rate Limiting on Authentication Endpoints
**Location:** `backend-php/api/auth.php`  
**Severity:** Critical  
**CWE:** CWE-307 (Improper Restriction of Excessive Authentication Attempts)

**Description:**
Authentication endpoints (login, register, forgot password) have no rate limiting, allowing unlimited brute force attacks.

**Impact:**
- Brute force password attacks
- Credential stuffing attacks
- DoS attacks on authentication system
- Automated account enumeration

**Recommendation:**
- Implement rate limiting on all authentication endpoints
- Use exponential backoff for failed attempts
- Implement account lockout after multiple failures
- Add CAPTCHA for suspicious activity

---

## High Severity Issues

### 6. Weak Password Policy
**Location:** `backend-php/api/auth.php` (Line 114)  
**Severity:** High  
**CWE:** CWE-521 (Weak Password Requirements)

**Description:**
Password policy only requires 6 characters minimum, with no complexity requirements.

**Vulnerable Code:**
```php
if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
    exit;
}
```

**Impact:**
- Weak passwords easily cracked
- Increased risk of account compromise
- Susceptibility to dictionary attacks

**Recommendation:**
- Require minimum 12 characters
- Enforce complexity (uppercase, lowercase, numbers, special characters)
- Implement password strength meter
- Check against common password lists

---

### 7. Insecure CORS Configuration
**Location:** `backend-php/cors.php` (Lines 3-27)  
**Severity:** High  
**CWE:** CWE-942 (Permissive Cross-domain Policy with Untrusted Domains)

**Description:**
CORS configuration allows multiple localhost origins and has a fallback that could be exploited.

**Vulnerable Code:**
```php
$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:3001',
    // ... multiple localhost origins
];
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('Access-Control-Allow-Origin: http://localhost:3000');
}
```

**Impact:**
- Potential for CSRF attacks
- Data exposure to unauthorized origins
- Bypass of same-origin policy

**Recommendation:**
- Remove localhost origins in production
- Implement strict origin validation
- Use specific allowed origins only
- Remove fallback origin

---

### 8. Insufficient File Upload Validation
**Location:** `backend-php/api/products.php` (Lines 117-140), `categories.php` (Lines 66-84)  
**Severity:** High  
**CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)

**Description:**
File uploads only validate MIME type, not actual file content or size limits. No validation for file content, double extensions, or malicious files.

**Vulnerable Code:**
```php
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$fileType = $_FILES['image']['type'];
if (in_array($fileType, $allowedTypes)) {
    // Process upload without further validation
}
```

**Impact:**
- Upload of malicious files
- Potential remote code execution
- Server-side file inclusion attacks
- Storage of inappropriate content

**Recommendation:**
- Validate file content, not just MIME type
- Implement file size limits
- Use proper file extension validation
- Scan uploaded files for malware
- Store uploads outside web root
- Generate random filenames

---

### 9. SQL Injection Risk in Dynamic IN Clause
**Location:** `backend-php/api/products.php` (Lines 50-57)  
**Severity:** High  
**CWE:** CWE-89 (SQL Injection)

**Description:**
While using prepared statements, the dynamic IN clause construction could be vulnerable if productIds array is not properly validated.

**Vulnerable Code:**
```php
$productIds = array_map(function($p) { return $p['id']; }, $products);
$placeholders = implode(',', array_fill(0, count($productIds), '?'));
$allSections = $db->fetchAll(
    "SELECT product_id, title, content FROM product_extra_sections WHERE product_id IN ($placeholders) ORDER BY id ASC",
    $productIds
);
```

**Impact:**
- Potential SQL injection
- Data exfiltration
- Database manipulation

**Recommendation:**
- Validate all product IDs are integers
- Use parameterized queries exclusively
- Consider using separate queries or JOIN operations
- Implement input whitelisting

---

### 10. No Input Sanitization
**Location:** Multiple API endpoints  
**Severity:** High  
**CWE:** CWE-20 (Improper Input Validation)

**Description:**
User input is not sanitized before storage or display, leading to potential XSS and stored XSS attacks.

**Impact:**
- Cross-site scripting (XSS) attacks
- Stored XSS in database
- Session hijacking
- Defacement of application

**Recommendation:**
- Implement input sanitization on all user inputs
- Use prepared statements for database queries
- Encode output before displaying
- Implement Content Security Policy (CSP)

---

### 11. Admin Authentication Bypass Risk
**Location:** `backend-php/api/auth.php` (Lines 48-58)  
**Severity:** High  
**CWE:** CWE-287 (Improper Authentication)

**Description:**
Admin login only checks email address, not proper role verification. Any user with the admin email can gain admin privileges.

**Vulnerable Code:**
```php
$adminEmail = 'swapchemicals@gmail.com';
if (strtolower($email) !== strtolower($adminEmail)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Access denied. Admin login only.']);
    exit;
}
// Force admin role for the admin login
$tokenRole = 'admin';
if ($user['role'] !== 'admin') {
    $db->query('UPDATE users SET role = ? WHERE id = ?', ['admin', $user['id']]);
}
```

**Impact:**
- Unauthorized admin access
- Privilege escalation
- Complete system compromise
- Data manipulation

**Recommendation:**
- Implement proper role-based access control
- Verify role from database, not just email
- Add additional admin verification (2FA)
- Log all admin access attempts

---

### 12. No CSRF Protection
**Location:** All state-changing endpoints  
**Severity:** High  
**CWE:** CWE-352 (Cross-Site Request Forgery)

**Description:**
No CSRF tokens are implemented for state-changing operations, allowing attackers to perform actions on behalf of authenticated users.

**Impact:**
- Unauthorized state changes
- Data manipulation
- Account takeover
- Financial transactions

**Recommendation:**
- Implement CSRF tokens for all state-changing operations
- Validate tokens on server-side
- Use SameSite cookie attributes
- Implement double-submit cookie pattern

---

### 13. Long JWT Token Expiry
**Location:** `backend-php/auth.php` (Line 14)  
**Severity:** High  
**CWE:** CWE-613 (Insufficient Session Expiration)

**Description:**
JWT tokens have a 7-day expiry without refresh token mechanism, increasing the window of opportunity for token theft.

**Vulnerable Code:**
```php
'exp' => time() + (7 * 24 * 60 * 60) // 7 days
```

**Impact:**
- Extended window for token misuse
- No token revocation mechanism
- Increased risk from token theft

**Recommendation:**
- Reduce token expiry to 1-2 hours
- Implement refresh token mechanism
- Add token revocation on logout
- Implement token blacklisting

---

## Medium Severity Issues

### 14. Missing Security Headers
**Location:** `backend-php/cors.php`  
**Severity:** Medium  
**CWE:** CWE-693 (Protection Mechanism Failure)

**Description:**
No security headers are implemented (CSP, X-Frame-Options, X-Content-Type-Options, etc.).

**Impact:**
- Vulnerable to clickjacking
- XSS attacks more likely
- MIME-type sniffing attacks
- Lack of browser security protections

**Recommendation:**
- Implement Content-Security-Policy (CSP)
- Add X-Frame-Options: DENY
- Add X-Content-Type-Options: nosniff
- Add X-XSS-Protection
- Implement Strict-Transport-Security (HSTS)

---

### 15. Directory Listing Enabled
**Location:** `backend-php/uploads/`  
**Severity:** Medium  
**CWE:** CWE-538 (Insertion of Sensitive Information into Externally-Accessible File or Directory)

**Description:**
Uploads directory may be accessible directly, potentially exposing uploaded files.

**Impact:**
- Unauthorized file access
- Information disclosure
- Potential data leakage

**Recommendation:**
- Disable directory listing in web server configuration
- Move uploads outside web root
- Implement access controls
- Use secure file serving mechanism

---

### 16. No File Size Limits
**Location:** File upload endpoints  
**Severity:** Medium  
**CWE:** CWE-770 (Allocation of Resources Without Limits)

**Description:**
No file size limits are enforced on file uploads, allowing potential DoS attacks.

**Impact:**
- Server resource exhaustion
- DoS attacks
- Storage space depletion

**Recommendation:**
- Implement maximum file size limits
- Enforce limits in PHP configuration
- Monitor storage usage
- Implement quotas per user

---

### 17. Weak Password Reset Mechanism
**Location:** `backend-php/api/auth.php` (Lines 279-367)  
**Severity:** Medium  
**CWE:** CWE-640 (Weak Password Recovery Mechanism)

**Description:**
Password reset uses 6-digit numeric codes with only 15-minute expiry. Limited entropy makes codes guessable.

**Vulnerable Code:**
```php
$resetCode = sprintf("%06d", mt_rand(0, 999999));
$expiry = date('Y-m-d H:i:s', time() + (15 * 60)); // 15 minutes
```

**Impact:**
- Brute forceable reset codes
- Account takeover through password reset
- Limited protection against automated attacks

**Recommendation:**
- Use longer, alphanumeric reset codes
- Implement rate limiting on reset attempts
- Add CAPTCHA for reset requests
- Consider using email links instead of codes
- Log all reset attempts

---

### 18. Insecure Token Storage in Frontend
**Location:** `frontend/src/context/AuthContext.jsx` (Line 17, 65)  
**Severity:** Medium  
**CWE:** CWE-922 (Insecure Storage of Sensitive Information)

**Description:**
JWT tokens are stored in localStorage, which is vulnerable to XSS attacks.

**Vulnerable Code:**
```javascript
const [token, setToken] = useState(localStorage.getItem('userToken'));
localStorage.setItem('userToken', data.token);
```

**Impact:**
- Token theft via XSS
- Session hijacking
- Account compromise

**Recommendation:**
- Use httpOnly cookies for token storage
- Implement secure flag on cookies
- Consider using sessionStorage with additional protections
- Implement token rotation

---

### 19. No Input Validation on Frontend
**Location:** Multiple frontend components  
**Severity:** Medium  
**CWE:** CWE-20 (Improper Input Validation)

**Description:**
Frontend does not validate user input before sending to backend, relying solely on backend validation.

**Impact:**
- Increased server load
- Poor user experience
- Potential for bypassing backend validation

**Recommendation:**
- Implement client-side input validation
- Validate format, length, and type
- Provide immediate feedback
- Don't rely solely on frontend validation

---

### 20. Debug Information in Production
**Location:** `frontend/src/admin/services/api.js` (Lines 116-140)  
**Severity:** Medium  
**CWE:** CWE-489 (Active Debug Code)

**Description:**
Debug logging is present in production code, potentially exposing sensitive information.

**Vulnerable Code:**
```javascript
if (process.env.NODE_ENV === 'development') {
    console.group('File Upload Debug');
    console.log('Upload URL:', url);
    // ... extensive debug logging
}
```

**Impact:**
- Information disclosure in browser console
- Exposure of API endpoints
- Potential data leakage

**Recommendation:**
- Remove all debug logging from production builds
- Use proper logging frameworks
- Implement environment-based logging levels
- Strip debug code in production builds

---

## Low Severity Issues

### 21. Verbose Error Messages
**Location:** Multiple API endpoints  
**Severity:** Low  
**CWE:** CWE-209 (Information Exposure Through an Error Message)

**Description:**
Error messages reveal too much information about system internals.

**Impact:**
- Information leakage
- Assistance to attackers
- Poor user experience

**Recommendation:**
- Use generic error messages
- Log detailed errors server-side
- Implement proper error handling

---

### 22. Missing API Versioning
**Location:** All API endpoints  
**Severity:** Low  
**CWE:** N/A

**Description:**
No API versioning is implemented, making future changes difficult and potentially breaking clients.

**Impact:**
- Difficult to maintain backwards compatibility
- Potential breaking changes
- Poor API lifecycle management

**Recommendation:**
- Implement API versioning (e.g., /api/v1/)
- Document deprecation timelines
- Use version negotiation

---

### 23. No Request Logging
**Location:** All API endpoints  
**Severity:** Low  
**CWE:** CWE-778 (Insufficient Logging)

**Description:**
No comprehensive logging of API requests for security monitoring and audit trails.

**Impact:**
- Difficult to detect attacks
- No audit trail
- Limited forensic capabilities

**Recommendation:**
- Implement comprehensive request logging
- Log authentication attempts
- Monitor for suspicious activity
- Implement log aggregation and analysis

---

## Summary Statistics

| Severity | Count | Percentage |
|----------|-------|------------|
| Critical | 5     | 21.7%      |
| High     | 8     | 34.8%      |
| Medium   | 7     | 30.4%      |
| Low      | 3     | 13.1%      |
| **Total** | **23** | **100%**   |

---

## Priority Recommendations

### Immediate Actions (Critical)
1. **Rotate all exposed credentials** immediately (database, JWT secret, email password)
2. **Remove all hardcoded credentials** from source code
3. **Implement rate limiting** on all authentication endpoints
4. **Remove stack traces** from error responses
5. **Strengthen JWT secret** with cryptographically secure random value

### Short-term Actions (High Priority)
1. Implement proper password policy
2. Add CSRF protection to all state-changing endpoints
3. Secure file upload validation
4. Fix admin authentication bypass
5. Reduce JWT token expiry and implement refresh tokens

### Medium-term Actions (Medium Priority)
1. Implement security headers
2. Add input sanitization
3. Secure token storage (use httpOnly cookies)
4. Strengthen password reset mechanism
5. Add file size limits

### Long-term Actions (Low Priority)
1. Implement comprehensive logging
2. Add API versioning
3. Improve error messages
4. Add security monitoring

---

## Compliance Notes

### OWASP Top 10 (2021) Coverage
- **A01:2021 - Broken Access Control:** Issues #11, #13, #24
- **A02:2021 - Cryptographic Failures:** Issues #1, #2, #3, #18
- **A03:2021 - Injection:** Issues #9, #10, #24
- **A04:2021 - Insecure Design:** Issues #5, #12, #17, #26
- **A05:2021 - Security Misconfiguration:** Issues #7, #14, #15, #16, #25, #27
- **A06:2021 - Vulnerable and Outdated Components:** Issue #28
- **A07:2021 - Identification and Authentication Failures:** Issues #5, #6, #11, #13, #17, #18
- **A08:2021 - Software and Data Integrity Failures:** Issue #8

---

## Additional Frontend-Specific Security Issues

### 24. Cross-Site Scripting (XSS) Vulnerabilities
**Location:** Multiple React components (`Products.jsx`, `ProductDetail.jsx`, `Home.jsx`, `Contact.jsx`)  
**Severity:** High  
**CWE:** CWE-79 (Improper Neutralization of Input During Web Page Generation)

**Description:**
User input is rendered without proper sanitization in multiple React components. While React provides some XSS protection by default, direct rendering of user-controlled data without additional sanitization creates XSS risks.

**Vulnerable Code:**
```jsx
// Products.jsx - Line 253
<h3 className="text-xl font-bold text-gray-900 mb-4 font-['Outfit'] line-clamp-2">
    {product.productName}
</h3>

// ProductDetail.jsx - Lines 267-268
<div className="flex-1 text-gray-900 whitespace-pre-wrap">
    {section.content}
</div>
```

**Impact:**
- Stored XSS attacks
- Session hijacking
- Data theft
- Malicious script execution

**Recommendation:**
- Implement input sanitization libraries (DOMPurify)
- Validate and sanitize all user inputs
- Implement Content Security Policy (CSP)
- Use React's built-in escaping properly

---

### 25. Source Maps Enabled in Production
**Location:** `frontend/vite.config.js` (Line 15)  
**Severity:** Medium  
**CWE:** CWE-200 (Information Exposure)

**Description:**
Source maps are enabled in the production build configuration, which exposes the original source code and can reveal sensitive implementation details.

**Vulnerable Code:**
```javascript
build: {
    outDir: 'dist',
    sourcemap: true  // Should be false in production
}
```

**Impact:**
- Exposure of source code structure
- Revelation of API endpoints and logic
- Assistance in reverse engineering
- Information leakage

**Recommendation:**
- Disable source maps in production builds
- Use environment-based configuration
- Keep source maps only for development

---

### 26. Unsafe Redirect Handling
**Location:** `frontend/src/pages/auth/Login.jsx` (Line 20), `Register.jsx` (Line 25)  
**Severity:** High  
**CWE:** CWE-601 (URL Redirection to Untrusted Site)

**Description:**
Login and Register components use redirect parameters from URL query strings without proper validation, making them vulnerable to open redirect attacks.

**Vulnerable Code:**
```javascript
const redirectTo = searchParams.get('redirect') || '/';
// Later used without validation:
navigate(redirectTo);
```

**Impact:**
- Phishing attacks
- Open redirect vulnerabilities
- Credential theft
- Social engineering attacks

**Recommendation:**
- Validate redirect URLs against whitelist
- Use relative URLs only
- Implement safe redirect utilities
- Log all redirect attempts

---

### 27. Console Logging in Production
**Location:** Multiple frontend files  
**Severity:** Medium  
**CWE:** CWE-532 (Insertion of Sensitive Information into Log File)

**Description:**
Multiple console.log statements are present in production code, potentially exposing sensitive information to browser consoles.

**Vulnerable Code:**
```javascript
// Home.jsx - Line 72
console.log('Using default categories (API unavailable)');

// Products.jsx - Line 27
console.error('Error fetching categories:', error);

// admin/services/api.js - Lines 117-140 (extensive debug logging)
if (process.env.NODE_ENV === 'development') {
    console.group('File Upload Debug');
    // ... extensive logging
}
```

**Impact:**
- Information disclosure
- Exposure of API structure
- Potential data leakage
- Assistance to attackers

**Recommendation:**
- Remove all console.log statements from production
- Use proper logging frameworks
- Implement environment-based logging
- Strip debug code in production builds

---

### 28. EmailJS Credentials Exposure Risk
**Location:** `frontend/.env` (Lines 4-6)  
**Severity:** Medium  
**CWE:** CWE-798 (Use of Hard-coded Credentials)

**Description:**
EmailJS credentials are stored in the .env file, which could be exposed if the frontend build process is not properly secured.

**Vulnerable Code:**
```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

**Impact:**
- Potential email service abuse
- Unauthorized email sending
- Credential exposure in client-side code

**Recommendation:**
- Move email functionality to backend
- Remove EmailJS credentials from frontend
- Implement server-side email sending
- Use environment-specific configurations

---

### 29. No Content Security Policy (CSP)
**Location:** Frontend application  
**Severity:** High  
**CWE:** CWE-693 (Protection Mechanism Failure)

**Description:**
No Content Security Policy is implemented in the frontend application, leaving it vulnerable to XSS and other injection attacks.

**Impact:**
- XSS attacks more likely
- Data injection attacks
- Clickjacking vulnerabilities
- Lack of browser security protections

**Recommendation:**
- Implement strict CSP headers
- Use nonce or hash-based CSP
- Disable unsafe inline scripts
- Report CSP violations

---

### 30. No Client-Side Rate Limiting
**Location:** All API calls in frontend  
**Severity:** Medium  
**CWE:** CWE-770 (Allocation of Resources Without Limits)

**Description:**
No client-side rate limiting is implemented for API calls, allowing potential abuse and DoS attacks.

**Impact:**
- API abuse
- DoS attacks
- Increased server load
- Potential resource exhaustion

**Recommendation:**
- Implement client-side rate limiting
- Use request throttling
- Implement exponential backoff
- Monitor API usage patterns

---

## Updated Summary Statistics

| Severity | Count | Percentage |
|----------|-------|------------|
| Critical | 5     | 16.7%      |
| High     | 11    | 36.7%      |
| Medium   | 11    | 36.7%      |
| Low      | 3     | 10.0%      |
| **Total** | **30** | **100%**   |

---

## Conclusion

The ChemZwap application has significant security vulnerabilities that require immediate attention. The presence of hardcoded credentials and weak authentication mechanisms poses the highest risk. A comprehensive security remediation plan should be implemented immediately, starting with the critical issues.

**Estimated Remediation Time:**
- Critical issues: 1-2 weeks
- High issues: 2-3 weeks
- Medium issues: 3-4 weeks
- Low issues: 1-2 weeks

**Total Estimated Time:** 7-11 weeks for complete remediation

---

**Report Generated By:** Security Audit Tool  
**Audit Date:** June 13, 2026  
**Next Recommended Audit:** After remediation completion
