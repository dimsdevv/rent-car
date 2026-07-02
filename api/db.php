<?php
/**
 * Database connection + helper utilities
 * - PDO singleton (no repeated connections)
 * - Prepared statement helpers (N+1 safe)
 * - Standard JSON response
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'jelajahcar');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// ─── PDO Singleton ───────────────────────────────────────────
function getDB(): PDO {
    static $pdo = null;

    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;dbname=%s;charset=%s',
            DB_HOST,
            DB_NAME,
            DB_CHARSET
        );

        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            // Connection timeout 3 seconds
            PDO::ATTR_TIMEOUT            => 3,
        ]);
    }

    return $pdo;
}

// ─── Paginated Query Helper ──────────────────────────────────
// Returns ['data' => [...], 'meta' => ['page','per_page','total','total_pages']]
function paginatedQuery(
    string $sql,
    string $countSql,
    array  $params = [],
    int    $page = 1,
    int    $perPage = 10
): array {
    $db = getDB();

    // Clamp page
    $page = max(1, $page);
    $perPage = max(1, min(100, $perPage));
    $offset = ($page - 1) * $perPage;

    // Count total
    $countStmt = $db->prepare($countSql);
    $countStmt->execute($params);
    $total = (int) $countStmt->fetchColumn();

    // Fetch page
    $stmt = $db->prepare($sql . ' LIMIT :limit OFFSET :offset');
    // Bind named params
    foreach ($params as $key => $val) {
        $paramName = is_int($key) ? $key + 1 : (str_starts_with($key, ':') ? $key : ':' . $key);
        $stmt->bindValue(
            $paramName,
            $val,
            is_int($val) ? PDO::PARAM_INT : (is_bool($val) ? PDO::PARAM_BOOL : PDO::PARAM_STR)
        );
    }
    $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $data = $stmt->fetchAll();

    return [
        'data' => $data,
        'meta' => [
            'page'        => $page,
            'per_page'    => $perPage,
            'total'       => $total,
            'total_pages' => (int) ceil($total / $perPage),
        ],
    ];
}

// ─── Single-row fetch helper ─────────────────────────────────
function fetchOne(string $sql, array $params = []): ?array {
    $stmt = getDB()->prepare($sql);
    $stmt->execute($params);
    $row = $stmt->fetch();
    return $row ?: null;
}

// ─── Multi-row fetch helper ──────────────────────────────────
function fetchAll(string $sql, array $params = []): array {
    $stmt = getDB()->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

// ─── Execute query helper (returns rowCount) ─────────────────
function execute(string $sql, array $params = []): int {
    $stmt = getDB()->prepare($sql);
    $stmt->execute($params);
    return $stmt->rowCount();
}

// ─── Insert helper (returns lastInsertId) ────────────────────
function insertRow(string $table, array $data): string {
    $cols = implode(', ', array_keys($data));
    $placeholders = implode(', ', array_fill(0, count($data), '?'));
    $sql = "INSERT INTO {$table} ({$cols}) VALUES ({$placeholders})";
    $stmt = getDB()->prepare($sql);
    $stmt->execute(array_values($data));
    return getDB()->lastInsertId();
}

// ─── Standard JSON response ──────────────────────────────────
function jsonResponse(mixed $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function jsonError(string $message, int $status = 400, array $errors = []): void {
    $body = ['success' => false, 'message' => $message];
    if (!empty($errors)) {
        $body['errors'] = $errors;
    }
    jsonResponse($body, $status);
}

function jsonSuccess(mixed $data, string $message = 'OK', int $status = 200): void {
    jsonResponse(['success' => true, 'message' => $message, 'data' => $data], $status);
}

// ─── Input helpers ───────────────────────────────────────────
function getJsonInput(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function sanitize(string $value): string {
    return trim(htmlspecialchars($value, ENT_QUOTES, 'UTF-8'));
}

// ─── Booking code generator ──────────────────────────────────
function generateBookingCode(): string {
    $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $code = 'JC';
    for ($i = 0; $i < 8; $i++) {
        $code .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $code;
}

// ─── CORS headers ────────────────────────────────────────────
function setCorsHeaders(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// ─── JWT Helpers ─────────────────────────────────────────────
function base64UrlEncode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwtEncode(array $payload): string {
    $header = base64UrlEncode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload = base64UrlEncode(json_encode($payload));
    $signature = base64UrlEncode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$signature";
}

function jwtDecode(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;

    [$header, $payload, $signature] = $parts;
    $validSig = base64UrlEncode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));

    if (!hash_equals($validSig, $signature)) return null;

    $data = json_decode(base64UrlDecode($payload), true);
    if (!$data || !isset($data['exp']) || $data['exp'] < time()) return null;

    return $data;
}

function generateTokens(int $userId): array {
    $now = time();
    $accessToken = jwtEncode([
        'sub' => $userId,
        'iat' => $now,
        'exp' => $now + JWT_ACCESS_TTL,
        'type' => 'access'
    ]);
    $refreshToken = jwtEncode([
        'sub' => $userId,
        'iat' => $now,
        'exp' => $now + JWT_REFRESH_TTL,
        'type' => 'refresh'
    ]);
    return [$accessToken, $refreshToken];
}

function getAuthUserId(): ?int {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/Bearer\s+(.+)$/i', $header, $m)) return null;

    $payload = jwtDecode($m[1]);
    if (!$payload || ($payload['type'] ?? '') !== 'access') return null;

    return (int)($payload['sub'] ?? 0);
}

function requireAuth(): int {
    $userId = getAuthUserId();
    if (!$userId) {
        jsonError('Unauthorized', 401);
    }
    return $userId;
}
