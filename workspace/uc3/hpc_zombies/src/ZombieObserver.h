/*
 *   Repast for High Performance Computing (Repast HPC)
 *
 *   Copyright (c) 2010 Argonne National Laboratory
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with
 *   or without modification, are permitted provided that the following
 *   conditions are met:
 *
 *     Redistributions of source code must retain the above copyright notice,
 *     this list of conditions and the following disclaimer.
 *
 *     Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *
 *     Neither the name of the Argonne National Laboratory nor the names of its
 *     contributors may be used to endorse or promote products derived from
 *     this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 *   PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE TRUSTEES OR
 *   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 *   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 *   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 *   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 * ZombieObserver.h
 *
 *  Created on: Sep 1, 2010
 *      Author: nick
 */

#ifndef ZOMBIEOBSERVER_H_
#define ZOMBIEOBSERVER_H_

#include "relogo/Observer.h"
#include "repast_hpc/AgentRequest.h"
#include "repast_hpc/Properties.h"

#include "AgentPackage.h"
#include "DataSet.h"

const std::string OUTPUT_KEY = "__output__";

struct Stats {
	int infection_count;
	size_t human_count, zombie_count;
};

class ZombieObserver : public repast::relogo::Observer {

private:
	int zombieType, humanType;
	Stats stats;
	double zombie_step_size;
	repast_io::DataSet data_set;
	std::shared_ptr<repast_io::TextSink> text_sink;
	repast::Properties* props_ptr;

public:
	ZombieObserver();
	virtual ~ZombieObserver();

	void go();
	virtual void setup(repast::Properties& props); // NOTE: 'virtual' needed by some compilers

	// create and provide for agents moving between processes
	repast::relogo::RelogoAgent* createAgent(const AgentPackage& content);
	void provideContent(const repast::AgentRequest& request, std::vector<AgentPackage>& out);

	// create and provide for buffer sync
	void createAgents(std::vector<AgentPackage>& content, std::vector<repast::relogo::RelogoAgent*>& out);
	void provideContent(repast::relogo::RelogoAgent* agent, std::vector<AgentPackage>& out);

	void updateAgent(AgentPackage package);

	void incrementInfectionCount() {
		stats.infection_count++;
	}

	double zombieStepSize() const {
		return zombie_step_size;
	}
};

#endif /* ZOMBIEOBSERVER_H_ */
