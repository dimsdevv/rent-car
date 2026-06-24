<?php
/**
 * Simple file-based cache
 * - Avoids repeated DB hits for read-heavy endpoints (cars, testimonials, FAQ)
 * - TTL-based expiration
 * - Cache directory: api/cache/
 */

define('CACHE_DIR', __DIR__ . '/cache');
define('CACHE_DEFAULT_TTL', 300); // 5 minutes

function cacheGet(string $key): mixed {
    $file = cachePath($key);

    if (!file_exists($file)) {
        return null;
    }

    $raw = file_get_contents($file);
    $item = @unserialize($raw, ['allowed_classes' => false]);

    if (!$item || !isset($item['expires'], $item['data'])) {
        @unlink($file);
        return null;
    }

    // Expired?
    if (time() > $item['expires']) {
        @unlink($file);
        return null;
    }

    return $item['data'];
}

function cacheSet(string $key, mixed $data, int $ttl = CACHE_DEFAULT_TTL): void {
    $dir = CACHE_DIR;
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
        // Create .htaccess to prevent direct access
        file_put_contents($dir . '/.htaccess', "Deny from all\n");
        file_put_contents($dir . '/index.html', '');
    }

    $item = [
        'expires' => time() + $ttl,
        'data'    => $data,
    ];

    file_put_contents(cachePath($key), serialize($item), LOCK_EX);
}

function cacheForget(string $key): void {
    $file = cachePath($key);
    if (file_exists($file)) {
        @unlink($file);
    }
}

function cacheFlush(): void {
    $dir = CACHE_DIR;
    if (!is_dir($dir)) return;

    $files = glob($dir . '/*.cache');
    foreach ($files as $f) {
        @unlink($f);
    }
}

function cachePath(string $key): string {
    // Sanitize key to prevent path traversal
    $safe = preg_replace('/[^a-zA-Z0-9_.\-]/', '_', $key);
    return CACHE_DIR . '/' . $safe . '.cache';
}

/**
 * Cache-aside pattern: try cache first, fallback to callback.
 * Usage: $data = cacheRemember('cars_list', 300, fn() => fetchAll(...));
 */
function cacheRemember(string $key, int $ttl, callable $callback): mixed {
    $cached = cacheGet($key);
    if ($cached !== null) {
        return $cached;
    }

    $data = $callback();
    cacheSet($key, $data, $ttl);
    return $data;
}
