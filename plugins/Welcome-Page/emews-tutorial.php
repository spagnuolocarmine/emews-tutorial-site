
<p style="margin-top:20px; font-size:20px; text-align: justify;">
    What is EMEWS?
</p>
<p style="margin-top:20px;  font-size:17px; text-align: justify;">
    As high-performance computing resources have become increasingly available,
    new modes of computational processing and experimentation have become possible.
     This tutorial presents the Extreme-scale Model Exploration with Swift (EMEWS)
     framework for combining existing capabilities for model exploration approaches
     (e.g., model calibration, metaheuristics, data assimilation) and simulations
     (or any “black box” application code) with the <a target="_blank" href="http://swift-lang.org/Swift-T/">Swift/T</a>
      parallel scripting
     language to run scientific workflows on a variety of computing resources,
      from desktop to academic clusters to <a target="_blank" href="https://www.top500.org/">Top 500</a> level supercomputers.

       This tutorial presents a number of use-cases, starting with a simple
       agent-based model parameter sweep, and ending with a complex
        adaptive parameter space exploration workflow coordinating
        ensembles of distributed (MPI) simulations. The use-cases are available 
        for interested parties to download and run on their own.
</p>

<div>

<div style="width:100%;" >

  <button class="button" style="float:right;" id="bstart" name="action" value="tutorial-view">
    Go to Tutorial!
  </button>

  <script>
      $(document).on('click','#bstart', function(){
      
        $(window).attr('location',"?action=tutorial-view");
    });
  </script>
<!--  <input style="width:40%;  float:left;" type="submit" id="start" name="action" value="Continue Tutorial"/>-->
</div>

</div>
