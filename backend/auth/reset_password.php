<?php
/**
 * POST /backend/auth/reset_password.php
 * Body: { token, password }
 */
require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data     = json_decode(file_get_contents('php://input'), true);
$token    = trim($data['token']    ?? '');
$password = trim($data['password'] ?? '');

if (empty($token) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'token and password are required']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be at least 6 characters']);
    exit;
}

$conn = getConnection();

$stmt = $conn->prepare(
    'SELECT email FROM password_resets WHERE token = ? AND expires_at > NOW()'
);
$stmt->bind_param('s', $token);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$row) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid or expired reset token']);
    $conn->close();
    exit;
}

$email = $row['email'];
$hash  = password_hash($password, PASSWORD_BCRYPT);

$stmt = $conn->prepare('UPDATE users SET password = ? WHERE email = ?');
$stmt->bind_param('ss', $hash, $email);
$stmt->execute();
$stmt->close();

// Delete used token
$stmt = $conn->prepare('DELETE FROM password_resets WHERE token = ?');
$stmt->bind_param('s', $token);
$stmt->execute();
$stmt->close();
$conn->close();

echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
