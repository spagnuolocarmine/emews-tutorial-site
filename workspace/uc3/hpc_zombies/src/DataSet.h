/*
 * DataSet.h
 *
 *  Created on: Mar 2, 2016
 *      Author: nick
 */

#ifndef SRC_DATASET_H_
#define SRC_DATASET_H_


#include "H5Cpp.h"

#include "DataSource.h"
#include "DataRecorder.h"
#include "Sink.h"
#include "file_utils.h"

namespace repast_io {

class DataSet {

private:
	int rank;
	std::vector<std::shared_ptr<AbstractDataRecorder>> recorders;
	std::vector<std::shared_ptr<Sink>> sinks;
	std::vector<double> ticks;
	bool open;

public:
	DataSet();
	~DataSet();

	void record(double tick);
	void write();
	void addRecorder(const std::shared_ptr<AbstractDataRecorder>& recorder);
	void addSink(const std::shared_ptr<Sink>& sink);
	void close();
};



} /* namespace repast_io */

#endif /* SRC_DATASET_H_ */
