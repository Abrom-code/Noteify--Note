<?php
/**
 * POST /backend/auth/login.php
 * Body: { email, password }
 * Returns: { success, token, expires_at, user }
 */
require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data     = json_decode(file_get_contents('php://input'), true) ?? [];
$email    = trim($data['email']    ?? '');
$password = trim($data['password'] ?? '');

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'email and password are required']);
    exit;
}

$conn = getConnection();

$stmt = $conn->prepare('SELECT id, name, email, password, avatar FROM users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid email or password']);
    $conn->close();
    exit;
}

// Clean up old sessions
$conn->query("DELETE FROM sessions WHERE expires_at < NOW()");

$token      = bin2hex(random_bytes(32));
$expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));

$stmt = $conn->prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)');
$stmt->bind_param('iss', $user['id'], $token, $expires_at);
$stmt->execute();
$stmt->close();
$conn->close();

echo json_encode([
    'success'    => true,
    'token'      => $token,
    'expires_at' => $expires_at,
    'user'       => ['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email'], 'avatar' => $user['avatar']]
]);
