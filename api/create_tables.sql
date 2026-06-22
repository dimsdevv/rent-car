-- JelajahCar Database Schema
-- Run this SQL to create the database and bookings table

CREATE DATABASE IF NOT EXISTS jelajahcar
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE jelajahcar;

CREATE TABLE IF NOT EXISTS bookings (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    pickup_location VARCHAR(100) NOT NULL,
    pickup_date     DATE NOT NULL,
    return_date     DATE NOT NULL,
    car_type        VARCHAR(50) DEFAULT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_pickup_date (pickup_date),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
