import location;
pragma worktypedef resident_work;

@dispatch=resident_work
(void v) _void_py(string code) "turbine" "0.1.0"
    [ "turbine::python 1 <<code>>" ];
    
@dispatch=resident_work
(string output) _string_py(string code) "turbine" "0.1.0"
    [ "set <<output>> [ turbine::python 1 <<code>> ]" ];

string init_package_string = "import wapq\nimport %s\n" +
"import threading\n" +
"p = threading.Thread(target=%s.run)\np.start()\n\"\"";


(void v) WAPQ_init_package(location loc, string packageName){
#    printf("WAPQ_init_package called");
    string code = init_package_string % (packageName,packageName);
#    printf("Code is: \n%s", code);
    @location=loc _void_py(code) => v = propagate();
}

WAPQ_stop(location loc){
    // do nothing
}

string get_string = "result = wapq.output_q.get()\nresult";

(string result) WAPQ_get(location loc){
#    printf("WAPQ_get called");
    string code = get_string;
    result = @location=loc _string_py(code);
}

string put_string = """
wapq.input_q.put('%s')\n""
""";

(void v) WAPQ_put(location loc, string data){
#    printf("WAPQ_put called with: \n%s", data);
    string code = put_string % data;
#    printf("WAPQ_put code: \n%s", code);
    @location=loc _void_py(code) => v = propagate();
}   
