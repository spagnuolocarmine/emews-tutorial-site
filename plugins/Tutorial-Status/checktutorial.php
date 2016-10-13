<?php
$action=$_GET['action'];
function creatNewTutorial(){
  $basecookie = file_get_contents("plugins/Tutorial-Status/status.json");
  $value = base64_encode(json_encode($basecookie));
  setcookie("tutorial", $value, time() + (86400 * 30), "/");
}
  switch ($action) {
      case 'tutorial-view':
          $cookie = $_COOKIE['tutorial'];
          if(!isset($cookie)) {
            creatNewTutorial();
          }
          $cookie = json_decode(base64_decode($cookie),true);

        //  echo "the name is ".$cookie['tutorial'][0];


      break;
      case 'restart':
          //RESET COOKIE AND RELOAD PAGE
          creatNewTutorial();
      break;
  }

?>
