app (file o) _F_gcc_C__C_(file c, string optz) {
  "gcc" "-c" "-o" o optz c;
}
app (file x) _F_link_C__C_(file o) {
  "gcc" "-o" x o;
}
file c        = input("f.c");
file o<"f.o"> = gcc(c, "-O3");
file x<"f">   = link(o);
