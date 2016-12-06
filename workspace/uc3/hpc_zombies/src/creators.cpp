/*
 * creators.cpp
 *
 *  Created on: Apr 13, 2016
 *      Author: nick
 */

#include "creators.h"
#include "Zombie.h"
#include "Human.h"

ZombieCreator::ZombieCreator(double step_size) :
		step_size_ { step_size } {
}

Zombie* ZombieCreator::operator()(const repast::AgentId& id,
		repast::relogo::Observer* obs) {
	return new Zombie(id, obs, step_size_);
}

HumanCreator::HumanCreator(double step_size) :
		step_size_ { step_size } {
}
Human* HumanCreator::operator()(const repast::AgentId& id,
		repast::relogo::Observer* obs) {
	return new Human(id, obs, step_size_);
}

