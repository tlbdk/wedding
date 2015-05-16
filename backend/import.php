<?php
$pdo = new PDO("mysql:host=localhost;dbname=wedding", 'root', '', array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_STRINGIFY_FETCHES => false));
// Make sure we are in UTC as mysql will convert timestamp from local time if this is not set
$pdo->query("SET SESSION time_zone = '+00:00'");
$pdo->query("SET NAMES 'utf8' COLLATE 'utf8_general_ci'");

//$pdo->query("TRUNCATE TABLE pay");
//$pdo->query("TRUNCATE TABLE guest");
//$pdo->query("TRUNCATE TABLE invitation");

$row = 1;
if (($handle = fopen("/home/tlb/Downloads/Guest list - Sheet1.csv", "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
      if($row++ === 1) { continue; }
      
      if(!empty($data[1]) and !empty($data[6]) and !empty($data[7]) and $data[6] !== "TOTAL") {
        $title = $data[6];
        $language = $data[7];
        $conjugation = $data[8];
        $key = $data[13];
        
        if(empty($key)) {
          echo "missing key in row $row : $title\n";
          var_dump($data);
        }
        
        echo "Create invitation: $title\n";
        $stmt = $pdo->prepare("INSERT INTO invitation (`title`, `key`, `language`, `conjugation`) VALUES(:title, :key, :language, :conjugation)");
        if (!$stmt) {
          echo "\nPDO::errorInfo():\n";
          print_r($pdo->errorInfo());
        }
        $stmt->execute([":title" => $title, ":key" => $key, ":language" => $language,  ":conjugation" => $conjugation]);
        $invitation_id = $pdo->lastInsertId();
          
        for($i = 2; $i<6; $i++) {
          if(!empty($data[$i])) {
            $name = $data[$i];
            echo "Create guest $name\n";
            $stmt = $pdo->prepare("INSERT INTO guest (name, invitation_id) VALUES(:name, :invitation_id)");
            if (!$stmt) {
              echo "\nPDO::errorInfo():\n";
              print_r($pdo->errorInfo());
            }
            $stmt->execute([ ":name" => $name, ":invitation_id" => $invitation_id ]);
          }
        }
        //var_dump($data);
      }
    }
    fclose($handle);
}

function generateRandomString($length = 10) {
    return substr(str_shuffle("0123456789abcdefghjkmnopqrstuvwxyz"), 0, $length);
}