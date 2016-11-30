
<script src="plugins/Tutorial-Status/js/js.storage.js"></script>

<?php
$_SESSION['user']="emews-admin";
$action="init";
if (isset($_GET) && !empty($_GET))
  $action=$_GET['action'];

  switch ($action) {
      case 'tutorial-view':
?>
<?php
      break;
      case 'restart':
?>
  <?php
      break;
      default:
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
      break;


  }

?>
