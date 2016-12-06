import io;
import sys;
import files;
import location;
import string;
import EQR;
import assert;
import zombies_model;
import R_obj;


string emews_root = getenv("EMEWS_PROJECT_ROOT");
string turbine_output = getenv("TURBINE_OUTPUT");
string resident_work_ranks = getenv("RESIDENT_WORK_RANKS");
string r_ranks[] = split(resident_work_ranks,",");

string algorithm = emews_root + "/R/algo.R";
string data_loc = emews_root + "/data";
string all_zombie_data = read(input(data_loc + "/zombie_data.csv"));
string str_zombie_data = get_zombie_data(all_zombie_data);
printf("str_zombie_data: %s", str_zombie_data);
string grid_loc = data_loc + "/my_grid.Rds";

string config_file = argv("config","");
int num_clusters = toint(argv("num_clusters"));
int num_random_sampling = toint(argv("num_random_sampling"));
int n = num_clusters + num_random_sampling;

string algo_params = """
  data_file = "%s",
  data_cols = 1:5,
  sse_threshold = 110000000,
  n = %i,
  num_folds = 3,
  max_iter = 2,
  # clustering thresholds
  low_thresh = 0.20,
  high_thresh = 0.80,
  num_clusters = %i,
  num_random_sampling = %i,
  target_metric = "accuracy",
  target_metric_value = 0.95,
  ntree = 20
""" % (grid_loc, n, num_clusters, num_random_sampling);

string baseline_params = read(input(data_loc + "/baseline_params.txt"));

(string fitness) obj(string param) {
    string full_parameters = baseline_params + "\t" + param;
    // zombies model needs 4 processes
    string z = @par=4 zombies_model_run(config_file, full_parameters);
    fitness = calc_obj(z, str_zombie_data);
    //printf("z: %s", z);
    printf("fitness: %s", fitness);
}

(void v) loop(location ME) {

    for (boolean b = true, int i = 1;
       b;
       b=c, i = i + 1)
  {
    string params =  EQR_get(ME);
    printf("Iter %i next params: %s", i, params);
    boolean c;
    if (params == "FINAL")
    {
      string final_results = EQR_get(ME);
      printf("Final results: %s", final_results) =>
      v = make_void() =>
      c = false;
    }
    else
    {
        string param_array[] = split(params, ";");
        string results[];
        foreach p, j in param_array
        {
            results[j] = obj(p);
        }

        string fitnesses = join(results, ";");
        EQR_put(ME, fitnesses) => c = true;

    }
  }
}

(void o) start(int ME_rank) {
    location ME = locationFromRank(ME_rank);
    EQR_init_script(ME, algorithm) =>
    EQR_get(ME) =>
    EQR_put(ME, algo_params) =>
    loop(ME) => {
        EQR_stop(ME) =>
        EQR_delete_R(ME);
        o = propagate();
    }
}

main() {

  assert(strlen(emews_root) > 0, "Set EMEWS_PROJECT_ROOT!");

  int ME_ranks[];
  foreach r_rank, i in r_ranks{
    ME_ranks[i] = toint(r_rank);
  }

  foreach ME_rank, i in ME_ranks {
    start(ME_rank) =>
    printf("End rank: %d", ME_rank);
  }
}
