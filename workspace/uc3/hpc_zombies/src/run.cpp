/*
 * run.cpp
 *
 *  Created on: Dec 2, 2014
 *      Author: nick
 */
#include <exception>

#include "repast_hpc/io.h"
#include "repast_hpc/RepastProcess.h"
#include "repast_hpc/initialize_random.h"
#include "relogo/SimulationRunner.h"
#include "relogo/Patch.h"

#include "boost/tokenizer.hpp"
#include "boost/algorithm/string.hpp"

#include "ZombieObserver.h"

using namespace repast;
using namespace std;

const std::string STOP_AT = "stop.at";

void parse_parameters(repast::Properties& props,
		const std::string& parameters) {

	boost::char_separator<char> tab_sep("\t");
	boost::tokenizer<boost::char_separator<char> > tab_tok(parameters, tab_sep);

	for (auto item : tab_tok) {
		boost::trim(item);
		size_t pos = item.find_first_of("=");
		if (pos == std::string::npos) {
			throw invalid_argument("Invalid parameter: " + item);
		}

		string key(item.substr(0, pos));
		boost::trim(key);
		if (key.length() == 0) {
			throw invalid_argument("Invalid parameter: " + item);
		}

		string val(item.substr(pos + 1, item.length()));
		boost::trim(val);
		if (val.length() == 0) {
			throw invalid_argument("Invalid parameter: " + item);
		}
		props.putProperty(key, val);
		//std::cout << key << " = " << (val) << std::endl;
	}
}

std::string run_model(Properties& props, boost::mpi::communicator& world) {

	try {
		repast::relogo::SimulationRunner runner(&world);

		if (world.rank() == 0) {
			std::string time;
			repast::timestamp(time);
			std::cout << "Start Time: " << time << std::endl;
		}

		repast::Timer timer;
		timer.start();
		runner.run<ZombieObserver, repast::relogo::Patch>(props);

		if (world.rank() == 0) {
			std::string time;
			repast::timestamp(time);
			std::cout << "End Time: " << time << "\nElapsed Time: "
					<< timer.stop() << std::endl;
		}

	} catch (std::exception& exp) {
		// catch any exception (e.g. if data files couldn't be opened) and
		// print out the errors.
		std::cerr << "ERROR: " << exp.what() << std::endl;
	}
	return props.getProperty(OUTPUT_KEY);
}

/**
 * Runs the model using the specified configuration file and parameters.
 *
 * @param config the repast hpc configuration file
 * @param parameters a tab separated list of parameters where each parameter
 * is a key value pair separated by an "=".
 *
 * @return a array of doubles. The first is the mse, followed by the
 * per week data.
 */
// should be run from swift via an @location
std::string zombies_model_run(MPI_Comm comm, const std::string& config,
		const std::string& parameters) {
	char arg0[] = "main";
	char* argv[] = { &arg0[0], nullptr };
	int argc = (int) (sizeof(argv) / sizeof(argv[0])) - 1;
	// need the tmp in here because environment takes a reference
	char** tmp = &argv[0];
	boost::mpi::environment env(argc, tmp);

	boost::mpi::communicator boost_comm(comm, boost::mpi::comm_attach);

	repast::Properties props;
	parse_parameters(props, parameters);

	//std::cout << rank << ": " << props.getProperty("incubation.duration.max") << std::endl;
	repast::RepastProcess::init(config, &boost_comm);
	std::string result = run_model(props, boost_comm);
	repast::RepastProcess::instance()->done();
	return result;
}

