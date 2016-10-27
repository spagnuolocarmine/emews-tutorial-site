
<script>


</script>

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
      case 'init':

?>
      <script>
        storage=Storages.localStorage;
        localStorage.clear();
        if( storage.get("tutorial") == "" || storage.get("tutorial") == null)
        {
          storage.set('tutorial','tutorialwelcome');
          storage.set('paragraph','');
          storage.set('toc','');
          storage.set('files',[]);
          storage.set('hightlights',new Map());
        }

      </script>
  <?php
      break;


  }

?>
