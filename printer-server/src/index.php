<?php
require __DIR__ . '/../vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Dotenv\Dotenv;
use PrintServer\PrintServer;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$port = isset($_ENV['PORT']) ? intval($_ENV['PORT']) : 8080;

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new PrintServer()
        )
    ),
    $port
);

echo "Print server running on ws://localhost:" . $port . "\n";
$server->run();
