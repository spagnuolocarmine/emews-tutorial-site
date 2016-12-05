my_func <- function(data_file, data_cols = 1:3, num_var = 2.1){
	toString(num_var + data_cols)
}
#require(stringr)
print("algorithm start!")
OUT_put("Params")
res <- IN_get()
#res <- str_trim(res)
#cat("res: ",res,"\n")
l <- eval(parse(text = paste0("list(",res,")")))
#str(l)
res2 <- do.call(my_func,l)
OUT_put(res2)
print("algorithm done.")
