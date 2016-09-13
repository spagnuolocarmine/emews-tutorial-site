/*
 * creators.h
 *
 *  Created on: Apr 13, 2016
 *      Author: nick
 */

#ifndef SRC_CREATORS_H_
#define SRC_CREATORS_H_

#include "relogo/Observer.h"

class Human;
class Zombie;

class ZombieCreator {
	double step_size_;

public:
	ZombieCreator(double step_size);
	Zombie* operator()(const repast::AgentId& id, repast::relogo::Observer* obs);
};

class HumanCreator {
private:

	double step_size_;

public:
	HumanCreator(double step_size);
	Human* operator()(const repast::AgentId& id, repast::relogo::Observer* obs);
};




#endif /* SRC_CREATORS_H_ */
