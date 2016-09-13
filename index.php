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
    <title><?php i18n("Swift/T Web Console and EMEWS Tutorial"); ?></title>
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
    <link rel="icon" href="favicon.ico" type="image/x-icon" />
</head>

<body >
    <script>
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
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script>!window.jQuery && document.write(unescape('%3Cscript src="js/jquery-1.7.2.min.js"%3E%3C/script%3E'));</script>
    <script src="js/jquery-ui-1.8.23.custom.min.js"></script>
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
    <div id="message"></div>
    
<?php if(!isset($_SESSION['user'])) : ?>
    <div class="welcome-page">
        
    <div class="grid grid-pad">
        <div class="col-1-1">
            <div class="content">
              <a href="http://swift-lang.org/Swift-T/"><img src="plugins/Welcome-Page/img/logo_swift.png" alt="SwiftT"></a>
               <span style="font-size:30px; font-weight: bold; position:relative; top:-20px; left:-60px;>">Web Console and EMEWS Tutorial</span>
            </div>
        </div>
    </div>

    <div class="grid grid-pad">
        <div class="col-1-2">
            <div class="content">
                <?php include 'plugins/Welcome-Page/swift-tutorial.php'; ?>
                
            </div>
        </div>
        <div class="col-1-2">
            <div class="content">
                
                 <?php include 'plugins/Welcome-Page/emews-tutorial.php'; ?>
            </div>
        </div>
    </div>

    <div class="grid grid-pad">
    
        <div class="col-1-2">
            <div class="content" >
                <?php include 'plugins/Welcome-Page/admin-login.php'; ?>
                
            </div>
        </div>
    </div>

    <style>
   
         
        ul.contacts {
          list-style-type: none;
          width: 500px;
        }
         
        h3.contacts {
          font: bold 20px/1.5 Helvetica, Verdana, sans-serif;
        }
         
        li.contacts img.contacts {
          float: left;
          margin: 0 15px 0 0;
        }
         
        li.contacts p.contacts {
          font: 200 12px/1.5 Georgia, Times New Roman, serif;
        }
         
        li.contacts {
          padding: 10px;
          overflow: auto;
        }
         
        li.contacts:hover {
          background: #eee;
          cursor: pointer;
        }
        </style>
    
    <div class="grid grid-pad">
      
        <div class="col-1-2">
            <div class="content">
                <span style="font-size:20px; ">Contacts</span>
                <div class="contacts" style="margin-top:20px; font-size:15px;">
                <ul class="contacts">
                    <li class="contacts">Jonathan Ozik (Argonne National Laboratory)</li>
                    <li class="contacts">Nicholson Collier (Argonne National Laboratory)</li>
                    <li class="contacts">Justin Wozniak (Argonne National Laboratory)</li>
                    <li class="contacts">Carmine Spagnuolo (Univeristà degli Studi di Salerno)</li>
                </ul>
                </div>
            </div>
        </div>
        <div class="col-1-2">
            <div class="content">
                <div class="contacts">
                 <ul class="contacts">
                    <li class="contacts"><a href="http://www.anl.gov/"><img src="plugins/Welcome-Page/img/anl2.png" alt="ANL"></a></li>
                    <li class="contacts"><a href="http://www.uchicago.edu/"><img width="200px" src="plugins/Welcome-Page/img/logochicago.png" alt="uchicago"></a></li>
                    <li class="contacts"><a href="http://web.unisa.it/home"><img width="200px" src="plugins/Welcome-Page/img/logounisa.png" alt="unisa"></a></li>
                
                </div>
            </div>
        </div>
    </div>

</div> <!-- welcome-page -->
<?php else: ?>
    <?php include('plugins/Welcome-Page/workspace.php'); ?>
<?php endif; ?>

</body>
</html>
