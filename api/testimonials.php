<?php
/**
 * Testimonials API
 * GET /api/testimonials.php              -> List active testimonials (paginated)
 * GET /api/testimonials.php?id=1         -> Get single testimonial
 * GET /api/testimonials.php?featured=1   -> Featured only
 *
 * N+1 Prevention: No JOIN needed (single table)
 * Caching: 10-minute TTL (rarely changes)
 * Indexes: idx_active_featured, idx_active_sort
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cache.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method tidak diizinkan', 405);
}

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

// ─── Single testimonial ──────────────────────────────────────
if ($id > 0) {
    $item = cacheRemember("testimonial_{$id}", 600, function () use ($id) {
        return fetchOne(
            "SELECT * FROM testimonials WHERE id = :id AND is_active = 1",
            [':id' => $id]
        );
    });

    if (!$item) {
        jsonError('Testimonial tidak ditemukan', 404);
    }

    $item['rating'] = (int) $item['rating'];
    jsonSuccess($item);
}

// ─── List testimonials ───────────────────────────────────────
$page     = max(1, (int) ($_GET['page'] ?? 1));
$perPage  = max(1, min(50, (int) ($_GET['per_page'] ?? 10)));
$featured = isset($_GET['featured']) ? (int) $_GET['featured'] : null;

$where  = 'is_active = 1';
$params = [];

if ($featured !== null) {
    $where .= ' AND is_featured = :featured';
    $params[':featured'] = $featured;
}

$cacheKey = "testimonials_p{$page}_pp{$perPage}_feat{$featured}";

$result = cacheRemember($cacheKey, 600, function () use ($where, $params, $page, $perPage) {
    return paginatedQuery(
        "SELECT * FROM testimonials
         WHERE {$where}
         ORDER BY sort_order ASC, created_at DESC",
        "SELECT COUNT(*) FROM testimonials WHERE {$where}",
        $params,
        $page,
        $perPage
    );
});

// Cast types
foreach ($result['data'] as &$item) {
    $item['rating'] = (int) $item['rating'];
    $item['is_featured'] = (bool) $item['is_featured'];
}
unset($item);

jsonSuccess($result);
