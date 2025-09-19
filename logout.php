<?php
/**
 * User Logout Handler
 * 
 * Destroys user session and redirects to home page
 */

require_once 'config.php';

startSession();

// Log the logout action
if (isset($_SESSION['username'])) {
    error_log("User logged out: " . $_SESSION['username']);
}

// Destroy all session data
session_unset();
session_destroy();

// Clear session cookie
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 42000, '/');
}

// Redirect to home page
header('Location: index.html');
exit();
?>