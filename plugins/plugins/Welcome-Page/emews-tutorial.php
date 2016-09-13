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

<p style="margin-top:20px; font-size:20px; text-align: justify;">
    What is EMEWS?
</p>
<p style="margin-top:10px; font-size:17px; text-align: justify;">
    As high-performance computing resources have become increasingly available, new modes of computational processing and experimentation have become possible. This tutorial presents the Extreme-scale Model Exploration with Swift/T (EMEWS) framework for combining existing capabilities for model exploration approaches (e.g., model calibration, metaheuristics, data assimilation) and simulations (or any “black box” application code) with the Swift/T parallel scripting language to run scientific workflows on a variety of computing resources, from desktop to academic clusters to Top 500 level supercomputers. We will present a number of use-cases, starting with a simple agent-based model parameter sweep, and ending with a complex adaptive parameter space exploration workflow coordinating ensembles of distributed simulations. The use-cases are published on a public repository for interested parties to download and run on their own.
</p>
<!--<p style="margin-top:20px; font-size:20px; text-align: justify;">
    This page provides a set of tutorial to learn how to use EMEWS.
</p>-->
<div >

    <?php if($instance != '') { ?>
    <p style="font-size:15px; padding: 10px 0;">Server Status: Your tutorial instance has been prepared sucessfully.</p>
    <div class="install_issues">
      <p>Username: demo</p>
      <p>Password: demo</p>
  </div>
  <p style="font-size:15px; padding: 10px 0; color: #a8a6a8;">Note: Each instance will be deleted after 30 minutes.</p>
  <button onclick="window.open('<?php echo $instanceurl;?>', '_self');">Launch Tutorial</button>
  <?php } else { ?>
  <p style="padding: 10px 0; font-size:15px;"><font color=red>Server Status: Error</font> - Unable to generate a tutorial instance. Try it later.</p>
  <p style="padding: 10px 0; color: #a8a6a8; font-size:15px;">Command: <?php echo $command; ?></p>
  <p style="padding: 10px 0; color: #a8a6a8; font-size:15px;">Message: <?php echo print_r($instance); ?></p>
  <?php } ?>
</div>
<?php } ?>