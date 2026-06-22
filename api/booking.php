<?php
/**
 * Booking API endpoint
 * POST /api/booking.php
 *
 * Accepts JSON booking form data, validates, and inserts into database.
 */

// CORS headers for Vite dev server
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/db.php';

// Parse JSON body
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => true, 'message' => 'Invalid JSON payload']);
    exit;
}

// Validate required fields
$required = ['name', 'email', 'phone', 'pickup_location', 'pickup_date', 'return_date'];
$missing = [];

foreach ($required as $field) {
    if (empty(trim($input[$field] ?? ''))) {
        $missing[] = $field;
    }
}

if (!empty($missing)) {
    http_response_code(422);
    echo json_encode([
        'error'   => true,
        'message' => 'Field berikut wajib diisi: ' . implode(', ', $missing),
    ]);
    exit;
}

// Validate email format
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['error' => true, 'message' => 'Format email tidak valid']);
    exit;
}

// Validate dates
$pickupDate = strtotime($input['pickup_date']);
$returnDate = strtotime($input['return_date']);

if (!$pickupDate || !$returnDate) {
    http_response_code(422);
    echo json_encode(['error' => true, 'message' => 'Format tanggal tidak valid']);
    exit;
}

if ($returnDate <= $pickupDate) {
    http_response_code(422);
    echo json_encode(['error' => true, 'message' => 'Tanggal pengembalian harus setelah tanggal penjemputan']);
    exit;
}

// Sanitize inputs
$name             = trim($input['name']);
$email            = trim($input['email']);
$phone            = preg_replace('/[^0-9+\-\s]/', '', $input['phone']);
$pickup_location  = trim($input['pickup_location']);
$pickup_date      = $input['pickup_date'];
$return_date      = $input['return_date'];
$car_type         = trim($input['car_type'] ?? '');

try {
    $db = getDB();

    $stmt = $db->prepare(
        'INSERT INTO bookings (name, email, phone, pickup_location, pickup_date, return_date, car_type, created_at)
         VALUES (:name, :email, :phone, :pickup_location, :pickup_date, :return_date, :car_type, :created_at)'
    );

    $stmt->execute([
        ':name'            => $name,
        ':email'           => $email,
        ':phone'           => $phone,
        ':pickup_location' => $pickup_location,
        ':pickup_date'     => $pickup_date,
        ':return_date'     => $return_date,
        ':car_type'        => $car_type ?: null,
        ':created_at'      => date('Y-m-d H:i:s'),
    ]);

    $bookingId = $db->lastInsertId();

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Booking berhasil dibuat',
        'data'    => [
            'id' => (int) $bookingId,
        ],
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error'   => true,
        'message' => 'Terjadi kesalahan server. Silakan coba lagi.',
    ]);
    // Log error (don't expose to client)
    error_log('Booking DB Error: ' . $e->getMessage());
}
