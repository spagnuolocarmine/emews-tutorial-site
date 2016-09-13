# run using py.test
import deap_ga
import wapq
from unittest.mock import Mock
import numpy as np
    
def test_create_fitnesses():
    str1 = "1,2,3;4,5,6;7,8,9"
    expected = [(0,),(1,),(2,)]
    assert expected == deap_ga.create_fitnesses(str1)

def test_run(monkeypatch):
    test_run.data_size = 0
    def mockput(data):
        test_run.data_size = len(data.split(";")) if data else 0
        print("test_run.data_size: {}".format(test_run.data_size))
        print("Putting data: {}".format(data))
    def side_effects(*args, **kwargs):
        side_effects.counter += 1
        if side_effects.counter == 1:
            return '5,3,0,"/project/jozik/repos/wintersim2016_adv_tut/uc2/swift_proj/data/params_for_deap.csv"'
        else:
            result = ",".join(["{}".format(x) for x in np.random.randint(10,size=test_run.data_size)])
            print("Getting result: ", result)
            return result
    side_effects.counter = 0
    mockget = Mock(side_effect=side_effects)
    monkeypatch.setattr(wapq, 'OUT_put', mockput)
    monkeypatch.setattr(wapq, 'IN_get', mockget)
    deap_ga.run()


