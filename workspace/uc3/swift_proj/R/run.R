# File used to run the R_AL example using the code.R and testing with tests.R
require(testthat)
## Example 1, using sepsis data
source("code.R")
test_file("tests.R")
data_file <- "../data/outcomes_8800.csv"
data_cols <- 1:4
header <- T
data_mapper <- function(x) ifelse(x %in% c(0,1,3), "X0", "X1")
df <- main_function(data_file,data_cols,header,data_mapper,
                    target_metric = "accuracy", target_metric_value = 0.96)

## Example 2, using synthetic data
# optional for parallel
library(doMC)
registerDoMC(cores = 4)
# main code
source("code.R")
test_file("tests.R")
data_file <- "../data/Dim4_DimSize15_NumCR1_Vol01_1.dat"
data_cols <- 1:4
header <- F
data_mapper <- function(x) ifelse(x == 0, "X0", "X1")
mf2_fds_20 <- main_function(data_file, data_cols, header, num_folds = 10,
                            data_mapper, n = 1000,
                            num_clusters = 600,
                            num_random_sampling = 600, ntree = 20, max_iter = 20)