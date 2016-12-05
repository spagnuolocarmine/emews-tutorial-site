/*
 * Sink.h
 *
 *  Created on: Apr 15, 2016
 *      Author: nick
 */

#ifndef SRC_SINK_H_
#define SRC_SINK_H_

#include <vector>
#include <string>
#include <memory>
#include <fstream>

#include "DataRecorder.h"

namespace repast_io {

using ADR_Ptr = std::shared_ptr<AbstractDataRecorder>;

class Sink {

public:
	Sink() {}
	virtual ~Sink() {}
	virtual void open(const std::vector<ADR_Ptr>& sources) = 0;
	virtual void write(const std::vector<double>& data, size_t col_count) = 0;
	virtual void close() = 0;
};

class TextSink : public Sink {

private:
	std::string text_;
	int run_id_;

public:
	TextSink(int run_id);
	virtual ~TextSink();

	void open(const std::vector<ADR_Ptr>& sources) override {}
	void write(const std::vector<double>& data, size_t col_count) override;
	void close() override {}

	std::string text() {
		return text_;
	}
};

class FileSink : public Sink {

private:
	int run_id_;
	std::ofstream out;
	bool open_;
	std::string f_name;

public:
	FileSink(int run_id, const std::string& file_name);
	virtual ~FileSink();

	void open(const std::vector<ADR_Ptr>& sources) override;
	void write(const std::vector<double>& data, size_t col_count) override;
	void close() override;
};

} /* namespace repast_io */

#endif /* SRC_SINK_H_ */
