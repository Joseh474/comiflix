<?php
/**
 * Forgot Password Handler
 * 
 * Generates and sends password reset links
 */

require_once 'config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, 'Invalid request method.');
}

try {
    // Get and sanitize input data
    $email = sanitizeInput($_POST['email'] ?? '');
    
    // Validation
    if (empty($email)) {
        sendJsonResponse(false, 'Email is required.');
    }
    
    if (!isValidEmail($email)) {
        sendJsonResponse(false, 'Please enter a valid email address.');
    }
    
    // Database connection
    $pdo = getDBConnection();
    
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id, username FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    // Always send success message for security (don't reveal if email exists)
    // But only actually send email if user exists
    if ($user) {
        // Generate reset token
        $resetToken = generateToken(32);
        $resetExpiry = date('Y-m-d H:i:s', strtotime('+1 hour'));
        
        // Store reset token in database
        $stmt = $pdo->prepare("
            UPDATE users 
            SET reset_token = ?, reset_expiry = ? 
            WHERE id = ?
        ");
        $stmt->execute([$resetToken, $resetExpiry, $user['id']]);
        
        // Create reset link
        $resetLink = SITE_URL . "/reset_password.php?token=" . $resetToken;
        
        // Email content
        $subject = "Password Reset Request - " . SITE_NAME;
        $message = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(45deg, #00d4ff, #ff6b35); padding: 20px; text-align: center; }
                .header h1 { color: white; margin: 0; font-family: 'Orbitron', monospace; }
                .content { padding: 30px; background: #f9f9f9; }
                .button { display: inline-block; background: linear-gradient(45deg, #00d4ff, #ff6b35); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Comiflix</h1>
                </div>
                <div class='content'>
                    <h2>Password Reset Request</h2>
                    <p>Hello {$user['username']},</p>
                    <p>We received a request to reset your password for your Comiflix account.</p>
                    <p>Click the button below to reset your password:</p>
                    <a href='$resetLink' class='button'>Reset Password</a>
                    <p>Or copy and paste this link into your browser:</p>
                    <p><a href='$resetLink'>$resetLink</a></p>
                    <p><strong>This link will expire in 1 hour.</strong></p>
                    <p>If you didn't request this password reset, please ignore this email.</p>
                    <p>Best regards,<br>The Comiflix Team</p>
                </div>
                <div class='footer'>
                    <p>&copy; 2025 Comiflix. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        // Email headers
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: ' . FROM_NAME . ' <' . FROM_EMAIL . '>',
            'Reply-To: ' . FROM_EMAIL,
            'X-Mailer: PHP/' . phpversion()
        ];
        
        // Send email
        if (mail($email, $subject, $message, implode("\r\n", $headers))) {
            error_log("Password reset email sent to: $email");
        } else {
            error_log("Failed to send password reset email to: $email");
        }
    }
    
    // Always send success response (security measure)
    sendJsonResponse(true, 'If an account with this email exists, a password reset link has been sent.');
    
} catch (Exception $e) {
    // Log the error
    error_log("Forgot password error: " . $e->getMessage());
    
    // Send generic error message to user
    sendJsonResponse(false, 'An error occurred. Please try again later.');
}
?>