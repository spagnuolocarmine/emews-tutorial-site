
/**
 * Run with mpirun -n 4
 */
#include <memory>
#include <functional>

#include "boost/filesystem.hpp"
#include "gtest/gtest.h"

#include "DataRecorder.h"
#include "DataSource.h"
#include "DataSet.h"


using namespace repast_io;
using namespace std;

using SDSI = SimpleDataSource<int>;
using SDSD = SimpleDataSource<double>;
using DRI = DataRecorder<std::plus<int>, int>;
using DRD = DataRecorder<std::plus<double>, double>;
using DRI_PTR = std::shared_ptr<DataRecorder<std::plus<int>, int>>;
using DRD_PTR = std::shared_ptr<DataRecorder<std::plus<double>, double>>;

namespace fs = boost::filesystem;

struct VectorSink : public Sink {

	std::vector<double> data;

	VectorSink() : Sink{}, data{} {}
	~VectorSink() {}

	void write(const std::vector<double>& vec, size_t col_count) override {
		data.assign(vec.begin(), vec.end());
	}
	void open(const std::vector<ADR_Ptr>& sources) {}
	void close() {}
};

TEST(DataRecording, test_data_recorder) {
	int rank = repast::RepastProcess::instance()->rank();
	int v = 1;
	std::shared_ptr<SDSI> source = std::make_shared <SDSI> ("source_1", &v);
	DRI recorder(source);
	// with world size of 4, this should give us vector of
	// 4, 7, 7, 7
	for (int i = 0; i < 4; ++i) {
		if (i == 1 && rank == 2) {
			v = 4;
		}
		recorder.record();
	}

	std::vector<double> data(4);
	recorder.write(data, 1, 0);
	if (rank == 0) {
		int expected[] = { 4, 7, 7, 7 };
		int i = 0;
		for (int v : data) {
			ASSERT_EQ(expected[i++], v);
		}
	}

}

void create_DataSet(DataSet& ds, int& v, double& j) {
	std::shared_ptr<SDSI> source = std::make_shared <SDSI> ("source_1", &v);
	DRI_PTR rec_1 = std::make_shared<DRI>(source);
	ds.addRecorder(rec_1);

	std::shared_ptr<SDSD> source2 = std::make_shared <SDSD> ("source_2", &j);
	DRD_PTR rec_2 = std::make_shared<DRD>(source2);
	ds.addRecorder(rec_2);
}

TEST(DataRecording, test_data_set) {
	int rank = repast::RepastProcess::instance()->rank();
	DataSet ds;
	int v = 1;
	double j = 1.5;
	create_DataSet(ds, v, j);

	shared_ptr<VectorSink> sink = make_shared<VectorSink>();
	ds.addSink(sink);


	// with world size of 4, this should give us data set of
	// 0, 4, 6
	// 1, 7, 6.5
	// 2, 7, 6.5
	// 3, 7, 6.5
	for (int i = 0; i < 4; ++i) {
		if (i == 1 && rank == 2) {
			v = 4;
			j = 2;
		}
		ds.record(i);
	}

	ds.write();
	if (rank == 0) {
		double expected[] = { 0, 4, 6, 1, 7, 6.5, 2, 7, 6.5, 3, 7, 6.5 };
		ASSERT_EQ(4 * 3, sink->data.size());
		int i = 0;
		for (auto v : sink->data) {
			ASSERT_NEAR(expected[i++], v, 0.000001);
		}
	}
}

TEST(DataRecording, test_text_sink) {
	int rank = repast::RepastProcess::instance()->rank();
	DataSet ds;
	int v = 1;
	double j = 1.5;
	create_DataSet(ds, v, j);

	shared_ptr<TextSink> sink = make_shared<TextSink>(3);
	ds.addSink(sink);
	for (int i = 0; i < 4; ++i) {
		if (i == 1 && rank == 2) {
			v = 4;
			j = 2;
		}
		ds.record(i);
	}
	ds.write();
	ds.close();

	if (rank == 0) {
		std::string expected = "3,0,4,6\n3,1,7,6.5\n3,2,7,6.5\n3,3,7,6.5";
		ASSERT_EQ(expected, sink->text());
	}
}

TEST(DataRecording, test_file_sink) {
	int rank = repast::RepastProcess::instance()->rank();
	DataSet ds;
	int v = 1;
	double j = 1.5;
	create_DataSet(ds, v, j);

	std::string file("./test_output/out.csv");
	if (rank == 0) {
		fs::path filepath(file);
		if (fs::exists(filepath)) {
			fs::remove(filepath);
		}
	}

	auto sink = make_shared<FileSink>(3, file);
	ds.addSink(sink);
	for (int i = 0; i < 4; ++i) {
		if (i == 1 && rank == 2) {
			v = 4;
			j = 2;
		}
		ds.record(i);
	}
	ds.write();
	ds.close();

	if (rank == 0) {
		std::ifstream in;
		in.open(file.c_str());
		std::string line;
		std::string text;
		// this is inefficient way to concatenate
		// text but fine for here
		while(getline(in, line)) {
			text += line + "\n";
		}
		in.close();

		std::string expected = "run_id,tick,source_1,source_2\n3,0,4,6\n3,1,7,6.5\n3,2,7,6.5\n3,3,7,6.5\n";
		ASSERT_EQ(expected, text);
	}
}

