import io;    import string;
import files; import R;
// -hline-
app (file o) _F_simulation_C__C_(int i) {
  "bash" "-c"
    ("RANDOM=%i; echo $RANDOM" % i)
    @stdout=o;
}

string results[];
foreach i in [0:9] {
  f = simulation(i);
  results[i] = read(f);
}

A = join(results, ",");
code = "m = mean(c(%s)))" % A;
mean = R(code, "toString(m)");
printf(mean);
