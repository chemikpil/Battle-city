<?php
require __DIR__ . '/vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

class BattleServer implements MessageComponentInterface
{
    protected $clients;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);

        $conn->send(new Message('connection', array('id' => $conn->resourceId, 'players' => count($this->clients))));

        foreach ($this->clients as $client) {
            $client->send(new Message('hello', array()));
        }

        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $numRecv = count($this->clients) - 1;
        echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
            , $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');

        foreach ($this->clients as $client) {
            if ($from !== $client) {
                $client->send($msg);
            }
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        foreach ($this->clients as $client) {
            if ($conn !== $client) {
                $client->send(new Message('bye', array('id' => $conn->resourceId)));
            }
        }

        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }
}

class Message
{
    private $type;
    private $data;

    public function __construct($type, $data)
    {
        $this->type = $type;
        $this->data = $data;
    }

    public function __toString()
    {
        return json_encode(
            array(
                'type' => $this->type,
                'data' => $this->data
            )
        );
    }
}

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new BattleServer()
        )
    ),
    8080
);

$server->run();