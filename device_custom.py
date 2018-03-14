import time
import psutil
import logging
import sys

from bayeosdevice.device import DeviceController
from bayeosdevice.item import ItemDict, SetItemHandler

logging.basicConfig(format='%(asctime)s %(levelname)s:%(message)s', level=logging.DEBUG) 
logging.getLogger('bayeosdevice.device').setLevel(logging.DEBUG)

values = ItemDict({"cpu1":None,"cpu2":None,})  
actions = ItemDict({"sleep_time":10, "run": True})        
con = DeviceController(values,actions,template="custom.html")
con.start()

try:
    logging.debug("Starting device")
    while True:  
        if (actions["run"] == True):
            cpu = psutil.cpu_percent(percpu=True)        
            values['cpu1'] = cpu[0]                                 
            values['cpu2'] = cpu[1]                                 
            time.sleep(actions["sleep_time"])            
        else:
            time.sleep(0.01)     

finally:
    logging.debug("Device stopped")