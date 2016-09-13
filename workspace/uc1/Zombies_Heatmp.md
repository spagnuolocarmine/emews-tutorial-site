### Heatmap Example

```python
string make_heatmap =
"""
library(plyr)
library(ggplot2)
locs <- read.csv("%s/location_output.csv")
xy <- count(locs, c("X", "Y"))
plot <- ggplot(xy, aes(X,Y)) + 
  geom_raster(aes(fill = freq))
ggsave("%s/heat_map_%d.png", plot, width = 4, height = 4)
""";

string out_dir = strcat(tproot, "/output");
foreach s,i in upf_lines {
  ...
  (out,err) = rs_single_run(bashfile,i+1,instance_dir,
   sdr) => 
  {
    string heatmap_code = make_heatmap % (instance_dir, 
      out_dir, i);
    R(heatmap_code, "toString(0)");
  }
}
```

The final example in this section adds another step to the workflow in which a heat map of the Zombie and Human grid locations over the course 
of a run is created using an R script. For each model run a heat map will be created in a shared \T{output} directory. 
Each heat map image file name will contain an integer index indicating the run from which the heat map was produced.  \CODE{zombie_heatmap} 
shows the additions to our Swift script (full script at \url{https://goo.gl/0tznLW}). The \T{make\_heatmap} string variable (line 1) 
contains the templated R script that will create the heat map. The R script reads  location data from a model's \T{location\_output.csv} file (line 5), 
creates a frequency count for each X and Y coordinate (line 6), plots those counts as a heat map (line 7) and then saves the plot to an image file (line 9).  
As in \CODE{zombies_max_1} the R script is formatted (line 18) and invoked immediately after a model run completes (line 15). We do not need or expect a return 
value from the R script, but the Swift \T{R} function call requires one and so \T{toString(0)} is supplied. \joz{Can the empty string be returned here?}
