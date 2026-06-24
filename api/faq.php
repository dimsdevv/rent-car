<?php
/**
 * FAQ API
 * GET /api/faq.php         -> List active FAQs (ordered)
 * GET /api/faq.php?id=1    -> Get single FAQ
 *
 * N+1 Prevention: Single table, no JOIN needed
 * Caching: 10-minute TTL (rarely changes)
 * Indexes: idx_active_sort
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cache.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method tidak diizinkan', 405);
}

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

// ─── Single FAQ ──────────────────────────────────────────────
if ($id > 0) {
    $item = cacheRemember("faq_{$id}", 600, function () use ($id) {
        return fetchOne(
            "SELECT * FROM faq WHERE id = :id AND is_active = 1",
            [':id' => $id]
        );
    });

    if (!$item) {
        jsonError('FAQ tidak ditemukan', 404);
    }

    jsonSuccess($item);
}

// ─── List FAQs ───────────────────────────────────────────────
// FAQ is typically small dataset, return all active (still cached)
$page    = max(1, (int) ($_GET['page'] ?? 1));
$perPage = max(1, min(100, (int) ($_GET['per_page'] ?? 50)));

$cacheKey = "faq_p{$page}_pp{$perPage}";

$result = cacheRemember($cacheKey, 600, function () use ($page, $perPage) {
    return paginatedQuery(
        "SELECT * FROM faq WHERE is_active = 1 ORDER BY sort_order ASC, id ASC",
        "SELECT COUNT(*) FROM faq WHERE is_active = 1",
        [],
        $page,
        $perPage
    );
});

// Cast types
foreach ($result['data'] as &$item) {
    $item['is_active'] = (bool) $item['is_active'];
    $item['sort_order'] = (int) $item['sort_order'];
}
unset($item);

jsonSuccess($result);
