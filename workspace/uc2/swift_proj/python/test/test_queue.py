import wapq

def test_queue():
    """
input_q = queue.Queue()
output_q = queue.Queue()

def OUT_put(string_params):
    output_q.put(string_params)
    
def IN_get():
    global input_q
    result = input_q.get()
    return result
   """
    wapq.input_q.put("hello nick")
    expected = "hello nick"
    assert expected == wapq.IN_get()
    
    wapq.OUT_put("hello jonathan")
    expected = "hello jonathan"
    assert expected == wapq.output_q.get()