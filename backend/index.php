<?php
require 'vendor/autoload.php';

$pdo = new PDO("mysql:host=localhost;dbname=wedding", 'root', '', array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_STRINGIFY_FETCHES => false));
// Make sure we are in UTC as mysql will convert timestamp from local time if this is not set
$pdo->query("SET SESSION time_zone = '+00:00'");

$app = new \Slim\Slim();

//$app->add(new \Slim\Middleware\JwtAuthentication([
//    "secret" => "supersecretkeyyoushouldnotcommittogithub"
//]));

$app->get('/rsvp', function () use ($app, $pdo) {
    $stmt = $pdo->prepare("SELECT id, name, coming, transportation, children, food, comments FROM guests");
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_CLASS, 'Guest');

    $results = [];
    while($guest = $stmt->fetch()) {
        // Fix type mapping
        $guest->transportation = $guest->transportation ? true : false;
        $guest->coming = $guest->coming ? true : false;
        $guest->children = $guest->children ? true : false;

        $results[] = $guest;
    }
    $json = json_encode($results, JSON_PRETTY_PRINT);

    // Create response
    $response = $app->response;
    $response['Content-Type'] = 'application/json';
    $response['Access-Control-Allow-Origin'] = '*';
    $response->body($json);
});

$app->get('/rsvp/:id', function ($id) use($app, $pdo) {
    $stmt = $pdo->prepare("SELECT id, name, coming, transportation, children, food, comments FROM guests WHERE id = :id");
    $stmt->execute(array(':id' => $id));
    $stmt->setFetchMode(PDO::FETCH_CLASS, 'Guest');
    $guest = $stmt->fetch();

    // Fix type mapping
    $guest->transportation = $guest->transportation ? true : false;
    $guest->coming = $guest->coming ? true : false;
    $guest->children = $guest->children ? true : false;

    // Create response
    $json = json_encode($guest, JSON_PRETTY_PRINT);
    $response = $app->response;
    $response['Content-Type'] = 'application/json';
    $response['Access-Control-Allow-Origin'] = '*';
    $response->body($json);
});

$app->put('/rsvp/:id', function ($id) use($app, $pdo) {
    $json = $app->request->getBody();
    $data = json_decode($json, true);
    //$stmt = $pdo->prepare("UPDATE guests SET coming = :coming WHERE id = :id");
    $stmt = $pdo->prepare("UPDATE guests SET coming = :coming, transportation = :transportation, children = :children, food = :food, comments = :comments WHERE id = :id");
    $stmt->execute(array(':id' => $id, ':coming' => $data['coming'], ':transportation' => $data['transportation'], ':children' => $data['children'], ':food' => $data['food'], ':comments' =>  $data['comments'] ));

    $response = $app->response;
    $response['Content-Type'] = 'application/json';
    $response['Access-Control-Allow-Origin'] = '*';
    $response->body("");
});



$app->options('/rsvp', function() use ($app) {
    $app->response()->header('Access-Control-Allow-Origin', '*');
    $app->response()->header('Access-Control-Allow-Headers', 'Content-Type');
    $app->response()->header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS, HEAD');
});

$app->options('/rsvp/:id', function() use ($app) {
    $app->response()->header('Access-Control-Allow-Origin', '*');
    $app->response()->header('Access-Control-Allow-Headers', 'Content-Type');
    $app->response()->header('Access-Control-Allow-Methods', 'GET, DELETE, PUT, OPTIONS, HEAD');
});

$app->run();

// Classes
class Guest {
    public $id;
    public $name;
    public $transportation;
    public $coming;
    public $children;
    public $food;
    public $comments;
}
