import io;
import sys;
import files;
import location;

import zombies_model;

main {

	string param_file = argv("params"); // e.g. -params="model_params.txt" 
	
	string param_lines[] = file_lines(input(param_file));

	foreach s,i in param_lines {
		string z = @par=4 zombies_model_run("", param_lines[i]);
		printf("z: %s", z);     
	}

}
