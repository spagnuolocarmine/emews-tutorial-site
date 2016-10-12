import io;
import sys;
import files;
import string;
import R;

string count_humans = ----
 last.row <- tail(read.csv("%s/counts.csv"), 1)
 res <- last.row['human_count']
----;

string find_max =  ----
v <- c(%s)
res <- which(v == max(v))
----;

string make_heatmap = ----
library(plyr)
library(ggplot2)
locs <- read.csv("%s/location_output.csv")
xy <- count(locs, c("X", "Y"))
plot <- ggplot(xy, aes(X,Y)) + geom_raster(aes(fill = freq))
ggsave("%s/heat_map_%d.png", plot, width = 4, height = 4)
----;

string tproot = getenv("T_PROJECT_ROOT");

app (file out, file err) repast (file shfile, string param_line, string outputdir)
{
    "bash" shfile param_line outputdir tproot @stdout=out @stderr=err;
}

app (void o) make_dir(string dirname) {
  "mkdir" "-p" dirname;
}

app (void o) cp_message_center() {
  "cp" (strcat(tproot,"/complete_model/MessageCenter.log4j.properties")) ".";
}

cp_message_center() => {
  file repast_sh = input(tproot+"/scripts/repast.sh");
  file upf = input(argv("f"));
  string upf_lines[] = file_lines(upf);
  
  string results[];
  string out_dir = tproot +  "/output";
  
  foreach s,i in upf_lines {
    string instance = "instance_%i/" % (i+1);
    make_dir(instance) => {
      file out <instance+"out.txt">;
      file err <instance+"err.txt">;
      (out,err) = repast(repast_sh, s, instance) => {
        string code = count_humans % instance;
        results[i] = R(code, "toString(res)");
        // make the heat map
        string heatmap_code = make_heatmap % (instance, out_dir, i);
        R(heatmap_code, "toString(0)");
      }
    }
  }
  
  string results_str = string_join(results, ",");
  string code = find_max % results_str;
  string max_idxs[] = split(R(code, "toString(res)"), ",");
  string best_params[];
  foreach s, i in max_idxs {
    int idx = toint(trim(s));
    best_params[i] = upf_lines[idx - 1];
  }
  file best_out <tproot + "/output/best_parameters.txt"> = 
    write(string_join(best_params, "\n"));
}
