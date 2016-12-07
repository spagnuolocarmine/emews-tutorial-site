require(caret)
require(stats)
require(randomForest)
require(data.table)

# Utility code to transform elements to strings and vice versa
row_to_upf <- function(x,data_names){
  paste0(data_names," = ",x,collapse = "\t")
}

# Modified to apply elements to string over rows of data frame
rows_to_upfs <- function(x,data_names){
  paste0(apply(x,1,row_to_upf, data_names = data_names),
         collapse = ';')
}

# scaling, matrix or df x
create_scaled_ev_df <- function(x){
  sx <- scale(x)
  scaling <- attr(sx,"scaled:scale")
  centering <- attr(sx,"scaled:center")
  scaled.df <- data.frame(sx,ev = F, cl = NA)
  list(scaled.df = scaled.df, scaling = scaling,
       centering = centering)
}


# 2 class classification
# 2x2 confusion matrix
get_accuracy_precision_recall_fscore <- function(confusion,positive){
  p_i = which(colnames(confusion) == positive)

  total <- sum(confusion)
  tp <- confusion[p_i,p_i]
  tn <- confusion[-p_i,-p_i]
  fp <- confusion[p_i,-p_i]
  fn <- confusion[-p_i,p_i]

  accuracy <- (tp + tn) / total
  precision <- tp / (tp + fp)
  recall <- tp / (tp + fn)
  f1_score <- 2 * precision * recall / (precision + recall)
  list(accuracy = accuracy, precision = precision, recall = recall, fscore = f1_score)
}

# summary statistics
aprfSummary <- function(data, lev = NULL, model = NULL){
  cf <- confusionMatrix(data[,"pred"], data[,"obs"])
  unlist(get_accuracy_precision_recall_fscore(as.matrix(cf),lev[2]))
}

