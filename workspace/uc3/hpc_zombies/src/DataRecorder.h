
#ifndef DATARECORDER_H_
#define DATARECORDER_H_

#include <memory>
#include <vector>
#include <boost/mpi.hpp>

#include "repast_hpc/RepastProcess.h"

#include "DataSource.h"

namespace repast_io {

class AbstractDataRecorder {

public:
	AbstractDataRecorder() {}
	virtual ~AbstractDataRecorder() {}

	virtual void record() = 0;
	virtual void write(std::vector<double>& target, size_t col_count, size_t offset) = 0;

	virtual const std::string name() const = 0;
	virtual size_t size() const = 0;
};

/**
 * Records data from a DataSoure and performs some
 * reducing type operation on the data on multiple processes.
 */
template <typename Op, typename T>
class DataRecorder : public AbstractDataRecorder {

private:
	std::vector<T> data;
	std::shared_ptr<DataSource<T>> data_source_;
	int rank;

public:
	DataRecorder(const std::shared_ptr<DataSource<T>>& data_source);
	virtual ~DataRecorder();

	virtual void record() override;
	virtual void write(std::vector<double>& target, size_t col_count, size_t offset) override;

	const std::string name() const override {
		return data_source_->name();
	}

	/**
	 * Returns the amount of data currently recorded and not yet
	 * written by this DataRecorder.
	 */
	size_t size() const override {
		return data.size();
	}
};

template<typename Op, typename T>
DataRecorder<Op, T>::DataRecorder(const std::shared_ptr<DataSource<T>>& data_source) : AbstractDataRecorder{},
	data{}, data_source_{data_source}, rank{repast::RepastProcess::instance()->rank()} {
}

template<typename Op, typename T>
DataRecorder<Op, T>::~DataRecorder() {

}

template<typename Op, typename T>
void DataRecorder<Op, T>::record() {
	data.push_back(data_source_->getData());
}

template<typename Op, typename T>
void DataRecorder<Op, T>::write(std::vector<double>& target, size_t col_count, size_t offset) {
	boost::mpi::communicator* comm = repast::RepastProcess::instance()->getCommunicator();
	if (rank == 0) {
		size_t size = data.size();
		std::vector<T> var(size);
		reduce(*comm, &data[0], size, &var[0], Op{}, 0);
		size_t idx = 0;
		for (auto v : var) {
			target[idx + offset] = v;
			idx += col_count;
		}
	} else {
		reduce(*comm, &data[0], data.size(), Op{}, 0);
	}
	data.clear();
}

}

#endif /* DATARECORDER_H_ */
