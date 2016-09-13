import R_utils;
import assert;
import files;
import io;

// create_upfs test
test1()
{
  string params_file = "data/test_parameters.xml";
  string params_string = "f,e,d";
  string params_values = "2,small,3.4";
  int num_stochastic_variations = 3;
  string expected_result = strcat("1\trandomSeed\t0,a\t0,b\tDefault,c\t0,d\t3.4,e\tsmall,f\t2,g\t8.3;",
                           "1\trandomSeed\t1,a\t0,b\tDefault,c\t0,d\t3.4,e\tsmall,f\t2,g\t8.3;",
                           "1\trandomSeed\t2,a\t0,b\tDefault,c\t0,d\t3.4,e\tsmall,f\t2,g\t8.3");
  string result = create_upfs(params_file,params_string,params_values,num_stochastic_variations);
  assert(result == expected_result, "test1: unexpected result for create_upfs");
}

// calc_obj test
test2()
{
  float result = calc_obj("data");
  float expected_result = 0;
  assert(result == expected_result, "test2: unexpected result for calc_obj");
  float result1 = calc_obj("data/d1");
  float expected_result1 = 110;
  assert(result1 == expected_result1, "test2: unexpected result1 for calc_obj");
  float result2 = calc_obj("data/d2");
  float expected_result2 = 0;
  assert(result2 == expected_result2, "test2: unexpected result2 for calc_obj");
}

test1();
test2();
