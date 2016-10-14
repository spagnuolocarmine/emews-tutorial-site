<script src="plugins/Tutorial-Status/js/js.storage.js"></script>
<script>

</script>

<?php

$action=$_GET['action'];

  switch ($action) {
      case 'tutorial-view':
?>
    <script>

       var checkExist=setInterval(function() {
         if ($('#file-manager').length) {
            codiad.console.loadTutorial();
             clearInterval(checkExist);
           }
         }, 20);

         //setInterval(function(){
            // saveTutorial();
         //}, 3000);

    </script>
<?php
      break;
      case 'restart':
?>
      <script>
      var checkExist=setInterval(function() {
        if ($('#file-manager').length) {
            codiad.console.loadDefaultTutorial();
            codiad.console.saveDefaultTutorial();
            clearInterval(checkExist);
          }
        }, 20);


      </script>
  <?php
      break;
  }

?>
