/*
 * Sink.cpp
 *
 *  Created on: Apr 15, 2016
 *      Author: nick
 */
#include <sstream>

#include <boost/filesystem.hpp>

#include "Sink.h"
#include "file_utils.h"

namespace fs = boost::filesystem;

namespace repast_io {

TextSink::TextSink(int run_id) : text_{}, run_id_{run_id} {

}

TextSink::~TextSink() {

}

void TextSink::write(const std::vector<double>& data, size_t col_count) {
	std::stringstream ss;
	ss << text_;
	for (size_t i = 0, n = data.size(); i < n; i += col_count) {
		ss << run_id_;
		for (size_t j = 0; j < col_count; ++j) {
			 ss << "," << data[i + j];
		}

		// don't add line ending to last row
		if (i + col_count < n - 1) {
			ss << "\n";
		}
	}
	text_ = ss.str();
}

FileSink::FileSink(int run_id, const std::string& file_name) : run_id_{run_id}, out{}, open_{false},
		f_name{file_name} {

}

FileSink::~FileSink() {
	close();
}

void FileSink::open(const std::vector<ADR_Ptr>& sources) {
	if (open_) {
		throw std::logic_error("FileSink is already open");
	} else {
		std::string fname = unique_file_name(f_name);
		fs::path filepath(fname);
		if (!fs::exists(filepath.parent_path()))
			fs::create_directories(filepath.parent_path());
		out.open(filepath.string().c_str());
		open_ = true;

		out << "run_id,tick";
		for (auto source : sources) {
			out << "," << source->name();
		}
		out << "\n";
	}
}

void FileSink::write(const std::vector<double>& data, size_t col_count) {
	if (open_) {
		for (size_t i = 0, n = data.size(); i < n; i += col_count) {
			out << run_id_;
			for (size_t j = 0; j < col_count; ++j) {
				out << "," << data[i + j];
			}
			out << "\n";
		}
	} else {
		throw std::logic_error("Cannot write to an unopened FileSink");
	}
}

void FileSink::close() {
	if (open_) {
		out.flush();
		out.close();
		open_ = false;
	}
}

} /* namespace repast_io */
