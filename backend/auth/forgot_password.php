<?php
/**
 * POST /backend/auth/forgot_password.php
 * Body: { email }
 * Returns a reset token (in production you'd email this; here we return it directly for simplicity)
 */
require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data  = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid email is required']);
    exit;
}

$conn = getConnection();

$stmt = $conn->prepare('SELECT id FROM users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
$exists = $stmt->num_rows > 0;
$stmt->close();

// Always return success to prevent email enumeration
if (!$exists) {
    $conn->close();
    echo json_encode(['success' => true, 'message' => 'If that email exists, a reset link has been sent.']);
    exit;
}

// Delete old tokens for this email
$stmt = $conn->prepare('DELETE FROM password_resets WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->close();

$token      = bin2hex(random_bytes(32));
$expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));

$stmt = $conn->prepare('INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)');
$stmt->bind_param('sss', $email, $token, $expires_at);
$stmt->execute();
$stmt->close();
$conn->close();

// In production: send $token via email with a reset link
// For development: return the token directly so you can test
echo json_encode([
    'success' => true,
    'message' => 'Reset token generated.',
    'reset_token' => $token   // remove this line in production
]);
