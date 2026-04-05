<?php
require_once '../config/cors.php';
require_once '../config/db.php';
require_once '../auth/verify_token.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$conn    = getConnection();
$user_id = requireAuth($conn);

$stmt = $conn->prepare(
    'SELECT id, user_id, title, body, tags, created_at, updated_at
     FROM notes WHERE user_id = ? ORDER BY updated_at DESC'
);
$stmt->bind_param('s', $user_id);
$stmt->execute();
$result = $stmt->get_result();

$notes = [];
while ($row = $result->fetch_assoc()) {
    $row['tags'] = json_decode($row['tags']) ?? [];
    $notes[]     = $row;
}

$stmt->close();
$conn->close();

echo json_encode(['success' => true, 'notes' => $notes]);
