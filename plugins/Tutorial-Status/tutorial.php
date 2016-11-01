<?php
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
            var checkExist=setInterval(function() {
              if ($('#file-manager').length) {
                setTimeout(function(){ codiad.console.loadTutorial();},200);

                  clearInterval(checkExist);
                }
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
            // var checkExist=setInterval(function() {
            //   if ($('#file-manager').length) {
                  codiad.console.loadDefaultTutorial();
                //  window.location.href = "?action=tutorial-view"
                //  codiad.console.saveDefaultTutorial();
              //     clearInterval(checkExist);
              //   }
              // }, 20);

              //window.location.href = "?action=tutorial-view";


              </script>
      <?php

        break;
        case "init" || "home":
            include('plugins/Welcome-Page/welcomepage.php');
        break;
    }
 ?>
