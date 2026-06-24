<?php
require 'db.php';
$stmt = getDB()->query("SELECT id, name, email FROM users");
$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($res, JSON_PRETTY_PRINT);
