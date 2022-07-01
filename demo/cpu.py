#!/usr/bin/python3
# -*- coding: utf-8 -*-
# Simple Sample device to show overall usage 

import time
import psutil
import logging
import sys, signal

from bayeosdevice.device import DeviceController
from bayeosdevice.item import ItemDict

logging.basicConfig(format='%(asctime)s %(levelname)s:%(message)s', level=logging.DEBUG) 
logging.getLogger('bayeosdevice.device').setLevel(logging.DEBUG)

values = ItemDict({"cpu1":None})  
units = {"^cpu":'%',"\w+time$":'secs'}      
actions = ItemDict({"sleep_time":10, "run": True, "message":"Hello"})        

con = DeviceController(values,actions,units,configFile="cpudevice.conf")
con.start()

# Stop handler 
def sigterm_handler(_signo, _stack_frame):
    logging.info("Stopping device")    
    sys.exit(0) 
signal.signal(signal.SIGTERM, sigterm_handler) 
signal.signal(signal.SIGINT, sigterm_handler)


logging.debug("Starting device")
while True:  
    if (actions["run"] == True):
        cpu = psutil.cpu_percent(percpu=True)        
        values['cpu1'] = cpu[0]                                             
        time.sleep(actions["sleep_time"])            
    else:
        time.sleep(0.01)     
