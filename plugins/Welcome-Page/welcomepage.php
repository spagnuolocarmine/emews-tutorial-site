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

<div class="grid grid-pad" style="margin-top:40px; width:100%;">

</div>

<div class="grid grid-pad">
  <div class="col-1-1">
      <div class="content">
      <!--  <a href="http://swift-lang.org/Swift-T/"><img src="plugins/Welcome-Page/img/logo_swift.png" alt="SwiftT"></a>-->
         <span style="font-size:30px; font-weight: bold; position:relative; top:-20px; >">EMEWS Tutorial</span>
         <hr>
      </div>
  </div>
    <div class="col-1-3">

          <script src="components/user/init.js"></script>
           <?php include 'plugins/Welcome-Page/emews-tutorial.php'; ?>


    </div>

    <div class="col-1-3">

          <span style="font-size:20px; ">Contacts</span>
          <div class="contacts" style="margin-top:20px; font-size:15px;">
          <ul class="contacts">
              <li class="contacts"> Jonathan Ozik <br><span style="float:right;margin-left:10px;font-weight:normal;">Argonne National Laboratory</span> </li>
              <li class="contacts">Nicholson Collier  <br><span style="float:right;margin-left:10px;font-weight:normal;">Argonne National Laboratory</span> </li>
              <li class="contacts">Justin Wozniak  <br><span style="float:right;margin-left:10px;font-weight:normal;">Argonne National Laboratory</span> </li>
              <li class="contacts">Carmine Spagnuolo  <br><span style="float:right;margin-left:10px;font-weight:normal;">Univeristà degli Studi di Salerno</span> </li>
          </ul>
          </div>

    </div>

    <div class="col-1-3">

        <div class="contacts">
         <ul class="contacts">
            <li class="contacts"><a href="http://www.anl.gov/"><img width="100%" src="plugins/Welcome-Page/img/anl2.png" alt="ANL"></a></li>
            <li class="contacts"><a href="http://www.uchicago.edu/"><img width="80%" style="margin-left:40px;" src="plugins/Welcome-Page/img/logochicago.png" alt="uchicago"></a></li>
            <li class="contacts"><a href="http://web.unisa.it/home"><img width="80%" style="margin-left:40px;" src="plugins/Welcome-Page/img/logounisa.png" alt="unisa"></a></li>
        </div>

    </div>

    <div class="col-1-1">
        <div class="content">
            <span style="font-size:10px; float:left; font-weight:normal >">This site is based on <a href="http://codiad.com/">Codiad</a> a web-based IDE framework.</span>
           <hr style="width:100%;">
           <span style="font-size:10px; float:left; font-weight:normal >">Copyright © 2016 Argonne National Laboratory. All rights reserved. </span>
           <span style="font-size:10px; float:right; font-weight:normal >">Powered by Carmine Spagnuolo</span>
        </div>
    </div>


</div>


</div> <!-- welcome-page -->
