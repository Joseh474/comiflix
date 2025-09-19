# Comiflix Authentication System - Integration Guide

This guide will help you integrate the PHP authentication system into your existing HTML files with modal login forms.

## Files Overview

1. **PHP Backend Files:**
   - `config.php` - Database configuration and utility functions
   - `register.php` - User registration handler
   - `login.php` - User login handler
   - `forgot_password.php` - Password reset request handler
   - `reset_password.php` - Password reset form and handler
   - `check_auth.php` - Authentication status checker
   - `logout.php` - User logout handler
   - `dashboard.php` - Protected user dashboard
   - `database.sql` - Database setup script

2. **Frontend Enhancement Files:**
   - `modal-auth.js` - JavaScript to enhance existing modals
   - `modal-auth.css` - Styles for enhanced authentication modals

## Setup Instructions

### Step 1: Database Setup
1. Import the `database.sql` file into your MySQL database
2. Update database credentials in `config.php`

### Step 2: File Placement
Place all PHP files in your web server directory (same location as your HTML files).

### Step 3: Integration with Existing HTML Files

For each HTML file that has the login modal, follow these steps:

#### A. Add CSS and JavaScript Files
Add these lines to the `<head>` section of your HTML files:

```html
<!-- Add after your existing CSS -->
<link rel="stylesheet" href="modal-auth.css">
```

Add this before the closing `</body>` tag:

```html
<!-- Add before your existing script.js -->
<script src="modal-auth.js"></script>
```

#### B. Update Your HTML Structure
Your existing login modal structure will be automatically enhanced by the JavaScript. No changes needed to the modal HTML structure!

The JavaScript will detect your existing modal and transform it into a full authentication system with:
- Login form
- Registration form  
- Forgot password form
- Tab navigation between forms

### Step 4: Email Configuration (Optional)
To enable password reset emails, update the email settings in `config.php`:

```php
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-app-password');
define('FROM_EMAIL', 'your-email@gmail.com');
```

**Note:** For Gmail, you'll need to create an "App Password" instead of using your regular password.

## How It Works

### 1. Modal Enhancement
The `modal-auth.js` script automatically:
- Detects your existing login modal
- Replaces the content with enhanced authentication forms
- Adds tab navigation (Login/Register/Forgot Password)
- Handles form submissions via AJAX
- Shows success/error messages
- Updates UI when user logs in

### 2. Authentication Flow
- **Registration:** User creates account → Stored in database → Redirected to login
- **Login:** Credentials verified → Session created → UI updated
- **Forgot Password:** Email sent with reset link → User clicks link → New password set
- **Dashboard:** Protected page only accessible to logged-in users

### 3. Session Management
- PHP sessions track logged-in users
- JavaScript checks authentication status on page load
- Login button transforms to user menu when authenticated

## Testing the System

### 1. Registration Test
1. Click "Login" button
2. Switch to "Register" tab
3. Fill in: username, email, password, confirm password
4. Submit form
5. Should show success message and switch to login tab

### 2. Login Test
1. Use registered credentials
2. Should redirect to dashboard or reload page with user menu

### 3. Forgot Password Test
1. Switch to "Forgot Password" tab
2. Enter registered email
3. Check email for reset link
4. Click link to set new password

### 4. Dashboard Access
- Visit `dashboard.php` - should redirect to login if not authenticated
- Login first, then visit dashboard - should show user dashboard

## Customization

### Styling
All authentication styles are in `modal-auth.css`. You can customize:
- Colors and gradients
- Animation effects
- Modal dimensions
- Form styling

### Functionality
Modify `modal-auth.js` to:
- Change redirect behavior after login
- Add additional form validation
- Customize success/error messages
- Add new features to user menu

### Database
The `users` table includes these fields:
- `id` - Primary key
- `username` - User's display name
- `email` - User's email (unique)
- `password` - Hashed password
- `reset_token` - For password resets
- `reset_expiry` - Token expiration time
- `created_at` - Account creation time
- `updated_at` - Last update time

## Security Features

### Password Security
- Passwords hashed using PHP's `password_hash()`
- Minimum 8 characters required
- Must contain letters and numbers
- Client and server-side validation

### Session Security
- Session ID regenerated on login
- Sessions properly destroyed on logout
- Protected pages check authentication

### Input Validation
- All inputs sanitized and validated
- Email format validation
- SQL injection protection via prepared statements
- XSS protection via HTML encoding

### Password Reset Security
- Reset tokens are cryptographically secure
- Tokens expire after 1 hour
- Tokens are single-use and cleared after reset

## Troubleshooting

### Common Issues

1. **Modal doesn't appear enhanced**
   - Check browser console for JavaScript errors
   - Ensure `modal-auth.js` is loaded after the DOM
   - Verify modal ID is `loginModal`

2. **Forms don't submit**
   - Check that PHP files are accessible
   - Verify database connection in `config.php`
   - Check browser network tab for AJAX errors

3. **Email not sending**
   - Verify email configuration in `config.php`
   - Check server's mail function capability
   - Consider using SMTP instead of PHP's mail()

4. **Database connection fails**
   - Check database credentials in `config.php`
   - Ensure database exists and user has permissions
   - Verify MySQL service is running

### Debugging Tips

1. **Enable PHP error logging:**
```php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

2. **Check browser console** for JavaScript errors

3. **Check server error logs** for PHP errors

4. **Use browser developer tools** to inspect AJAX requests

## File Structure
```
your-website/
├── index.html (your existing file)
├── about.html (your existing file)
├── episodes.html (your existing file)
├── config.php
├── register.php
├── login.php
├── forgot_password.php
├── reset_password.php
├── check_auth.php
├── logout.php
├── dashboard.php
├── modal-auth.js
├── modal-auth.css
└── database.sql
```

## Next Steps

After integration:
1. Test all authentication flows
2. Customize styling to match your brand
3. Add additional user features to dashboard
4. Consider adding user profile management
5. Implement user roles/permissions if needed

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify all files are in the correct location
3. Ensure database is properly configured
4. Test with browser developer tools open