import R;

// R function to calculate sse from zombies model full output
global const string template =
"""
colnum <- 4
data <- read.csv(text = "%s", header = F)

zombie_data <- as.numeric(unlist(strsplit( "%s", split = ",")))
res <- sum( (data[-1,colnum] - zombie_data)^2)
""";

(string result) calc_obj (string sim_data, string zombie_data)
{
    string code = template % (sim_data, zombie_data);
    result = R(code,"toString(res)");
}


global const string zombie_template =
"""
col_num <- 2
data <- read.csv(text = "%s")
res1 <- data[,col_num]
res <- paste(res1,collapse = ",")
""";

(string result) get_zombie_data(string all_zombie_data){
    string code = zombie_template % all_zombie_data;
    result = R(code,"toString(res)");
}
