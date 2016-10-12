import io;
import sys;
import files;

string tproot = getenv("T_PROJECT_ROOT");

app (file out, file err) rs_single_run (file shfile, int i, string outputdir, string scenario_dir_name)
{
    "bash" shfile i outputdir scenario_dir_name tproot @stdout=out @stderr=err;
}

app (void o) my_mkdir(string dirname) {
  "mkdir" "-p" dirname;
}

app (void o) cp_message_center() {
  "cp" (strcat(tproot,"/complete_model/MessageCenter.log4j.properties")) ".";
}

cp_message_center() => {
    // using swift, complete_model, experiments structure
    file bashfile = input_file(strcat(tproot,"/scripts/swiftrun_single_run.sh"));

    string upf_file_name = argv("f");
    // Scenario directory name
    string sdr = argv("sd","scenario.rs");
    string upf_lines[]  = file_lines(input(upf_file_name));
    foreach s,i in upf_lines {
        string instance_dir = strcat("instance_",fromint(i+1),"/");
    
        my_mkdir(instance_dir) =>
        {
            file out <strcat(instance_dir,"out.txt")>;
            file err <strcat(instance_dir,"err.txt")>;
            file upf <strcat(instance_dir,"upf.txt")> = write(s) =>
              (out,err) = rs_single_run(bashfile,i+1,instance_dir,sdr);
        }
    }
}
