import io;
import sys;
import files;
import location;
import string;
import WARQ;
import zombies_model;
import R_obj;

string tproot = getenv("T_PROJECT_ROOT");
string resident_work_ranks = getenv("RESIDENT_WORK_RANKS");
string r_ranks[] = split(resident_work_ranks,",");
string algorithm = tproot + "/R/algo.R";
string data_loc = tproot + "/data";
string all_zombie_data = read(input(data_loc + "/zombie_data.csv"));
string str_zombie_data = get_zombie_data(all_zombie_data);
printf("str_zombie_data: %s", str_zombie_data);
string grid_loc = data_loc + "/my_grid.Rds";
string config_file = argv("config","");

int num_clusters        = toint(argv("num_clusters"));
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

() print_time (string id) "turbine" "0.0" [
  "puts [concat \"@\" <<id>> \" time is: \" [clock milliseconds]]"
];

(string fitnesses) run_model(string params)
{
	string param_lines[] = split(params, ";");
	string zs[];
	foreach s,i in param_lines {
		string s_full = baseline_params + "\t" + s;
        // zombies model needs 4 processes
		string z = @par=4 zombies_model_run(config_file, s_full);
		string z_obj = calc_obj(z, str_zombie_data);
		zs[i] = z_obj;
		printf("z: %s", z);
		printf("z_obj: %s", z_obj);
	}
	fitnesses = string_join(zs,";");
}

(void o) al (int r_rank, int random_seed) {
    location loc = locationFromRank(r_rank);
    WARQ_init_script(loc, algorithm) =>
    string response = WARQ_get(loc) =>
    WARQ_put(loc, algo_params) =>
    doAL(loc,random_seed) => {
        WARQ_stop(loc);
        o = propagate();
    }
}

(void v) doAL (location loc, int random_seed) {

    for (boolean b = true, int i = 1;
       b;
       b=c, i = i + 1)
  {
    string next_params = WARQ_get(loc);
    printf("Iter %i next params: %s", i, next_params);
    boolean c;
    if (next_params == "FINAL")
    {
        string final_results = WARQ_get(loc);
        printf("Final results: %s", final_results) =>
        v = make_void() =>
        c = false;
    }
    else
    {
        string res = run_model(next_params);
	    WARQ_put(loc, res) => c = true => print_time(fromint(i));
    }
  }
}


printf("WORKFLOW!");

printf("algorithm: %s", algorithm);
al(toint(r_ranks[0]),0);
