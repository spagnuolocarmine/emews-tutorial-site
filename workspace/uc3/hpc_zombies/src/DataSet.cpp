/*
 * DataSet.cpp
 *
 *  Created on: Apr 14, 2016
 *      Author: nick
 */

#include "DataSet.h"

namespace repast_io {


DataSet::DataSet() : rank {repast::RepastProcess::instance()->rank()}, recorders{}, sinks{}, ticks {}, open{false}
{}

DataSet::~DataSet() {
	close();
}


void DataSet::addRecorder(const std::shared_ptr<AbstractDataRecorder>& recorder) {
	recorders.push_back(recorder);
}

void DataSet::addSink(const std::shared_ptr<Sink>& sink) {
	sinks.push_back(sink);
}

void DataSet::record(double tick) {

	if (rank == 0)
		ticks.push_back(tick);

	for (auto& recorder : recorders) {
		recorder->record();
	}
}

void DataSet::close() {
	if (recorders.size() > 0 && recorders[0]->size() > 0) {
		write();
	}

	if (rank == 0) {
		for (auto& sink : sinks) {
			sink->close();
		}
	}
}

void DataSet::write() {
	if (!open) {
		if (rank == 0) {
			for (auto& sink : sinks) {
				sink->open(recorders);
			}
		}
		open = true;
	}

	size_t col_count = recorders.size() + 1;
	size_t total = col_count * ticks.size();
	std::vector<double> target(total, 0);

	if (rank == 0) {
		size_t idx = 0;
		for (auto t : ticks) {
			target[idx] = t;
			idx += col_count;
		}
	}

	size_t offset = 1;
	for (auto& recorder : recorders) {
		recorder->write(target, col_count, offset);
		++offset;
	}

	if (rank == 0) {
		for (auto& sink : sinks) {
			sink->write(target, col_count);
		}
	}
}

}



