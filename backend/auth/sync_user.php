<?php
/**
 * POST /backend/auth/sync_user.php
 * Called by the frontend right after a successful Firebase login.
 * Upserts the user in MySQL and returns a session token.
 *
 * Body: { firebase_uid, name, email, photo_url, provider }
 * Returns: { success, token, expires_at, user }
 */
require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$firebase_uid = trim($data['firebase_uid'] ?? '');
$name         = trim($data['name']         ?? '');
$email        = trim($data['email']        ?? '');
$photo_url    = trim($data['photo_url']    ?? '');
$provider     = trim($data['provider']     ?? 'email');

if (empty($firebase_uid) || empty($email)) {
    http_response_code(400);
    echo json_encode(['error' => 'firebase_uid and email are required']);
    exit;
}

$conn = getConnection();

// Upsert user
$stmt = $conn->prepare(
    'INSERT INTO users (firebase_uid, name, email, photo_url, provider)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
         name      = VALUES(name),
         email     = VALUES(email),
         photo_url = VALUES(photo_url),
         provider  = VALUES(provider),
         updated_at = NOW()'
);
$stmt->bind_param('sssss', $firebase_uid, $name, $email, $photo_url, $provider);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to sync user']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Clean up expired sessions for this user
$conn->query("DELETE FROM sessions WHERE expires_at < NOW()");

// Create a new session token (valid 7 days)
$token      = bin2hex(random_bytes(32));
$expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));

$stmt = $conn->prepare(
    'INSERT INTO sessions (firebase_uid, token, expires_at) VALUES (?, ?, ?)'
);
$stmt->bind_param('sss', $firebase_uid, $token, $expires_at);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create session']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Fetch the user row to return
$stmt = $conn->prepare(
    'SELECT firebase_uid, name, email, photo_url, provider, created_at FROM users WHERE firebase_uid = ?'
);
$stmt->bind_param('s', $firebase_uid);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();
$conn->close();

echo json_encode([
    'success'    => true,
    'token'      => $token,
    'expires_at' => $expires_at,
    'user'       => $user
]);
