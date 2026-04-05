<?php
/**
 * POST /backend/auth/register.php
 * Body: { name, email, password }
 * Returns: { success, token, expires_at, user }
 */
require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data     = json_decode(file_get_contents('php://input'), true);
$name     = trim($data['name']     ?? '');
$email    = trim($data['email']    ?? '');
$password = trim($data['password'] ?? '');

if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'name, email and password are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be at least 6 characters']);
    exit;
}

$conn = getConnection();

// Check duplicate email
$stmt = $conn->prepare('SELECT id FROM users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'Email already registered']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $conn->prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
$stmt->bind_param('sss', $name, $email, $hash);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Registration failed']);
    $stmt->close();
    $conn->close();
    exit;
}

$user_id = $stmt->insert_id;
$stmt->close();

// Create session
$token      = bin2hex(random_bytes(32));
$expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));

$stmt = $conn->prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)');
$stmt->bind_param('iss', $user_id, $token, $expires_at);
$stmt->execute();
$stmt->close();
$conn->close();

http_response_code(201);
echo json_encode([
    'success'    => true,
    'token'      => $token,
    'expires_at' => $expires_at,
    'user'       => ['id' => $user_id, 'name' => $name, 'email' => $email]
]);
