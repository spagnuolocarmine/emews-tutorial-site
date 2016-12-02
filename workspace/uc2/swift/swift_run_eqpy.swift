import files;
import string;
import sys;
import io;
import stats;
import python;
import math;
import location;
import assert;

import R_utils;
import EQPy;

string emews_root = getenv("EMEWS_PROJECT_ROOT");
string turbine_output = getenv("TURBINE_OUTPUT");
string params_csv = emews_root+"/data/params_for_deap.csv";
string parameters_path = emews_root+"/complete_model/scenario.rs/parameters.xml";
string resident_work_ranks = getenv("RESIDENT_WORK_RANKS");
string r_ranks[] = split(resident_work_ranks,",");

@suppress=unused_output
app (file so, file se) run_model (string model_sh, string param_line, string instance)
{
    "bash" model_sh param_line emews_root instance;
}

@suppress=unused_output
(float result) run_obj(string param_line, string id_suffix)
{
  // make instance dir
  string instance_dir = "%s/instance_%s/" % (turbine_output, id_suffix);
  make_dir(instance_dir) => {
    string model_sh = emews_root+"/scripts/eqpy_rs_single_run.sh";
    // Imported from R_obj.swift
    run_model(model_sh,param_line,instance_dir) => 
    result = calc_obj(instance_dir) =>
    rm_dir(instance_dir);
    // delete the instance directory as it is no longer needed
    // if it is needed then delete this line
    
  }     
}

(float sum_result) obj(string params, string vs, int trials, string iter_indiv_id) {
  float fresults[];
  string upfs = create_upfs(parameters_path, params, vs, trials);
  string parameter_combos[] = split(upfs, ";");
  foreach f,i in parameter_combos {
    string id_suffix = "%s_%i" % (iter_indiv_id,i);
    fresults[i] = run_obj(f, id_suffix); 
  }
  
  sum_result = avg(fresults);
}

(void v) loop (location ME, int ME_rank, int trials) {
    string param_names = 
    "zombie_step_size,human_step_size," + 
    "zombie_count,human_count";

    for (boolean b = true, int i = 1; 
       b;                             
       b=c, i = i + 1)                
  {
    // gets the model parameters from the python algorithm
    string params =  EQPy_get(ME);
    boolean c;
    // TODO
    // Edit the finished flag, if necessary.
    // when the python algorithm is finished it should
    // pass "DONE" into the queue, and then the
    // final set of parameters. If your python algorithm
    // passes something else then change "DONE" to that
    if (params == "DONE")
    {
        string finals =  EQPy_get(ME);
        
        string fname = "%s/final_result_%i" % (turbine_output, ME_rank);
        file results_file <fname> = write(finals) =>
        printf("Wrote final result to %s", fname) =>
        // printf("Results: %s", finals) =>
        v = make_void() =>
        c = false;
    }
    else
    {
        string param_array[] = split(params, ";");
        float results[];
        foreach p, j in param_array
        {
            results[j] = obj(param_names, 
              p, trials, "%i_%i_%i" % (ME_rank,i,j));
        }
        string rs[];
        foreach result, k in results
        {
            rs[k] = fromfloat(result);
        }
        string res = join(rs, ",");
	      EQPy_put(ME, res) => c = true;
    }
  }
}

// TODO
// Edit function arguments to include those passed from main function
// below
(void o) start (int ME_rank, int iters, int pop, 
               int num_variations, int random_seed) {
  location ME = locationFromRank(ME_rank);
  // TODO
  // Edit algo_params to include those required by the python
  // algorithm.
  // algo_params are the parameters used to initialize the
  // python algorithm. We pass these as a comma separated string.
  //  By default we are passing a random seed. String parameters
  // should be passed with a \"%s\" format string.
  // e.g. algo_params = "%d,%\"%s\"" % (random_seed, "ABC");
  algo_params = "%d,%d,%d,\"%s\"" % (iters, pop, random_seed, params_csv);
  EQPy_init_package(ME,"deap_ga") =>
  EQPy_get(ME) =>
  EQPy_put(ME, algo_params) =>
    loop(ME, ME_rank, num_variations) => {
      EQPy_stop(ME);
      o = propagate();
    }
}

// deletes the specified directory
app (void o) rm_dir(string dirname) {
  "rm" "-rf" dirname;
}

// call this to create any required directories
app (void o) make_dir(string dirname) {
  "mkdir" "-p" dirname;
}

app (void o) run_prerequisites() {
  "cp" (emews_root+"/complete_model/MessageCenter.log4j.properties") turbine_output;
}

main(){

  // TODO
  // Retrieve arguments to this script here
  // these are typically used for initializing the python algorithm
  // He we retrieve the number of variations (i.e. trials) for each
  // model run, and the random seed for the python algorithm.

  // Production   -ni=100 -nv=5 -np=100
  // Test         -ni=3 -nv=2 -np=3
  int num_iter = toint(argv("ni","100")); // -ni=100
  int num_variations = toint(argv("nv","5")); // -nv=5
  int num_pop = toint(argv("np","100")); // -np=100;
  int num_deap = toint(argv("nd","1")); // -nd=1
  int random_seed = toint(argv("r","0")); // e.g., -r=0 // 

  assert(num_deap > 0, "-nd > 0");
  
  // PYTHONPATH needs to be set for python code to be run
  assert(strlen(getenv("PYTHONPATH")) > 0, "Set PYTHONPATH!");
  assert(strlen(emews_root) > 0, "Set EMEWS_PROJECT_ROOT!");
    
  int ME_ranks[];
  foreach r_rank, i in r_ranks{
      ME_ranks[i] = toint(r_rank);
  }
  run_prerequisites() => {
    foreach ME_rank, i in ME_ranks {
      start(ME_rank, num_iter, num_pop, num_variations, random_seed) =>
      printf("End rank: %d", ME_rank);
    }
  }
}