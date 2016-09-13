import R_obj;
import assert;
import io;
import string;
#import sys;

test1()
{
	   string str_data = "6,8,3,4\n3,1,1,4\n0,0,1,0\n1,4,1,2\n3,0,4,3\n3,2,1,3\n3,3,1,2\n3,3,3,2\n2,2,3,3\n0,2,2,3\n2,0,3,3\n3,3,3,2\n2,4,1,2\n0,4,2,3\n4,2,4,1\n1,1,3,1\n2,3,0,3\n0,4,1,3\n3,2,2,3\n2,0,1,2\n1,3,0,2\n3,2,4,4\n2,0,0,2\n2,1,3,1\n4,2,1,1\n3,3,1,0\n1,2,2,0\n4,1,3,2\n1,3,1,3\n3,1,3,3\n3,2,4,2\n1,1,1,3\n2,1,2,3\n3,3,1,2\n4,1,4,2\n1,1,2,1\n2,3,3,4";
	   string str_flu_data = "1,4,3,1,1,1,0,3,2,3,2,3,2,1,1,0,3,3,2,0,1,2,2,1,1,1,3,2,3,3,2,3,4,3,0,2";
	   string res = calc_obj(str_data, str_flu_data, 2);
	   assert(res == "107", "SSE is incorrect for column 2");
	   string res2 = calc_obj(str_data, str_flu_data, 3); 
	   assert(res2 == "89", "SSE is incorrect for column 3");
	   string res3 = calc_obj(str_data, str_flu_data, 3, 0.5);
	   assert(res3 == "99.25", "SSE is incorrect for scaled case");
}

test2()
{
   string all_flu_data = """
week,2011,2012,2013,2014
40,41,28,37,39
41,22,37,31,35
42,10,89,47,59
43,0,55,41,71
44,45,109,72,120
45,8,182,127,195
46,16,403,225,355
47,0,851,355,813
48,43,1229,443,1370
49,18,2155,847,2087
50,122,3516,1017,3237
51,172,4609,1522,4442
52,215,5841,3134,4587
1,223,5754,3795,3200
2,320,4238,3175,1888
3,360,3090,2114,1030
4,545,2471,2074,769
5,806,1839,1771,476
6,1032,1157,1110,389
7,1121,893,899,290
8,1636,624,776,189
9,2181,472,579,176
10,2505,341,392,139
11,2792,173,353,116
12,2133,231,264,114
13,1110,167,207,94
14,789,156,230,78
15,686,112,148,48
16,651,129,153,25
17,440,283,227,22
18,333,69,134,13
19,300,8,89,11
20,105,18,101,8
21,104,28,155,19
22,77,0,75,18
23,73,0,13,2

""";
	string res = get_flu_data(all_flu_data, 2013);
	string expected = "37,31,47,41,72,127,225,355,443,847,1017,1522,3134,3795,3175,2114,2074,1771,1110,899,776,579,392,353,264,207,230,148,153,227,134,89,101,155,75,13";
	assert(res == expected, "Incorrect flu data retrieved");
}

# Testing string splitting
test3(){
	string ranks = "62";
	string results[] = split(ranks,",");
	assert(size(results) == 1, "not size 1");
	assert(toint(results[0]) == 62, "incorrect value");
	string ranks2 = "64,65,66,68";
	string results2[] = split(ranks2,",");
	assert(size(results2) == 4, "not size 4");
        assert(toint(results2[3]) == 68, "incorrect value");
}
test1();
test2(); 
test3();
