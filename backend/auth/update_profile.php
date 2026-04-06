<?php
/**
 * POST /backend/auth/update_profile.php
 * Body: { name?, email?, password?, avatar? }   (all optional, send only what changed)
 * Returns: { success, user }
 */
require_once '../config/cors.php';
require_once '../config/db.php';
require_once '../auth/verify_token.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$conn    = getConnection();
$user_id = requireAuth($conn);

$data = json_decode(file_get_contents('php://input'), true) ?? [];

$fields = [];
$params = [];
$types  = '';

// Name
if (!empty($data['name'])) {
    $name = trim($data['name']);
    if (strlen($name) < 2) {
        http_response_code(400);
        echo json_encode(['error' => 'Name must be at least 2 characters']);
        exit;
    }
    $fields[] = 'name = ?';
    $params[]  = $name;
    $types    .= 's';
}

// Email
if (!empty($data['email'])) {
    $email = trim($data['email']);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email address']);
        exit;
    }
    // Check not taken by another user
    $chk = $conn->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
    $chk->bind_param('si', $email, $user_id);
    $chk->execute();
    $chk->store_result();
    if ($chk->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already in use']);
        $chk->close();
        $conn->close();
        exit;
    }
    $chk->close();
    $fields[] = 'email = ?';
    $params[]  = $email;
    $types    .= 's';
}

// Password
if (!empty($data['password'])) {
    $pw = $data['password'];
    if (strlen($pw) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'Password must be at least 6 characters']);
        exit;
    }
    $fields[] = 'password = ?';
    $params[]  = password_hash($pw, PASSWORD_BCRYPT);
    $types    .= 's';
}

// Avatar (base64 data URL)
if (array_key_exists('avatar', $data)) {
    $avatar = $data['avatar']; // null to remove, string to set
    if ($avatar !== null && !preg_match('/^data:image\/(jpeg|png|gif|webp);base64,/', $avatar)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid image format']);
        exit;
    }
    $fields[] = 'avatar = ?';
    $params[]  = $avatar;
    $types    .= 's';
}

if (empty($fields)) {
    http_response_code(400);
    echo json_encode(['error' => 'Nothing to update']);
    exit;
}

$params[] = $user_id;
$types   .= 'i';

$sql  = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?';
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Update failed']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Return fresh user data
$stmt = $conn->prepare('SELECT id, name, email, avatar FROM users WHERE id = ?');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();
$conn->close();

// Persist updated user in session storage on client side via response
echo json_encode(['success' => true, 'user' => $user]);
