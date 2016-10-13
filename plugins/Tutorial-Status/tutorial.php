<?php
    switch ($action) {
        case 'tutorial-view' || 'restart':
            $path = rtrim(str_replace("index.php", "", $_SERVER['SCRIPT_FILENAME']),"/");
            $users = file_exists($path . "/data/users.php");
            $projects = file_exists($path . "/data/projects.php");
            $active = file_exists($path . "/data/active.php");
            if(!$users && !$projects && !$active){  "Error in loading tutorial!";
            }else {
                include('plugins/Welcome-Page/workspace.php');
            }
        break;
        default:
            include('plugins/Welcome-Page/welcomepage.php');
        break;
    }
 ?>
