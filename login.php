<?php
/**
 * User Login Handler
 * 
 * Handles user authentication and session management
 */

require_once 'config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, 'Invalid request method.');
}

try {
    // Get and sanitize input data
    $email = sanitizeInput($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    // Validation
    if (empty($email) || empty($password)) {
        sendJsonResponse(false, 'Email and password are required.');
    }
    
    if (!isValidEmail($email)) {
        sendJsonResponse(false, 'Please enter a valid email address.');
    }
    
    // Database connection
    $pdo = getDBConnection();
    
    // Find user by email
    $stmt = $pdo->prepare("
        SELECT id, username, email, password 
        FROM users 
        WHERE email = ?
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    // Check if user exists and password is correct
    if (!$user || !password_verify($password, $user['password'])) {
        // Log failed login attempt
        error_log("Failed login attempt for email: $email from IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
        
        sendJsonResponse(false, 'Invalid email or password.');
    }
    
    // Start session and store user data
    startSession();
    
    // Regenerate session ID for security
    session_regenerate_id(true);
    
    // Store user information in session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['login_time'] = time();
    
    // Update last login time (optional)
    $stmt = $pdo->prepare("UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?");
    $stmt->execute([$user['id']]);
    
    // Log successful login
    error_log("Successful login for user: {$user['username']} ({$user['email']})");
    
    sendJsonResponse(true, 'Login successful! Redirecting...');
    
} catch (Exception $e) {
    // Log the error
    error_log("Login error: " . $e->getMessage());
    
    // Send generic error message to user
    sendJsonResponse(false, 'An error occurred during login. Please try again.');
}
?>