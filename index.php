<?php
//session_start();
require_once('common.php');

// Context Menu
$context_menu = file_get_contents(COMPONENTS . "/filemanager/context_menu.json");
$context_menu = json_decode($context_menu,true);

// Right Bar
$right_bar = file_get_contents(COMPONENTS . "/right_bar.json");
$right_bar = json_decode($right_bar,true);

// Read Components, Plugins, Themes
$components = Common::readDirectory(COMPONENTS);
$plugins = Common::readDirectory(PLUGINS);
$themes = Common::readDirectory(THEMES);

// Theme
$theme = THEME;
if(isset($_SESSION['theme'])) {
  $theme = $_SESSION['theme'];
}


?>

<!doctype html>

<head>
  <meta charset="utf-8">
  <title>EMEWS Tutorial</title>
  <?php
  // Load System CSS Files
  $stylesheets = array("jquery.toastmessage.css","reset.css","fonts.css","screen.css");

  foreach($stylesheets as $sheet){
      if(file_exists(THEMES . "/". $theme . "/".$sheet)){
          echo('<link rel="stylesheet" href="themes/'.$theme.'/'.$sheet.'">');
      } else {
          echo('<link rel="stylesheet" href="themes/default/'.$sheet.'">');
      }
  }

  // Load Component CSS Files
  foreach($components as $component){
      if(file_exists(THEMES . "/". $theme . "/" . $component . "/screen.css")){
          echo('<link rel="stylesheet" href="themes/'.$theme.'/'.$component.'/screen.css">');
      } else {
          if(file_exists("themes/default/" . $component . "/screen.css")){
              echo('<link rel="stylesheet" href="themes/default/'.$component.'/screen.css">');
          } else {
              if(file_exists(COMPONENTS . "/" . $component . "/screen.css")){
                  echo('<link rel="stylesheet" href="components/'.$component.'/screen.css">');
              }
          }
      }
  }

  // Load Plugin CSS Files
  foreach($plugins as $plugin){
      if(file_exists(THEMES . "/". $theme . "/" . $plugin . "/screen.css")){
          echo('<link rel="stylesheet" href="themes/'.$theme.'/'.$plugin.'/screen.css">');
      } else {
          if(file_exists("themes/default/" . $plugin . "/screen.css")){
              echo('<link rel="stylesheet" href="themes/default/'.$plugin.'/screen.css">');
          } else {
              if(file_exists(PLUGINS . "/" . $plugin . "/screen.css")){
                  echo('<link rel="stylesheet" href="plugins/'.$plugin.'/screen.css">');
              }
          }
      }
  }


  ?>
  <link rel="apple-touch-icon" sizes="57x57" href="favicon/apple-icon-57x57.png?v=2">
  <link rel="apple-touch-icon" sizes="60x60" href="favicon/apple-icon-60x60.png?v=2">
  <link rel="apple-touch-icon" sizes="72x72" href="favicon/apple-icon-72x72.png?v=2">
  <link rel="apple-touch-icon" sizes="76x76" href="favicon/apple-icon-76x76.png?v=2">
  <link rel="apple-touch-icon" sizes="114x114" href="favicon/apple-icon-114x114.png?v=2">
  <link rel="apple-touch-icon" sizes="120x120" href="favicon/apple-icon-120x120.png?v=2">
  <link rel="apple-touch-icon" sizes="144x144" href="favicon/apple-icon-144x144.png?v=2">
  <link rel="apple-touch-icon" sizes="152x152" href="favicon/apple-icon-152x152.png?v=2">
  <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-icon-180x180.png?v=2">
  <link rel="icon" type="image/png" sizes="192x192"  href="favicon/android-icon-192x192.png?v=2">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png?v=2">
  <link rel="icon" type="image/png" sizes="96x96" href="favicon/favicon-96x96.png?v=2">
  <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png?v=2">
  <link rel="manifest" href="favicon/manifest.json">
  <meta name="msapplication-TileColor" content="#ffffff">
  <meta name="msapplication-TileImage" content="favicon/ms-icon-144x144.png?v=2">
  <meta name="theme-color" content="#ffffff">
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
  <script>!window.jQuery && document.write(unescape('%3Cscript src="js/jquery-1.7.2.min.js"%3E%3C/script%3E'));</script>
  <!--<script src="js/jquery-ui-1.8.23.custom.min.js"></script>-->
  <script src="js/jquery-ui.js"></script>
  <script src="js/jquery.css3.min.js"></script>
  <script src="js/jquery.easing.js"></script>
  <script src="js/jquery.toastmessage.js"></script>
  <script src="js/amplify.min.js"></script>
  <script src="js/localstorage.js"></script>
  <script src="js/jquery.hoverIntent.min.js"></script>
  <script src="js/system.js"></script>
  <script src="js/sidebars.js"></script>
  <script src="js/modal.js"></script>
  <script src="js/message.js"></script>
  <script src="js/jsend.js"></script>
  <script src="js/instance.js?v=<?php echo time(); ?>"></script>
  <link href='http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css' rel='stylesheet' type='text/css'>
</head>
<body>

<style>
    a:hover {
        color: gray;
    }
    .button {
        position: relative;
        background-color: gray;
        border: none;
        font-size: 20px;
        color: #FFFFFF;
        padding: 5px;
        width: 200px;
        text-align: center;
        -webkit-transition-duration: 0.6s; /* Safari */
        transition-duration: 0.6s;
        text-decoration: none;
        overflow: hidden;
    }

    .button:after {

        background: #f1f1f1;
        display: block;
        position: absolute;
        padding-top: 300%;
        padding-left: 350%;
        margin-left: -20px !important;
        margin-top: -120%;
        opacity: 0;

    }

    .button:active:after {
        padding: 0;
        margin: 0;
        opacity: 1;
        transition: 0s
    }
    .loaderdiv {
       width: 100%;
       height: 100%;
       top: 0;
       left: 0;
       position: fixed;
       display: block;
       opacity: 0.5;
       background-color: white;
       z-index: 999999;
       text-align: center;

    }
    .loader {
        top: 50%;
        left: 50%;
        margin-top: -50px;
        margin-left: -50px;
        position: absolute;
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid black; /* Blue */
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
        z-index: 9999999999;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
    <div id="loading" class="loaderdiv"> <div class="loader"></div></div>

    <script>
    $("#loading").hide();

    var i18n = (function(lang) {
        return function(word,args) {
            var x;
            var returnw = (word in lang) ? lang[word] : word;
            for(x in args){
                returnw=returnw.replace("%{"+x+"}%",args[x]);
            }
            return returnw;
        }
    })(<?php echo json_encode($lang); ?>)



    </script>

<?php
//  include('plugins/Tutorial-Status/checktutorial.php');
  include('plugins/Tutorial-Status/tutorial.php');
?>

</body>
</html>
