import time
import psutil
import logging
import signal
import sys

from bayeosdevice.device import DeviceController
from bayeosdevice.item import ItemDict, SetItemHandler

def sigterm_handler(_signo, _stack_frame):
    con.stop()
    sys.exit(0)

signal.signal(signal.SIGTERM, sigterm_handler) 
signal.signal(signal.SIGINT, sigterm_handler)

logging.basicConfig(format='%(asctime)s %(levelname)s:%(message)s', level=logging.DEBUG) 


values = ItemDict({"cpu1":None})  
units = {"^cpu":'%',"\w+time$":'secs'}      
actions = ItemDict({"sleep_time":10, "run": True})        
con = DeviceController(values,actions,units)
con.start()

while True:
    if (actions["run"] == True):
        cpu = psutil.cpu_percent(percpu=True)        
        values['cpu1'] = cpu[0]                     
        time.sleep(actions["sleep_time"])            
    else:
        time.sleep(0.01)
