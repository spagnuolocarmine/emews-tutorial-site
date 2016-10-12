import R;

// R function to read from counts.csv
//  and return the total number of humans left
string count_humans = ----
 last.row <- tail(read.csv("%s/counts.csv"), 1)
 res <- last.row['human_count']
----;

(float result) calc_obj (string instance_dir)
{
    code = count_humans % instance_dir;
    str_res = R(code,"toString(res)");
    result = tofloat(str_res);
}


global const string create_upfs_template = 
"""
create_upfs <- function(params_file,params_string,params_values,stoch_variations){
  suppressMessages(require(xml2))
  p_params <- read_xml(params_file)
  params_children <- xml_find_all(p_params,"//parameter")
  all_params_names <- sapply(params_children,xml_attr,"name")
  all_params_values <- sapply(params_children,xml_attr,"defaultValue")
  names(all_params_values) <- all_params_names
  
  local_param_names <- unlist(strsplit(params_string,split = ","))
  local_param_values <- unlist(strsplit(params_values,split = ","))
  all_params_values[local_param_names] <- local_param_values
  bodies <- sapply(0:(stoch_variations-1), function(x){
    all_params_values["randomSeed"] <- x
    paste(names(all_params_values),all_params_values,sep = "\t", collapse = ",")
  })
  paste("1",bodies,sep = "\t",collapse = ";")
}

upfs_res <- create_upfs("%s","%s","%s",%s)
""";

(string result) create_upfs (string params_file_path, string params_string, string params_values, int stoch_variations)
{
    code = create_upfs_template % (params_file_path, params_string, params_values, fromint(stoch_variations));
    result = R(code,"upfs_res");
}