<?php
require 'db.php';
$stmt = getDB()->query("SELECT id, user_id, car_id, booking_code, name, status FROM bookings ORDER BY id DESC LIMIT 3");
$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($res, JSON_PRETTY_PRINT);