# main active learning function
main_function <- function(data_file,
                          data_cols = 1:4,
                          sse_threshold = 1000,
                          n = 100,
                          num_folds = 3,
                          max_iter = 20,
                          # clustering thresholds
                          low_thresh = 0.20,
                          high_thresh = 0.80,
                          num_clusters = 200,
                          num_random_sampling = 20,
                          target_metric = "accuracy",
                          target_metric_value = 0.99,
                          ntree = 20){
  synth_data <<- readRDS(data_file)
  data_cols <<- data_cols
  df <- synth_data[data_cols]
  res <- create_scaled_ev_df(df)
  sdf <- res$scaled.df
  data_names <- colnames(df)

  sdf.sample_is <- sample(which(!sdf$ev),n)

  # first set of sampled parameters from original unscaled data
  p1 <- df[sdf.sample_is,]

  # upf representation of parameters
  sp1 <- rows_to_upfs(p1,data_names)

  # EQ/R calls
  OUT_put(sp1)
  sr1 = IN_get()

  # result list of vectors (in this case the vectors are of length 1)
  r1 <- as.numeric(unlist(strsplit(sr1,";")))

  # use the results from r1 to map sdf$cl column to X0 and X1 class labels
  sdf[sdf.sample_is,"cl"] <- ifelse(r1 < sse_threshold,"X1","X0")
  # mark sdf$ev columns to TRUE
  sdf[sdf.sample_is,"ev"] <- TRUE
  if (length(unique(sdf[sdf.sample_is,"cl"]))==1){
	OUT_put("FINAL")
	OUT_put("Error: only found 1 class from random sampling, try sampling more or changing threshold")
	return("ending early")
  }
  sdf.ev_is <- which(sdf$ev)
  train_control <- trainControl(method="repeatedcv", number=10, repeats = 1, sampling = "up",
                                classProbs = T, summaryFunction = aprfSummary)
  stat_names <- c("accuracy","precision","recall","fscore")
  stat_sd_names <- paste0(stat_names,"SD")
  model <- train(x = sdf[sdf.ev_is,data_cols], y = make.names(factor(sdf$cl[sdf.ev_is])),
                 trControl=train_control, tuneGrid = data.frame(mtry = 3),
                 method="rf", ntree=ntree, metric = "accuracy")

  # iteration variable
  iter <- 0

  # data accumulators
  cv_means = vector("list", max_iter + 1)
  cv_sds = vector("list", max_iter + 1)
  #act_scores = vector("list", max_iter + 1)
  # CV data input
  cv_means[[iter + 1]] <- c(iter = iter, model$results[stat_names])
  cv_sds[[iter + 1]] <- c(iter = iter, model$results[stat_sd_names])
  # Predict on all of P_unev
  sdf.unev_is <- which(!sdf$ev)
  pred <- predict(model,newdata = sdf[sdf.unev_is,data_cols], type = "raw")

  while(iter < max_iter & model$results[target_metric] < target_metric_value){
    iter <- iter + 1
    unev_prob <- predict(model,newdata = sdf[sdf.unev_is,data_cols], type = "prob")
    # find unevaluated points close to 0.5
    unev.c_is <- which(unev_prob[,1]>=low_thresh & unev_prob[,1]<=high_thresh)
    # select cluster points
    if (length(unev.c_is) > num_clusters){
      # cluster (using kmeans) iter.max set at same as sklearn k_means default
      fit <- kmeans(sdf[sdf.unev_is[unev.c_is],data_cols], num_clusters, iter.max = 300)
      # data table with cluster id and proximity to 0.5 for the prediction
      dt <- data.table(clus = fit$cluster,adj_res = abs(0.5-unev_prob[unev.c_is,1]))
      # use dt to rank by clus and which to pick out the best (closest to 0) indices
      # out of the unev.c_is indices
      unev.c_is = unev.c_is[which(dt[, .(rank = frank(-adj_res,ties.method = "random")),clus][,rank]== 1)]
    }
    # indices of cluster points wrt sdf
    sdf.c_is <- sdf.unev_is[unev.c_is]
    # select candidate random sample points
    if (length(sdf.c_is) > 0 ){
      sdf.crs_is <- sdf.unev_is[-unev.c_is]
    } else {
      sdf.crs_is <- sdf.unev_is
    }
    stopifnot(all(sdf$ev[sdf.crs_is]==F))
    # choose random sample points
    sdf.rs_is <- sample(sdf.crs_is,num_random_sampling)

    sdf.all_samples_is <- c(sdf.c_is,sdf.rs_is)
    # params from original unscaled data
    params <- df[sdf.all_samples_is,]

    # upf representation of parameters
    string_params <- rows_to_upfs(params,data_names)
    # EQ/R calls
    OUT_put(string_params)
    string_results = IN_get()

    # results
    results <- as.numeric(unlist(strsplit(string_results,";")))

    sdf[sdf.all_samples_is,"cl"] <- ifelse(results < sse_threshold,"X1","X0")
    # mark sdf$ev columns to TRUE
    sdf[sdf.all_samples_is,"ev"] <- TRUE

    # update ev and unev indices
    sdf.ev_is <- which(sdf$ev)
    sdf.unev_is <- which(!sdf$ev)

    # Cross validate currently evaluated points
    model <- train(x = sdf[sdf.ev_is,data_cols], y = make.names(factor(sdf$cl[sdf.ev_is])),
                    trControl=train_control, tuneGrid = data.frame(mtry = 3),
                    method="rf", ntree=ntree, metric = "accuracy")

    cat("Iteration",iter,"\n")
    cat("CV scores:\n")
    print(unlist(model$results[stat_names]))
    cv_means[[iter + 1]] <- c(iter = iter, model$results[stat_names])
    cv_sds[[iter + 1]] <- c(iter = iter, model$results[stat_sd_names])

    pred <- predict(model,newdata = sdf[sdf.unev_is,data_cols], type = "raw")
  }

  # record classification
  sdf[sdf.unev_is,"cl"] <- as.character(pred)
  # record probability
  unev_prob <- predict(model,newdata = sdf[sdf.unev_is,data_cols], type = "prob")
  sdf[sdf.ev_is,"prob"] <- 1
  pred.c1_is <- which(pred == "X1")
  pred.c0_is <- which(pred == "X0")
  sdf[sdf.unev_is[pred.c0_is],"prob"] <- unev_prob[pred.c0_is,"X0"]
  sdf[sdf.unev_is[pred.c1_is],"prob"] <- unev_prob[pred.c1_is,"X1"]
  stopifnot(all(unev_prob[pred.c0_is,"X0"] >= 0.5))
  stopifnot(all(unev_prob[pred.c1_is,"X1"] >= 0.5))
  # add ev, cl and prob columns to original unscaled data
  df[c("ev","cl","prob")] = sdf[c("ev","cl","prob")]
  saveRDS(df, file="df.Rds")

  dt_cv_means <- data.table::rbindlist(cv_means)
  dt_cv_sds <- data.table::rbindlist(cv_sds)

  list(df = df, dt_cv_means = dt_cv_means, dt_cv_sds = dt_cv_sds)
}

# ask for parameters from queue
OUT_put("Params")
res <- IN_get()

l <- eval(parse(text = paste0("list(",res,")")))
res2 <- do.call(main_function,l)
OUT_put("FINAL")

OUT_put("Look at df.Rds for final model")
print("algorithm done.")
