<style>
    ul.contacts {
      list-style-type: none;
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
      opacity: 0.6;
      cursor: pointer;
    }
</style>
<div id="message"></div>

<div id="welcome-page" class="welcome-page">

<div class="grid grid-pad">
  <div class="col-1-1" style="margin-bottom:30px;">
      <div class="content">
      <!--  <a href="http://swift-lang.org/Swift-T/"><img src="plugins/Welcome-Page/img/logo_swift.png" alt="SwiftT"></a>-->
         <img height="150px" style="margin-bottom:-80px;" src="plugins/Welcome-Page/img/emu_white.png" alt="emu">
         <span style=" font-size:60px;  margin-left:10px; font-weight: bold; position:relative; >">EMEWS </span>
         <br><hr style="width:100%;margin-left:90px;  margin-bottom:15px;">
         <span style=" margin-left:90px;font-size:20px; position:relative; >"> Extreme-scale Model Exploration with Swift/T</span>

      </div>
  </div>

    <div class="col-1-3">

          <script src="components/user/init.js"></script>
           <?php include 'plugins/Welcome-Page/emews-tutorial.php'; ?>


    </div>

    <div class="col-1-3">


          <div class="contacts" style="margin-top:20px; font-size:17px">
          <span style=" font-size:20px; ">Contacts</span>
          <ul class="contacts" style="margin-top:20px;">
              <li class="contacts"> Jonathan Ozik <br><span style="float:right;margin-left:10px;font-weight:normal;">Argonne National Laboratory</span> </li>
<hr style="width:100%;">
              <li class="contacts">Nicholson Collier  <br><span style="float:right;margin-left:10px;font-weight:normal;">Argonne National Laboratory</span> </li>
<hr style="width:100%;">
              <li class="contacts">Justin Wozniak  <br><span style="float:right;margin-left:10px;font-weight:normal;">Argonne National Laboratory</span> </li>
<hr style="width:100%;">
              <li class="contacts">Carmine Spagnuolo  <br><span style="float:right;margin-left:10px;font-weight:normal;">Univeristà degli Studi di Salerno</span> </li>
          </ul>
          </div>

    </div>

    <div class="col-1-3">

        <div class="contacts">
         <ul class="contacts">
            <li class="contacts">
              <a href="http://www.anl.gov/"><img width="80%" src="plugins/Welcome-Page/img/anl2.png" alt="ANL"></a></li>
            <li class="contacts">
              <a href="http://web.unisa.it/home"><img width="40%" style="margin-left:0px;" src="plugins/Welcome-Page/img/logounisa.png" alt="unisa"></a>
              <a href="http://www.uchicago.edu/"><img width="37%" style="margin-left:0px;" src="plugins/Welcome-Page/img/logochicago.png" alt="uchicago"></a></li>

        </div>

    </div>

    <div class="col-1-1" style="margin-top:30px; ">
        <div class="content">
            <span style="font-size:12px; float:left; font-weight:normal >">This site is based on <a href="http://codiad.com/">Codiad</a> a web-based IDE framework.</span>
           <hr style="width:100%;">
           <span style="font-size:12px; float:left; font-weight:normal >">Copyright © 2016 Argonne National Laboratory. All rights reserved. </span>
           <span style="font-size:12px; float:right; font-weight:normal >">Website developed by 
             <a href="http://www.carminespagnuolo.eu">Carmine Spagnuolo</a></span>
        </div>
    </div>


</div>


</div> <!-- welcome-page -->
