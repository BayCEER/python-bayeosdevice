'''
Created on 30.11.2017
@author: oliver
'''
import time
import unittest
import psutil
import logging


from bayeos import DeviceController

logger = logging.getLogger()
logger.level = logging.DEBUG


class DeviceTest(unittest.TestCase):
 def testController(self):        
    #TODO Replace item dic with an observable List or Dictionary 
    # Must be synchronized because different threads access it concurrently         
    # items = ObservableDict({"sleep_time":2, "cpu1":None , "cpu2":None})
    items = {"sleep_time":2, "cpu1":None , "cpu2":None}
    con = DeviceController(items)
    con.start()

    while True:
        cpu = psutil.cpu_percent(percpu=True)
        #TODO Should be fired by controller whenever an item changes 
        con.sendMessage({"cpu1":cpu[0], "cpu2":cpu[1]})
        #TODO This fires an event to our views 
        time.sleep(items["sleep_time"])

if __name__ == "__main__":
    unittest.main()
