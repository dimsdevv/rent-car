<?php
/**
 * Auth API - Register, Login, Me, Refresh, Logout
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/cache.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$action = str_replace('/api/auth', '', $uri) ?: '/';

// ─── POST /api/auth/register ─────────────────────────────────
if ($method === 'POST' && $action === '/register') {
    $input = getJsonInput();

    $name  = sanitize($input['name'] ?? '');
    $email = filter_var(trim($input['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $phone = sanitize($input['phone'] ?? '');
    $pass  = $input['password'] ?? '';

    // Validation
    $errors = [];
    if (strlen($name) < 2)       $errors['name']     = 'Nama minimal 2 karakter';
    if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL))
                                  $errors['email']    = 'Format email tidak valid';
    if (strlen($pass) < 8)       $errors['password'] = 'Password minimal 8 karakter';

    // Unique email check
    if ($email) {
        $exists = fetchOne("SELECT id FROM users WHERE email = :email", [':email' => $email]);
        if ($exists) $errors['email'] = 'Email sudah terdaftar';
    }

    if (!empty($errors)) jsonError('Validasi gagal', 422, $errors);

    // Insert user
    try {
        $userId = insertRow('users', [
            'name'          => $name,
            'email'         => $email,
            'phone'         => $phone ?: null,
            'password_hash' => password_hash($pass, PASSWORD_BCRYPT, ['cost' => 12]),
            'is_active'     => 1,
        ]);
    } catch (Throwable $e) {
        jsonError('Gagal menyimpan data ke database: ' . $e->getMessage(), 500);
    }

    // Generate tokens
    [$access, $refresh] = generateTokens((int)$userId);

    // Set refresh token as httpOnly cookie
    setcookie('refresh_token', $refresh, [
        'expires'  => time() + JWT_REFRESH_TTL,
        'path'     => '/',
        'secure'   => false, // true for HTTPS
        'httponly'  => true,
        'samesite'  => 'Lax',
    ]);

    jsonSuccess([
        'token' => $access,
        'user'  => ['id' => (int)$userId, 'name' => $name, 'email' => $email, 'phone' => $phone ?: null],
    ], 'Registrasi berhasil', 201);
}

// ─── POST /api/auth/login ────────────────────────────────────
if ($method === 'POST' && $action === '/login') {
    $input = getJsonInput();

    $email = filter_var(trim($input['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $pass  = $input['password'] ?? '';

    if (!$email || !$pass) jsonError('Email dan password wajib diisi', 400);

    // Rate limiting (per IP)
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $rateKey = 'rate_login_' . md5($ip);
    $attempts = cacheGet($rateKey) ?? ['count' => 0, 'start' => time()];

    if ($attempts['count'] >= RATE_LIMIT_MAX && (time() - $attempts['start']) < RATE_LIMIT_WINDOW) {
        $retryIn = RATE_LIMIT_WINDOW - (time() - $attempts['start']);
        jsonError("Terlalu banyak percobaan. Coba lagi dalam " . ceil($retryIn / 60) . " menit", 429);
    }

    // Find user
    $user = fetchOne("SELECT * FROM users WHERE email = :email AND is_active = 1", [':email' => $email]);
    if (!$user || !password_verify($pass, $user['password_hash'])) {
        // Increment rate counter
        $attempts['count']++;
        cacheSet($rateKey, $attempts, RATE_LIMIT_WINDOW);
        jsonError('Email atau password salah', 401);
    }

    // Reset rate limit on success
    cacheForget($rateKey);

    // Generate tokens
    [$access, $refresh] = generateTokens((int)$user['id']);

    // Set refresh token cookie
    setcookie('refresh_token', $refresh, [
        'expires'  => time() + JWT_REFRESH_TTL,
        'path'     => '/',
        'secure'   => false,
        'httponly'  => true,
        'samesite'  => 'Lax',
    ]);

    // Remove sensitive data
    unset($user['password_hash']);

    jsonSuccess([
        'token' => $access,
        'user'  => $user,
    ], 'Login berhasil');
}

// ─── GET /api/auth/me ────────────────────────────────────────
if ($method === 'GET' && $action === '/me') {
    $userId = requireAuth();

    $user = fetchOne("SELECT id, name, email, phone, created_at FROM users WHERE id = :id", [':id' => $userId]);
    if (!$user) jsonError('User tidak ditemukan', 404);

    jsonSuccess($user);
}

// ─── POST /api/auth/refresh ──────────────────────────────────
if ($method === 'POST' && $action === '/refresh') {
    $refreshToken = $_COOKIE['refresh_token'] ?? '';

    if (!$refreshToken) jsonError('No refresh token', 401);

    $payload = jwtDecode($refreshToken);
    if (!$payload || ($payload['type'] ?? '') !== 'refresh') {
        // Clear invalid cookie
        setcookie('refresh_token', '', ['expires' => time() - 3600, 'path' => '/']);
        jsonError('Invalid refresh token', 401);
    }

    $userId = (int)$payload['sub'];
    $user = fetchOne("SELECT id, name, email, phone FROM users WHERE id = :id AND is_active = 1", [':id' => $userId]);
    if (!$user) jsonError('User tidak ditemukan', 404);

    // Generate new token pair
    [$access, $newRefresh] = generateTokens($userId);

    // Rotate refresh token
    setcookie('refresh_token', $newRefresh, [
        'expires'  => time() + JWT_REFRESH_TTL,
        'path'     => '/',
        'secure'   => false,
        'httponly'  => true,
        'samesite'  => 'Lax',
    ]);

    jsonSuccess([
        'token' => $access,
        'user'  => $user,
    ], 'Token refreshed');
}

// ─── POST /api/auth/logout ───────────────────────────────────
if ($method === 'POST' && $action === '/logout') {
    setcookie('refresh_token', '', [
        'expires' => time() - 3600,
        'path'    => '/',
    ]);

    jsonSuccess(null, 'Logout berhasil');
}

// ─── Fallback ────────────────────────────────────────────────
jsonError('Auth endpoint tidak ditemukan', 404);
