<script src="plugins/Tutorial-Status/js/js.storage.js"></script>
<?php
$_SESSION['user']="emews-admin";
$action="";
if (isset($_GET) && !empty($_GET)) $action=$_GET['action'];
if($action != "tutorial-view" || $action != "restart")
{
?>
  <script>
  //  $.loadScript('plugins/Tutorial-Status/js/js.storage.js');
    storage=Storages.localStorage;
    if( storage.get("tutorial") == "" || storage.get("tutorial") == null)
    {
       storage.set('tutorial','introduction');
     }
  </script>

<?php
}
    switch ($action) {
        case "tutorial-view" :

            $path = rtrim(str_replace("index.php", "", $_SERVER['SCRIPT_FILENAME']),"/");
            $users = file_exists($path . "/data/users.php");
            $projects = file_exists($path . "/data/projects.php");
            $active = file_exists($path . "/data/active.php");
            if(!$users && !$projects && !$active){  "Error in loading tutorial!";
            }else {
                include('plugins/Welcome-Page/workspace.php');
            }
            ?>
          <script>
          //  console.log("Open tutorial");
           var tutorial = location.search.split('tutorial=')[1];
            var checkExist=setInterval(function() {
              if ($('#workspace').length > 0) {
              //  console.log("Open tutorial");
                  if(tutorial != undefined)
                  {
                    storage=Storages.localStorage;
                    storage.set('tutorial',tutorial);
                    window.location.href = "?action=tutorial-view"
                  }
                  codiad.console.loadTutorial();
                  clearInterval(checkExist);
                }//else console.log($('#workspace').length);
              }, 20);
          </script>
      <?php

        break;
        case  "restart":

            $path = rtrim(str_replace("index.php", "", $_SERVER['SCRIPT_FILENAME']),"/");
            $users = file_exists($path . "/data/users.php");
            $projects = file_exists($path . "/data/projects.php");
            $active = file_exists($path . "/data/active.php");
            if(!$users && !$projects && !$active){  "Error in loading tutorial!";
            }else {
                include('plugins/Welcome-Page/workspace.php');
            }
            ?>
          <script>
                  codiad.console.loadDefaultTutorial();
          </script>
      <?php

        break;
        default:
            include('plugins/Welcome-Page/welcomepage.php');
        break;
    }
 ?>
