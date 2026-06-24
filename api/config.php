<?php
/**
 * JWT Configuration
 */

// JWT Secret Key (64-char random hex)
define('JWT_SECRET', 'a3f5d8e9c2b1f4a6d7e8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9');

// Token TTL (seconds)
define('JWT_ACCESS_TTL', 900);      // 15 minutes
define('JWT_REFRESH_TTL', 604800);  // 7 days

// Rate Limiting (login attempts)
define('RATE_LIMIT_MAX', 5);
define('RATE_LIMIT_WINDOW', 900);   // 15 minutes
