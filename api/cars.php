<?php
/**
 * Cars API (Fleet)
 * GET /api/cars.php              -> List active cars (paginated, with category JOIN)
 * GET /api/cars.php?id=1         -> Get single car
 * GET /api/cars.php?featured=1   -> Featured cars only
 * GET /api/cars.php?category=mpv -> Filter by category slug
 *
 * N+1 Prevention: Single query JOINs cars + car_categories
 * Caching: 5-minute TTL for list queries
 * Indexes: idx_active_featured, idx_category_active, idx_price
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cache.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method tidak diizinkan', 405);
}

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

// ─── Single car ──────────────────────────────────────────────
if ($id > 0) {
    $car = cacheRemember("car_{$id}", 300, function () use ($id) {
        return fetchOne(
            "SELECT c.*,
                    cc.slug AS category_slug,
                    cc.name AS category_name
             FROM cars c
             INNER JOIN car_categories cc ON cc.id = c.category_id
             WHERE c.id = :id AND c.is_active = 1",
            [':id' => $id]
        );
    });

    if (!$car) {
        jsonError('Mobil tidak ditemukan', 404);
    }

    // Format price for frontend
    $car['price_per_day'] = (int) $car['price_per_day'];
    $car['price_formatted'] = 'Rp ' . number_format($car['price_per_day'], 0, ',', '.');

    jsonSuccess($car);
}

// ─── List cars (paginated + filters) ────────────────────────
$page     = max(1, (int) ($_GET['page'] ?? 1));
$perPage  = max(1, min(50, (int) ($_GET['per_page'] ?? 12)));
$category = sanitize($_GET['category'] ?? '');
$featured = isset($_GET['featured']) ? (int) $_GET['featured'] : null;
$sortBy   = sanitize($_GET['sort'] ?? 'name');
$search   = sanitize($_GET['q'] ?? '');

// Whitelist sort options
$allowedSorts = ['name', 'price_asc', 'price_desc', 'newest'];
if (!in_array($sortBy, $allowedSorts)) {
    $sortBy = 'name';
}

// Build ORDER BY
$orderMap = [
    'name'       => 'c.name ASC',
    'price_asc'  => 'c.price_per_day ASC',
    'price_desc' => 'c.price_per_day DESC',
    'newest'     => 'c.created_at DESC',
];
$orderBy = $orderMap[$sortBy];

// Build WHERE
$where  = 'c.is_active = 1';
$params = [];

if (!empty($category)) {
    $where .= ' AND cc.slug = :category';
    $params[':category'] = $category;
}
if ($featured !== null) {
    $where .= ' AND c.is_featured = :featured';
    $params[':featured'] = $featured;
}
if (!empty($search)) {
    $where .= ' AND (c.name LIKE :search OR c.description LIKE :search)';
    $params[':search'] = "%{$search}%";
}

$cacheKey = "cars_p{$page}_pp{$perPage}_cat{$category}_feat{$featured}_sort{$sortBy}_q{$search}";

$result = cacheRemember($cacheKey, 300, function () use ($where, $params, $orderBy, $page, $perPage) {
    return paginatedQuery(
        // Single JOIN query: cars + categories (no N+1)
        "SELECT c.*,
                cc.slug AS category_slug,
                cc.name AS category_name
         FROM cars c
         INNER JOIN car_categories cc ON cc.id = c.category_id
         WHERE {$where}
         ORDER BY {$orderBy}",
        // Count query: only counts active cars
        "SELECT COUNT(*) FROM cars c
         INNER JOIN car_categories cc ON cc.id = c.category_id
         WHERE {$where}",
        $params,
        $page,
        $perPage
    );
});

// Format prices for frontend
foreach ($result['data'] as &$car) {
    $car['price_per_day'] = (int) $car['price_per_day'];
    $car['price_formatted'] = 'Rp ' . number_format($car['price_per_day'], 0, ',', '.');
}
unset($car);

// Also include available categories (single query, cached)
$result['categories'] = cacheRemember('car_categories', 600, function () {
    return fetchAll(
        "SELECT slug, name FROM car_categories ORDER BY sort_order ASC"
    );
});

jsonSuccess($result);
