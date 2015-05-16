<?php
require 'vendor/autoload.php';
require "inc/jwt.php";

if(file_exists("config.php")) {
  require 'config.php';
} else {
  $oauth_server = [
    "key" => "12345678",
    "iss" => "http://www.married.dk/auth/",
    "aud" => "http://www.married.dk/api/"
  ];
}

use \Slim\Middleware\JwtAuthentication\RequestPathRule;
use \Slim\Middleware\JwtAuthentication\RequestMethodRule;

$database_user = 'root';
if(posix_getpwuid(posix_geteuid())['name'] === 'married') {
  $database_user = 'married';
}

$pdo = new PDO("mysql:host=localhost;dbname=wedding", $database_user, '', array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_STRINGIFY_FETCHES => false));
// Make sure we are in UTC as mysql will convert timestamp from local time if this is not set
$pdo->query("SET SESSION time_zone = '+00:00'");
$pdo->query("SET NAMES 'utf8' COLLATE 'utf8_general_ci'");

$app = new \Slim\Slim();
$app->log->setEnabled(true);

$app->add(new \Slim\Middleware\JwtAuthentication([
    "secure" => false,
    "secret" =>  $oauth_server["key"],
    "callback" => function ($options) use ($app) {
        $app->jwt = $options["decoded"];
    },
    "rules" => [
      new RequestPathRule([
        "path" => "/",
        "passthrough" => ["/auth/token"]
      ]),
      new RequestMethodRule([
        "passthrough" => array("OPTIONS")
      ])
    ],
]));

$app->post('/auth/token', function () use ($app, $pdo, $oauth_server) {
  //POST variable
  /*$client_id = $app->request->post('client_id');
  $redirect_uri = $app->request->post('redirect_uri');
  $response_type = $app->request->post('response_type');
  $redirect_uri = $app->request->post('redirect_uri'); */
  $key = $app->request->post('key');

  $stmt = $pdo->prepare("SELECT id, title FROM invitation WHERE `key` = :key");
  if (!$stmt) {
    echo "\nPDO::errorInfo():\n";
    print_r($pdo->errorInfo());
  }

  $stmt->execute(array(':key' => $key));
  $stmt->setFetchMode(PDO::FETCH_CLASS, 'Invitation');
  $invitation = $stmt->fetch();
  if($invitation) {
    // HS256 (HmacSHA256) with shared key
    $jwt_token = jwt_encode(
        [
            "typ" => "JWT",
            "alg" => "HS256"
        ],
        [
            // Authority information
            "jti" => uniqid("a:"), // Create a unique ID and add a prefix to for the node creating it
            "iss" => $oauth_server["iss"],
            "aud" => $oauth_server["aud"],
            "iat" => time(),
            "nbf" => time() - 60 * 5, // 5 minutes skrew
            "exp" => time() + 60 * 60 * 2, // expires in 8 hours
            // User information
            "sub" => $invitation->id
        ],
    $oauth_server["key"]);

    $json = json_encode([
      "access_token" => $jwt_token
    ], JSON_PRETTY_PRINT);

  } else {
    $json = json_encode([
      "error" => "Code not found"
    ], JSON_PRETTY_PRINT);
  }
   // Create response
  $response = $app->response;
  $response['Content-Type'] = 'application/json';
  $response['Access-Control-Allow-Origin'] = '*';
  $response->body($json);
});

$app->options('/auth/token', function() use ($app) {
    $app->response()->header('Access-Control-Allow-Origin', '*');
    $app->response()->header('Access-Control-Allow-Headers', 'Content-Type');
    $app->response()->header('Access-Control-Allow-Methods', 'POST');
});

$app->get('/invitation', function () use ($app, $pdo) {
    $stmt = $pdo->prepare("SELECT id, title FROM invitation WHERE id = :id");
    $stmt->execute([":id" => $app->jwt->sub]);
    $stmt->setFetchMode(PDO::FETCH_CLASS, 'Invitation');

    $invitation = $stmt->fetch();
    $json = json_encode($invitation, JSON_PRETTY_PRINT);

    // Create response
    $response = $app->response;
    $response['Content-Type'] = 'application/json';
    $response['Access-Control-Allow-Origin'] = '*';
    $response->body($json);
});

