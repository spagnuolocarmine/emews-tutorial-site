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
 * ZombieObserver.cpp
 *
 *  Created on: Sep 1, 2010
 *      Author: nick
 */
#include <sstream>

#include "relogo/RandomMove.h"
#include "relogo/grid_types.h"
#include "relogo/Patch.h"
#include "repast_hpc/AgentRequest.h"
#include "repast_hpc/SVDataSet.h"
#include "repast_hpc/SVDataSetBuilder.h"

#include "ZombieObserver.h"
#include "Human.h"
#include "Zombie.h"
#include "creators.h"
#include "DataSet.h"

using namespace std;
using namespace repast;
using namespace relogo;
using namespace repast_io;

const string HUMAN_COUNT_PROP = "human.count";
const string ZOMBIE_COUNT_PROP = "zombie.count";
const string HUMAN_STEP_SIZE = "human.step.size";
const string ZOMBIE_STEP_SIZE = "zombie.step.size";
const string OUTPUT_FILE = "output.file";
const string RUN_NUMBER = "run.number";

ZombieObserver::ZombieObserver() : zombieType{0}, humanType{0}, stats{0,0,0}, zombie_step_size{0}, data_set{},
		text_sink{nullptr}, props_ptr{nullptr} {}

ZombieObserver::~ZombieObserver() {
	data_set.close();
	props_ptr->putProperty(OUTPUT_KEY, text_sink->text());
}

void ZombieObserver::go() {
	synchronize<AgentPackage>(*this, *this, *this, RepastProcess::USE_LAST_OR_USE_CURRENT);

	AgentSet<Zombie> zombies;
	get(zombies);
	zombies.ask(&Zombie::step);

	//AgentId id(0,0,2);
	//Zombie* z = who<Zombie>(id);

	AgentSet<Human> humans;
	get(humans);
	humans.ask(&Human::step);

	zombies.clear();
	get(zombies);
	stats.zombie_count = zombies.size();

	humans.clear();
	get(humans);
	stats.human_count = humans.size();

	data_set.record(RepastProcess::instance()->getScheduleRunner().currentTick());
}

void ZombieObserver::setup(Properties& props) {
	// hack so we can use Properties to pass output
	// back to run.cpp
	props_ptr = &props;
	repast::Timer initTimer;
	initTimer.start();


	int humanCount = strToInt(props.getProperty(HUMAN_COUNT_PROP));
	double h_step_size = strToDouble(props.getProperty(HUMAN_STEP_SIZE));
	HumanCreator h_creator(h_step_size);
	humanType = create<Human>(humanCount, h_creator);

	int zombieCount = strToInt(props.getProperty(ZOMBIE_COUNT_PROP));
	zombie_step_size = strToDouble(props.getProperty(ZOMBIE_STEP_SIZE));
	ZombieCreator z_creator(zombie_step_size);
	zombieType = create<Zombie>(zombieCount, z_creator);

	AgentSet<Human> humans;
	get(humans);
	humans.apply(RandomMove(this));

	AgentSet<Zombie> zombies;
	get(zombies);
	zombies.apply(RandomMove(this));

	auto infection_count_source = make_shared<SimpleDataSource<int>>("infection_count", &stats.infection_count);
	data_set.addRecorder(make_shared<DataRecorder<plus<int>, int>>(infection_count_source));

	auto human_count_source = make_shared<SimpleDataSource<size_t>>("human_count", &stats.human_count);
	data_set.addRecorder(make_shared<DataRecorder<plus<size_t>, size_t>>(human_count_source));

	auto zombie_count_source = make_shared<SimpleDataSource<size_t>>("zombie_count", &stats.zombie_count);
	data_set.addRecorder(make_shared<DataRecorder<plus<size_t>, size_t>>(zombie_count_source));

	int run_number = stoi(props.getProperty(RUN_NUMBER));
	if (props.contains(OUTPUT_FILE)) {
		data_set.addSink(make_shared<FileSink>(run_number, props.getProperty(OUTPUT_FILE)));
	}
	text_sink = make_shared<TextSink>(run_number);
	data_set.addSink(text_sink);
}

RelogoAgent* ZombieObserver::createAgent(const AgentPackage& content) {
	if (content.type == zombieType) {
		return new Zombie(content.getId(), this, content.step_size);
	} else {
		return new Human(content.getId(), this, content);
	}
}

void ZombieObserver::provideContent(const repast::AgentRequest& request,
		std::vector<AgentPackage>& out) {
	const vector<AgentId>& ids = request.requestedAgents();
	for (int i = 0, n = ids.size(); i < n; i++) {
		AgentId id = ids[i];
		AgentPackage content = { id.id(), id.startingRank(), id.agentType(),
				id.currentRank(), 0, false };
		if (id.agentType() == humanType) {
			Human* human = who<Human>(id);
			content.infected = human->infected();
			content.infectionTime = human->infectionTime();
			content.step_size = human->stepSize();
		} else {
			Zombie* zombie = who<Zombie>(id);
			content.step_size = zombie->stepSize();
		}
		out.push_back(content);
	}
}

void ZombieObserver::provideContent(RelogoAgent* agent,
		std::vector<AgentPackage>& out) {
	AgentId id = agent->getId();
	AgentPackage content = { id.id(), id.startingRank(), id.agentType(),
			id.currentRank(), 0, false };
	if (id.agentType() == humanType) {
		Human* human = static_cast<Human*>(agent);
		content.infected = human->infected();
		content.infectionTime = human->infectionTime();
		content.step_size = human->stepSize();
	} else {
		Zombie* zombie = static_cast<Zombie*>(agent);
		content.step_size = zombie->stepSize();
	}
	out.push_back(content);
}

void ZombieObserver::createAgents(std::vector<AgentPackage>& contents,
		std::vector<RelogoAgent*>& out) {
	for (size_t i = 0, n = contents.size(); i < n; ++i) {
		AgentPackage content = contents[i];
		if (content.type == zombieType) {
			out.push_back(new Zombie(content.getId(), this, content.step_size));
		} else if (content.type == humanType) {
			out.push_back(new Human(content.getId(), this, content));
		} else {
			// its a patch.
			out.push_back(new Patch(content.getId(), this));
		}
	}
}

void ZombieObserver::updateAgent(AgentPackage package) {
	repast::AgentId id(package.id, package.proc, package.type);
	if (id.agentType() == humanType) {
		Human * human = who<Human>(id);
		human->set(package.infected, package.infectionTime);
	}
}
