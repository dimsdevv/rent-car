<?php
/**
 * User Booking History API
 * GET /api/bookings/history - requires JWT auth
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$action = str_replace(['/api/bookings.php', '/api/bookings'], '', $uri) ?: '/';

// ─── POST /api/bookings/pay ──────────────────────────────────
if ($method === 'POST' && $action === '/pay') {
    $userId = requireAuth();
    $input = getJsonInput();
    
    $bookingId = $input['booking_id'] ?? null;
    // Bisa berupa ID atau booking_code
    if (!$bookingId) {
         jsonError('Booking ID atau Kode Booking wajib disertakan', 400);
    }

    // Ambil data booking milik user ini (cari berdasarkan ID atau booking_code)
    $booking = fetchOne("SELECT id, status FROM bookings WHERE (id = :bid OR booking_code = :bcode) AND user_id = :uid", [
        ':bid' => $bookingId,
        ':bcode' => $bookingId,
        ':uid' => $userId
    ]);

    if (!$booking) {
        jsonError('Booking tidak ditemukan atau bukan milik Anda', 404);
    }
    
    if ($booking['status'] !== 'pending') {
        jsonError('Booking tidak dapat dibayar karena status: ' . $booking['status'], 400);
    }
    
    // Smart logic: otomatis konfirmasi pembayaran
    execute("UPDATE bookings SET status = 'confirmed', updated_at = NOW() WHERE id = :id", [
        ':id' => $booking['id']
    ]);
    
    jsonSuccess(['id' => $booking['id'], 'status' => 'confirmed'], 'Pembayaran berhasil dikonfirmasi secara otomatis via Smart Pay');
}

// ─── GET /api/bookings/history ───────────────────────────────
if ($method === 'GET' && $action === '/history') {
    $userId = requireAuth();

    $page    = max(1, (int)($_GET['page'] ?? 1));
    $perPage = max(1, min(50, (int)($_GET['per_page'] ?? 10)));

    $sql = "SELECT b.*, c.name AS car_name, c.image_url AS car_image,
                   cc.name AS category_name, c.price_per_day
            FROM bookings b
            LEFT JOIN cars c ON b.car_id = c.id
            LEFT JOIN car_categories cc ON c.category_id = cc.id
            WHERE b.user_id = :user_id
            ORDER BY b.created_at DESC";

    $countSql = "SELECT COUNT(*) FROM bookings WHERE user_id = :user_id";

    $result = paginatedQuery($sql, $countSql, [':user_id' => $userId], $page, $perPage);
    jsonSuccess($result);
}

// ─── Fallback ────────────────────────────────────────────────
jsonError('Bookings endpoint tidak ditemukan', 404);
