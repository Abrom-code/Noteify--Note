<?php
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

$data = json_decode(file_get_contents('php://input'), true);
$id   = intval($data['id'] ?? 0);

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'id is required']);
    exit;
}

$stmt = $conn->prepare('DELETE FROM notes WHERE id = ? AND user_id = ?');
$stmt->bind_param('is', $id, $user_id);
$stmt->execute();

if ($stmt->affected_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Note not found or access denied']);
    $stmt->close();
    $conn->close();
    exit;
}

$stmt->close();
$conn->close();

echo json_encode(['success' => true, 'message' => 'Note deleted']);
