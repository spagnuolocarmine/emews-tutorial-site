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
import WAPQ;

string tproot = getenv("T_PROJECT_ROOT");
string params_csv = tproot+"/data/params_for_deap.csv";
string parameters_path = tproot+"/complete_model/scenario.rs/parameters.xml";
string resident_work_ranks = getenv("RESIDENT_WORK_RANKS");
string r_ranks[] = split(resident_work_ranks,",");

@suppress=unused_output
app (file so, file se) run_sim(string param_line, string instance_dir)
{
    (tproot+"/scripts/rs_single_run.sh") param_line instance_dir tproot;
}


@suppress=unused_output
(float result) run_obj(string param_line, string id_suffix)
{
    // make instance dir 
    string instance_dir = "instance_"+id_suffix;
    make_dir(instance_dir) => {
        run_sim(param_line,instance_dir) => 
        // Imported from R_obj.swift
        result = calc_obj(instance_dir) =>
        rm_dir(instance_dir);
    } 
    
}

(float sum_result) obj(string params, string vs, int trials, string iter_indiv_id, string upref) {
    float fresults[];
    string upfs = create_upfs(parameters_path, params, vs, trials) => {
        string fs[] = split(upfs, ";");
        foreach f,i in fs {
            string id_suffix = "%s_%i" % (iter_indiv_id,i);
            fresults[i] = run_obj(f, id_suffix); 
        }
    }
    sum_result = avg(fresults);
}

(void o) deap (int ME_rank, int iters, int pop, 
               int trials, int seed) {
    location ME = locationFromRank(ME_rank);
    algo_params = "%d,%d,%d,\"%s\"" %
     (iters, pop, seed, params_csv);
    WAPQ_init_package(ME,"deap_ga") =>
      WAPQ_get(ME) =>
      WAPQ_put(ME, algo_params) =>
      doDEAP(ME, ME_rank, trials) => {
        WAPQ_stop(ME);
        o = propagate();
    }
}

(void v) doDEAP (location ME, int ME_rank, int trials) {
    string param_names = 
    "zombie_step_size,human_step_size," + 
    "zombie_count,human_count";

    for (boolean b = true, int i = 1; 
       b;                             
       b=c, i = i + 1)                
  {
    string params =  WAPQ_get(ME);
    boolean c;
    if (params == "FINAL")
    {
        string finals =  WAPQ_get(ME);
        printf("Results: %s", finals) =>
        v = make_void() =>
        c = false;
    }
    else
    {
        string pop[] = split(params, ";");
        float fitnesses[];
        foreach p, j in pop
        {
            fitnesses[j] = obj(param_names, 
            p, trials,
            "%i_%i_%i" % (ME_rank,i,j),
            "deap_ga");
        }
        string rs[];
        foreach fitness, k in fitnesses
        {
            rs[k] = fromfloat(fitness);
        }
        string res = join(rs, ",");
	    WAPQ_put(ME, res) => c = true;
    }
  }
}


app (void o) make_dir(string dirname) {
  "mkdir" "-p" dirname;
}

app (void o) rm_dir(string dirname) {
  "rm" "-rf" dirname;
}

app (void o) cp_message_center() {
  "cp" (tproot+"/complete_model/MessageCenter.log4j.properties") ".";
}

main(){
    // Production   -ni=100 -nv=5 -np=100
    // Test         -ni=3 -nv=2 -np=3
    int num_iter = toint(argv("ni","100")); // -ni=100
    int num_variations = toint(argv("nv","5")); // -nv=5
    int num_pop = toint(argv("np","100")); // -np=100;
    int num_deap = toint(argv("nd","1")); // -nd=1
    assert(num_deap > 0, "-nd > 0");
    assert(strlen(getenv("PYTHONPATH")) > 0, "Set PYTHONPATH!");
    assert(strlen(tproot) > 0, "Set T_PROJECT_ROOT!");
    int random_seed = toint(argv("r","0")); // e.g., -r=0 // 
    int ME_ranks[];
    foreach r_rank, i in r_ranks{
        ME_ranks[i] = toint(r_rank);
    }
    cp_message_center() => {
        foreach ME_rank, i in ME_ranks
        {
            deap(ME_rank,num_iter,num_pop,num_variations,random_seed) =>
            printf("End rank: %d", ME_rank);
        }
    }
}