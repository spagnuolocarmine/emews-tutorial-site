
test_that("create_scaled_ev_df works",{
  x <- data.frame(runif(10,0,5),runif(10,-2,9))
  res <- create_scaled_ev_df(x)
  sdf <- res$scaled.df
  # mean values for each column are 0
  expect_equal(mean(sdf[[1]]),0,tolerance = 0.001)
  expect_equal(mean(sdf[[2]]),0,tolerance = 0.001)
  expect_true(all(is.na(sdf$cl)))
  expect_true(all(!sdf$ev))
})

test_that("get_accuracy_precision_recall_fscore works",{
  x <- matrix(c(1,2,3,4),ncol = 2)
  rownames(x) <- c("0","1")
  colnames(x) <- c("0","1")
  
  res <- get_accuracy_precision_recall_fscore(x,"0")
  expect_equal(res$accuracy,5/10)
  expect_equal(res$precision,1/4)
  expect_equal(res$recall,1/3)
  expect_equal(res$fscore,2/7)
  
  res <- get_accuracy_precision_recall_fscore(x,"1")
  expect_equal(res$accuracy,5/10)
  expect_equal(res$precision,4/6)
  expect_equal(res$recall,4/7)
  expect_equal(res$fscore,32/52)
})

# test_that("rf_cv works",{
#   x <- data.frame(runif(1000,0,5),runif(1000,-2,9))
#   res <- create_scaled_ev_df(x)
#   sdf <- res$scaled.df
#   sdf["cl"] <- c(0,1)
#   sdf["ev"] <- TRUE
#   cv_results <- rf_cv(sdf,num_folds = 3,data_cols = 1:2)
#   expect_equal(length(cv_results),2)
#   expect_equal(length(cv_results$cv_means),4)
#   #print(cv_results$cv_means)
#   expect_equal(length(cv_results$cv_sds),4)
#   #print(cv_results$cv_sds)
# })

test_that("OUT_put_IN_get works",{
  synth_data <<- data.frame(c(1,1,1),c(1,2,1),c(1,3,4),c(1,4,11),c(0,0,1))
  data_cols <<- 1:4
  output <- "1,2,3,4;1,1,4,11"
  expected_input <- "0;1"
  result <- OUT_put_IN_get(output)
  expect_equal(result,expected_input)
})

test_that("data mapping works",{
  synth_data <<- data.frame(c(1,1,1),c(1,2,1),c(1,3,4),c(1,4,11),c(0,2,3))
  data_cols <<- 1:4
  data_mapper <- function(x) ifelse(x %in% c(0,1,3), 0, 1)
  apply_data_mapping(data_mapper)
  expect_equivalent(unlist(synth_data[-data_cols]),c(0,1,0))
})

# test_that("create_balanced_train_is works",{
#   # reps to ensure repeated success
#   reps <- 10
#   for (i in 1:reps){
#     # 0 minority
#     sdf <- data.frame(ev = rep(c(T,F), each = 20), cl = rep(c(0,0,0,1,1,1,1,1,1,1), times = 4))
#     sdf.train_is <- which(sdf$ev)
#     expect_equal(1:20,sdf.train_is)
#   
#     sdf.balanced_train_is <- create_balanced_train_is(sdf, sdf.train_is)
#     cls <- sdf[sdf.balanced_train_is,"cl"]
#     v <- as.vector(table(cls))
#     expect_equal(v[1],v[2])
#     expect_equal(v[1], 14)
#     # want to make sure that all original points are represented 
#     expect_equal(length(unique(sdf.balanced_train_is)),20)
#     
#     # 1 minority
#     sdf <- data.frame(ev = rep(c(T,F), each = 20), cl = rep(c(0,0,0,0,0,0,1,1,1,1), times = 4))
#     sdf.train_is <- which(sdf$ev)
#     expect_equal(1:20,sdf.train_is)
#     
#     sdf.balanced_train_is <- create_balanced_train_is(sdf, sdf.train_is)
#     cls <- sdf[sdf.balanced_train_is,"cl"]
#     v <- as.vector(table(cls))
#     expect_equal(v[1],v[2])
#     expect_equal(v[1], 12)
#     # want to make sure that all original points are represented 
#     expect_equal(length(unique(sdf.balanced_train_is)),20)
#   }
# })

# test_that("create_balanced_train_data_upSample works",{
#   # reps to ensure repeated success
#   reps <- 1
#   for (i in 1:reps){
#     # 0 minority
#     sdf <- data.frame(ev = rep(c(T,F), each = 20), cl = rep(c(0,0,0,1,1,1,1,1,1,1), times = 4))
#     sdf.train_is <- which(sdf$ev)
#     expect_equal(1:20,sdf.train_is)
#     sdf$data <- seq_len(nrow(sdf))
#     balanced_train_data <- create_balanced_train_data_upSample(sdf$data[sdf.train_is],
#                                                                factor(sdf$cl[sdf.train_is]))
#     cls <- balanced_train_data$cl
#     v <- as.vector(table(cls))
#     expect_equal(v[1],v[2])
#     expect_equal(v[1], 14)
#     # want to make sure that all original points are represented
#     expect_equal(length(unique(balanced_train_data$x)),20)
#     
#     # 1 minority
#     sdf <- data.frame(ev = rep(c(T,F), each = 20), cl = rep(c(0,0,0,0,0,0,1,1,1,1), times = 4))
#     sdf.train_is <- which(sdf$ev)
#     expect_equal(1:20,sdf.train_is)
#     sdf$data <- seq_len(nrow(sdf))
#     balanced_train_data <- create_balanced_train_data_upSample(sdf$data[sdf.train_is],
#                                                                factor(sdf$cl[sdf.train_is]))
#     cls <- balanced_train_data$cl
#     v <- as.vector(table(cls))
#     expect_equal(v[1],v[2])
#     expect_equal(v[1], 12)
#     # want to make sure that all original points are represented 
#     expect_equal(length(unique(balanced_train_data$x)),20)
#   }
# })