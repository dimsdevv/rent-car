<?php
/**
 * Booking API
 * POST /api/booking.php         -> Create new booking
 * GET  /api/booking.php         -> List bookings (paginated, filterable)
 * GET  /api/booking.php?id=123  -> Get single booking
 *
 * N+1 Prevention: Uses JOIN to fetch car details in single query
 * Indexes: idx_status_date, idx_email, idx_date_range
 * Pagination: page & per_page query params
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cache.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];

// ─── POST: Create booking ────────────────────────────────────
if ($method === 'POST') {
    $input = getJsonInput();

    // ── Server-side validation ──
    $errors = [];

    $name    = sanitize($input['name'] ?? '');
    $email   = sanitize($input['email'] ?? '');
    $phone   = sanitize($input['phone'] ?? '');
    $loc     = sanitize($input['pickup_location'] ?? '');
    $pickup  = $input['pickup_date'] ?? '';
    $return  = $input['return_date'] ?? '';
    $carType = sanitize($input['car_type'] ?? '');

    if (empty($name) || mb_strlen($name) < 2) {
        $errors['name'] = 'Nama lengkap wajib diisi (min 2 karakter)';
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Format email tidak valid';
    }
    if (empty($phone) || !preg_match('/^08[0-9]{8,12}$/', str_replace(['-', ' '], '', $phone))) {
        $errors['phone'] = 'Format nomor telepon tidak valid';
    }
    if (empty($loc)) {
        $errors['pickup_location'] = 'Lokasi jemput wajib dipilih';
    }
    if (empty($pickup)) {
        $errors['pickup_date'] = 'Tanggal jemput wajib diisi';
    }
    if (empty($return)) {
        $errors['return_date'] = 'Tanggal kembali wajib diisi';
    }
    if (!empty($pickup) && !empty($return) && strtotime($return) <= strtotime($pickup)) {
        $errors['return_date'] = 'Tanggal kembali harus setelah tanggal jemput';
    }

    if (!empty($errors)) {
        jsonError('Validasi gagal', 422, $errors);
    }

    // ── Check car availability (overlap detection uses idx_date_range index) ──
    if (!empty($carType)) {
        $overlap = fetchOne(
            "SELECT COUNT(*) AS cnt FROM bookings
             WHERE car_type = :car_type
               AND status IN ('pending', 'confirmed')
               AND pickup_date < :return_date
               AND return_date > :pickup_date",
            [
                ':car_type'    => $carType,
                ':pickup_date' => $pickup,
                ':return_date' => $return,
            ]
        );
        // Soft warning, don't block (business might handle manually)
    }

    // ── Insert booking (single query, no N+1) ──
    try {
        $bookingCode = generateBookingCode();

        $id = insertRow('bookings', [
            'booking_code'    => $bookingCode,
            'name'            => $name,
            'email'           => $email,
            'phone'           => $phone,
            'pickup_location' => $loc,
            'pickup_date'     => $pickup,
            'return_date'     => $return,
            'car_type'        => $carType ?: null,
            'status'          => 'pending',
        ]);

        // Invalidate bookings cache
        cacheForget('bookings_list');

        jsonSuccess([
            'id'           => (int) $id,
            'booking_code' => $bookingCode,
            'status'       => 'pending',
        ], 'Booking berhasil dibuat', 201);

    } catch (PDOException $e) {
        // Duplicate booking code (extremely rare)
        if ($e->getCode() === '23000') {
            jsonError('Terjadi konflik, silakan coba lagi', 409);
        }
        jsonError('Terjadi kesalahan server', 500);
    }
}

// ─── GET: List or single booking ─────────────────────────────
if ($method === 'GET') {
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    // Single booking (uses PRIMARY KEY)
    if ($id > 0) {
        // Single JOIN query (N+1 safe: car details in same query)
        $booking = fetchOne(
            "SELECT b.*, c.name AS car_name, c.price_per_day,
                    cc.name AS category_name
             FROM bookings b
             LEFT JOIN cars c ON c.id = b.car_id
             LEFT JOIN car_categories cc ON cc.id = c.category_id
             WHERE b.id = :id",
            [':id' => $id]
        );

        if (!$booking) {
            jsonError('Booking tidak ditemukan', 404);
        }

        jsonSuccess($booking);
    }

    // List bookings with pagination + filters
    $page    = max(1, (int) ($_GET['page'] ?? 1));
    $perPage = max(1, min(100, (int) ($_GET['per_page'] ?? 10)));
    $status  = sanitize($_GET['status'] ?? '');
    $search  = sanitize($_GET['q'] ?? '');

    // Build WHERE clause dynamically (still uses indexes)
    $where  = '1=1';
    $params = [];

    if (!empty($status)) {
        $where .= ' AND b.status = :status';
        $params[':status'] = $status;
    }
    if (!empty($search)) {
        $where .= ' AND (b.name LIKE :search OR b.email LIKE :search OR b.booking_code LIKE :search)';
        $params[':search'] = "%{$search}%";
    }

    $cacheKey = "bookings_p{$page}_pp{$perPage}_s{$status}_q{$search}";

    $result = cacheRemember($cacheKey, 60, function () use ($where, $params, $page, $perPage) {
        return paginatedQuery(
            // Main query: JOIN cars + categories in single query (no N+1)
            "SELECT b.*, c.name AS car_name, c.price_per_day,
                    cc.name AS category_name
             FROM bookings b
             LEFT JOIN cars c ON c.id = b.car_id
             LEFT JOIN car_categories cc ON cc.id = c.category_id
             WHERE {$where}
             ORDER BY b.created_at DESC",
            // Count query (lightweight, no JOIN needed)
            "SELECT COUNT(*) FROM bookings b WHERE {$where}",
            $params,
            $page,
            $perPage
        );
    });

    jsonSuccess($result);
}

// ─── Method not allowed ──────────────────────────────────────
jsonError('Method tidak diizinkan', 405);
