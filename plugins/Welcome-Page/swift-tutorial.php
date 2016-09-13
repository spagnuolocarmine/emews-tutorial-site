<?php
if(!file_exists('config.php')) {
  include('demo/instance.index.php');
} else {
  $instance = str_replace('.','',$_SERVER['REMOTE_ADDR']);
  $basepath = rtrim(str_replace("index.php", "", $_SERVER['SCRIPT_FILENAME']),"/");
  if(!file_exists($basepath.'/i/'.$instance)) {
    $command = $basepath.'/demo/createinstance.sh "'.$basepath.'" "'.$basepath.'/i" "'.str_replace('index.php', '', $_SERVER['REQUEST_URI']).'i" "'.str_replace('.','',$_SERVER['REMOTE_ADDR']).'"';
    $instance = shell_exec(escapeshellcmd($command));
}
$instanceurl = "i/".trim($instance)."/";
?>

<p style="margin-top:55px; font-size:17px; text-align: justify;">
  Swift/T -- High Performance Dataflow Computing is a completely new implementation of the Swift language for high-performance computing. 
  In this implementation, the Swift script is translated into an MPI program that uses the Turbine (hence, /T)
  and ADLB runtime libraries for highly scalable dataflow processing over MPI, without single-node bottlenecks.
  </p>

<div>

    <?php if($instance != '') { ?>
    <p style="font-size:15px; padding: 10px 0;">Server Status: Your tutorial instance has been prepared sucessfully.</p>
    <div class="install_issues">
      <p>Username: demo</p>
      <p>Password: demo</p>
  </div>
  <p style="font-size:15px; padding: 10px 0; color: #a8a6a8;">Note: Each instance will be deleted after 30 minutes.</p>
  <button onclick="window.open('<?php echo $instanceurl;?>', '_self');">Launch Web Console</button>
  <?php } else { ?>
  <p style="padding: 10px 0; font-size:15px;"><font color=red>Server Status: Error</font> - Unable to generate a tutorial instance. Try it later.</p>
  <p style="padding: 10px 0; color: #a8a6a8; font-size:15px;">Command: <?php echo $command; ?></p>
  <p style="padding: 10px 0; color: #a8a6a8; font-size:15px;">Message: <?php echo print_r($instance); ?></p>
  <?php } ?>
</div>
<?php } ?>