<?php
/**
 * POST /backend/auth/logout.php
 * Body: { token }
 */
require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data  = json_decode(file_get_contents('php://input'), true);
$token = trim($data['token'] ?? '');

if (empty($token)) {
    http_response_code(400);
    echo json_encode(['error' => 'token is required']);
    exit;
}

$conn = getConnection();
$stmt = $conn->prepare('DELETE FROM sessions WHERE token = ?');
$stmt->bind_param('s', $token);
$stmt->execute();
$stmt->close();
$conn->close();

echo json_encode(['success' => true]);
