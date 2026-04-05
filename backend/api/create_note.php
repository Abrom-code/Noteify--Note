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
$title = trim($data['title'] ?? '');
$body  = trim($data['body']  ?? '');
$tags  = $data['tags'] ?? [];

if (empty($title) || empty($body)) {
    http_response_code(400);
    echo json_encode(['error' => 'title and body are required']);
    exit;
}

$tags_json = json_encode(array_values(array_unique($tags)));

$stmt = $conn->prepare(
    'INSERT INTO notes (user_id, title, body, tags) VALUES (?, ?, ?, ?)'
);
$stmt->bind_param('ssss', $user_id, $title, $body, $tags_json);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create note']);
    $stmt->close();
    $conn->close();
    exit;
}

$new_id = $stmt->insert_id;
$stmt->close();

$stmt = $conn->prepare(
    'SELECT id, user_id, title, body, tags, created_at, updated_at FROM notes WHERE id = ?'
);
$stmt->bind_param('i', $new_id);
$stmt->execute();
$note         = $stmt->get_result()->fetch_assoc();
$note['tags'] = json_decode($note['tags']) ?? [];

$stmt->close();
$conn->close();

http_response_code(201);
echo json_encode(['success' => true, 'note' => $note]);
