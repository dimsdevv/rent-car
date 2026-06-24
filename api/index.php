<?php
/**
 * API Router for PHP built-in server
 * Usage: php -S localhost:8000 api/index.php
 *
 * Routes all /api/* requests to the appropriate handler.
 * Also provides /api/health endpoint for monitoring.
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// ─── Health check ────────────────────────────────────────────
if ($uri === '/api/health' || $uri === '/api') {
    require_once __DIR__ . '/db.php';
    setCorsHeaders();

    $checks = [
        'status'    => 'ok',
        'timestamp' => date('c'),
        'services'  => [],
    ];

    // DB check
    try {
        $db = getDB();
        $db->query('SELECT 1');
        $checks['services']['database'] = 'connected';
    } catch (Exception $e) {
        $checks['status'] = 'degraded';
        $checks['services']['database'] = 'error: ' . $e->getMessage();
    }

    // Cache check
    $cacheDir = __DIR__ . '/cache';
    $checks['services']['cache'] = is_writable($cacheDir) ? 'writable' : 'read-only';

    jsonResponse($checks);
}

// ─── Route API requests ──────────────────────────────────────
$apiRoutes = [
    '/api/auth'         => __DIR__ . '/auth.php',
    '/api/bookings'     => __DIR__ . '/bookings.php',
    '/api/booking'      => __DIR__ . '/booking.php',
    '/api/cars'         => __DIR__ . '/cars.php',
    '/api/testimonials' => __DIR__ . '/testimonials.php',
    '/api/faq'          => __DIR__ . '/faq.php',
    '/api/debug'        => __DIR__ . '/debug.php',
];

foreach ($apiRoutes as $prefix => $file) {
    if (str_starts_with($uri, $prefix)) {
        require $file;
        exit;
    }
}

// ─── Cache flush (admin utility) ─────────────────────────────
if ($uri === '/api/cache/flush' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/db.php';
    require_once __DIR__ . '/cache.php';
    setCorsHeaders();
    cacheFlush();
    jsonSuccess(null, 'Cache flushed');
}

// ─── 404 ─────────────────────────────────────────────────────
require_once __DIR__ . '/db.php';
setCorsHeaders();
jsonError('Endpoint tidak ditemukan: ' . $uri, 404);
