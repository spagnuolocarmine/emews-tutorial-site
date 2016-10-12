<script>
  $("#home").click(function(e) {
    window.location.replace("?action=home");
  });
  $("#welcometutorial").click(function(e) {
  
    codiad.Tutorial.init();
    //close workspace
  });
  $("#restart").click(function(e) {
      window.location.replace("?action=restart");
  });
</script>
<div style="float:left;margin-top:10px; display:block; width:80px; height:80px;">
    <a style="font-size:80px;"alt="Home" id="home" class="icon-back"></a></div>
<div style="float:left;margin-top:9px; display:block; width:80px; height:80px; ">
    <a style="font-size:80px;"alt="WelcomeTutorial" id="welcometutorial" class="icon-home"></a></div>
<div style="float:left; display:block; width:80px; height:80px;">
  <a style="font-size:80px;"alt="Restart" id="restart" class="icon-retweet"></a></div>
<div style="clear:both;"></div>
