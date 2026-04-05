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

$data  = json_decode(file_get_contents('php://input'), true);
$id    = intval($data['id']    ?? 0);
$title = trim($data['title']   ?? '');
$body  = trim($data['body']    ?? '');
$tags  = $data['tags'] ?? [];

if (!$id || empty($title) || empty($body)) {
    http_response_code(400);
    echo json_encode(['error' => 'id, title, and body are required']);
    exit;
}

$tags_json = json_encode(array_values(array_unique($tags)));

$stmt = $conn->prepare(
    'UPDATE notes SET title = ?, body = ?, tags = ?, updated_at = NOW()
     WHERE id = ? AND user_id = ?'
);
$stmt->bind_param('sssis', $title, $body, $tags_json, $id, $user_id);
$stmt->execute();

if ($stmt->affected_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Note not found or access denied']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

$stmt = $conn->prepare(
    'SELECT id, user_id, title, body, tags, created_at, updated_at FROM notes WHERE id = ?'
);
$stmt->bind_param('i', $id);
$stmt->execute();
$note         = $stmt->get_result()->fetch_assoc();
$note['tags'] = json_decode($note['tags']) ?? [];

$stmt->close();
$conn->close();

echo json_encode(['success' => true, 'note' => $note]);
