'''
Created on 30.11.2017
@author: oliver
'''
import unittest
import psutil
import time
import logging

from bayeos import DeviceController 

class DeviceTest(unittest.TestCase):    
       
    def messageReceived(self, msg):
        print("Received message:" + msg)    

    def testDeviceController(self):                
        items = {"sleep_time":2, "cpu":None}
        con = DeviceController(8888,items,self.messageReceived)
        con.start()
    
        while True:
            cpu = psutil.cpu_percent(percpu=True)
            con.sendMessage({"cpu":cpu})
            time.sleep(items["sleep_time"])   

            
if __name__ == "__main__":
    unittest.main()