$app->options('/invitation', function() use ($app) {
    $app->response()->header('Access-Control-Allow-Origin', '*');
    $app->response()->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $app->response()->header('Access-Control-Allow-Methods', 'GET');
});

$app->get('/rsvp', function () use ($app, $pdo) {
    $stmt = $pdo->prepare("SELECT id, name, coming, transportation, children, food, comments, email FROM guest WHERE invitation_id = :invitation_id");
    $stmt->execute([":invitation_id" => $app->jwt->sub]);
    $stmt->setFetchMode(PDO::FETCH_CLASS, 'Guest');

    $results = [];
    while($guest = $stmt->fetch()) {
        //$app->log->info($guest);
        // Fix type mapping
        $guest->transportation = $guest->transportation ? true : false;
        $guest->coming = $guest->coming === null ? null : ($guest->coming ? true : false);
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
    $stmt = $pdo->prepare("SELECT id, name, coming, transportation, children, food, comments, email FROM guest WHERE id = :id AND invitation_id = :invitation_id");
    $stmt->execute(array(':id' => $id, ":invitation_id" => $app->jwt->sub));
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
    $stmt = $pdo->prepare("UPDATE guest SET coming = :coming, transportation = :transportation, children = :children, food = :food, comments = :comments, email = :email WHERE id = :id AND invitation_id = :invitation_id");
    $stmt->execute(array(':id' => $id, ':coming' => $data['coming'], ':transportation' => $data['transportation'], ':children' => $data['children'], ':food' => $data['food'], ':comments' =>  $data['comments'], ':email' =>  $data['email'],  ":invitation_id" => $app->jwt->sub));

    $response = $app->response;
    $response['Content-Type'] = 'application/json';
    $response['Access-Control-Allow-Origin'] = '*';
    $response->body("");
});

$app->options('/rsvp', function() use ($app) {
    $app->response()->header('Access-Control-Allow-Origin', '*');
    $app->response()->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $app->response()->header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS, HEAD');
});

$app->options('/rsvp/:id', function() use ($app) {
    $app->response()->header('Access-Control-Allow-Origin', '*');
    $app->response()->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $app->response()->header('Access-Control-Allow-Methods', 'GET, DELETE, PUT, OPTIONS, HEAD');
});

$app->post('/pay', function () use($app, $pdo) {
  $json = $app->request->getBody();
  $data = json_decode($json, true);
  $stmt = $pdo->prepare("INSERT INTO pay (title, amount, comment, invitation_id) VALUES(:title, :amount, :comment, :invitation_id)");
  foreach($data as $gift) {
    $invitation_id = $app->jwt->sub;

    if($gift['amount'] > 0) {
      if(!isset($gift['comment'])) {
        $gift['comment'] = null;
      }

      //file_put_contents("/tmp/php-debug.txt",  var_export($gift, true));

      // Update database
      $stmt->execute(array(':title' => $gift['title'], ':amount' => $gift['amount'], ':comment' => $gift['comment'],
                         ':invitation_id' => $invitation_id));
    }
  }
  $response = $app->response;
  $response['Content-Type'] = 'application/json';
  $response['Access-Control-Allow-Origin'] = '*';
  $response->body("");
});

$app->options('/pay', function() use ($app) {
    $app->response()->header('Access-Control-Allow-Origin', '*');
    $app->response()->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $app->response()->header('Access-Control-Allow-Methods', 'GET, POST');
});

$app->run();

// Classes
class Invitation {
    public $id;
    public $title;
}

class Guest {
    public $id;
    public $name;
    public $transportation;
    public $coming;
    public $children;
    public $food;
    public $comments;
    public $email;
}
