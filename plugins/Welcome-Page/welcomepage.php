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
          <span style=" font-size:20px; ">Authors</span>
          <ul class="contacts" style="margin-top:20px;">
              <li> Jonathan Ozik <br><span style="float:right;margin-left:10px;font-weight:normal;">Argonne National Laboratory</span> </li>
<hr style="margin-top:20px;width:100%;">
              <li>Nicholson Collier  <br><span style="float:right;margin-left:10px;font-weight:normal;">Argonne National Laboratory</span> </li>
<hr style="margin-top:20px;width:100%;">
              <li>Justin Wozniak  <br><span style="float:right;margin-left:10px;font-weight:normal;">Argonne National Laboratory</span> </li>
<hr style="margin-top:20px;width:100%;">
              <li>Carmine Spagnuolo  <br><span style="float:right;margin-left:10px;font-weight:normal;">Univeristà degli Studi di Salerno</span> </li>
              <hr style="margin-top:20px;width:100%;">
              <li><br><br>For questions about EMEWS or to access archived questions, please subscribe to the
<a target="_blank" href="https://lists.mcs.anl.gov/mailman/listinfo/emews"><b id="myb">EMEWS mailing list</b></a>. </li>
              <li><br><br>To cite EMEWS, please use: <br> Ozik, J., N. Collier, J. M. Wozniak and C. Spagnuolo. 2016. "From Desktop to Large-Scale Model Exploration with Swift/T." In Proceedings of the 2016 Winter Simulation Conference.</li>


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
</ul>

        </div>
<span style="font-size:12px; float:right; font-weight:normal >"><br><br>Research reported in this website was supported by the National Institute of General Medical Sciences (R01GM115839), National Institute on Drug Abuse (R01DA039934), and National Institute on Aging (R01AG047869) of the National Institutes of Health. This material is based upon work supported by the National Science Foundation under Grant DEB1516428. The content is solely the responsibility of the authors and does not necessarily represent the official views of the National Institutes of Health or the National Science Foundation.
</span>

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
