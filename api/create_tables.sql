-- ============================================================
-- JelajahCar Database Schema (Optimized)
-- N+1 prevention, proper indexes, foreign keys, normalization
-- ============================================================

CREATE DATABASE IF NOT EXISTS jelajahcar
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE jelajahcar;

-- ------------------------------------------------------------
-- Table: users
-- User accounts for authentication
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    phone         VARCHAR(20) DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email_active (email, is_active),
    INDEX idx_user_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: car_categories
-- Normalized category lookup (prevents string duplication)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS car_categories (
    id          TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug        VARCHAR(30) NOT NULL UNIQUE,
    name        VARCHAR(50) NOT NULL,
    sort_order  TINYINT UNSIGNED NOT NULL DEFAULT 0,

    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: cars
-- Main fleet table with FK to categories
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cars (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    category_id     TINYINT UNSIGNED NOT NULL,
    price_per_day   DECIMAL(10,0) NOT NULL DEFAULT 0,
    seats           TINYINT UNSIGNED NOT NULL DEFAULT 5,
    fuel            VARCHAR(20) NOT NULL DEFAULT 'Bensin',
    transmission    VARCHAR(20) NOT NULL DEFAULT 'Manual',
    image_url       VARCHAR(500) DEFAULT NULL,
    is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    description     TEXT DEFAULT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key with CASCADE for category deletion
    CONSTRAINT fk_cars_category
        FOREIGN KEY (category_id) REFERENCES car_categories(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    -- Composite index: active + featured for common queries
    INDEX idx_active_featured (is_active, is_featured),
    -- Category filter + active status
    INDEX idx_category_active (category_id, is_active),
    -- Price range queries
    INDEX idx_price (price_per_day),
    -- Sort by newest
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: bookings
-- Main booking records
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED DEFAULT NULL,
    booking_code    CHAR(10) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    pickup_location VARCHAR(100) NOT NULL,
    pickup_date     DATE NOT NULL,
    return_date     DATE NOT NULL,
    car_id          INT UNSIGNED DEFAULT NULL,
    car_type        VARCHAR(50) DEFAULT NULL,
    status          ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
    notes           TEXT DEFAULT NULL,
    total_price     DECIMAL(12,0) DEFAULT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key to users (nullable for guest bookings)
    CONSTRAINT fk_bookings_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE,

    -- Foreign key to cars (nullable for flexible booking)
    CONSTRAINT fk_bookings_car
        FOREIGN KEY (car_id) REFERENCES cars(id)
        ON DELETE SET NULL ON UPDATE CASCADE,

    INDEX idx_user_id (user_id),
    -- Composite indexes for common query patterns
    INDEX idx_status_date (status, pickup_date),
    INDEX idx_pickup_date (pickup_date),
    INDEX idx_return_date (return_date),
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_created_at (created_at),
    -- Overlap detection query: WHERE pickup_date < ? AND return_date > ?
    INDEX idx_date_range (pickup_date, return_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: testimonials
-- Customer testimonials with rating
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    role        VARCHAR(100) NOT NULL,
    rating      TINYINT UNSIGNED NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    text        TEXT NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order  INT UNSIGNED NOT NULL DEFAULT 0,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Composite: active + featured for front-page queries
    INDEX idx_active_featured (is_active, is_featured),
    INDEX idx_active_sort (is_active, sort_order),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: faq
-- FAQ entries with ordering
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faq (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    question    TEXT NOT NULL,
    answer      TEXT NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order  INT UNSIGNED NOT NULL DEFAULT 0,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: cache_store
-- Application-level file cache metadata (for warmup/debugging)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cache_store (
    cache_key   VARCHAR(191) PRIMARY KEY,
    expires_at  DATETIME NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
