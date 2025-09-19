<?php
/**
 * Check Authentication Status
 * 
 * Returns JSON response with user's authentication status
 */

require_once 'config.php';

startSession();

$response = [
    'loggedIn' => false,
    'user' => null
];

if (isLoggedIn()) {
    $response['loggedIn'] = true;
    $response['user'] = [
        'id' => $_SESSION['user_id'],
        'username' => $_SESSION['username'],
        'email' => $_SESSION['email'],
        'loginTime' => $_SESSION['login_time'] ?? time()
    ];
}

header('Content-Type: application/json');
echo json_encode($response);
?>