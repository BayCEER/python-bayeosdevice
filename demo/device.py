#!/usr/bin/python3
# -*- coding: utf-8 -*-
# Sample device to show the combination of a BayEOS Gateway Client and Device
import sys, signal
import time
import psutil
import logging
import tempfile
import logging
import os

from bayeosdevice.device import DeviceController
from bayeosdevice.item import ItemDict
from bayeosgatewayclient import BayEOSWriter, BayEOSSender

NAME = 'MyDevice'
PATH = os.path.join(tempfile.gettempdir(),NAME) 
GW = 'http://localhost/gateway/frame/saveFlat'

# Transport
writer = BayEOSWriter(PATH)
sender = BayEOSSender(PATH, NAME, GW)
sender.start()

# Web Interface 
values = ItemDict({"cpu1":None})  
units = {"^cpu":'%',"\w+time$":'secs'}      
actions = ItemDict({"sleep_time":10, "run": True})        
con = DeviceController(values,actions,units,template="custom.html")
con.start()

# Stop handler 
def sigterm_handler(_signo, _stack_frame):
    logging.info("Stopping device")
    sys.exit(0) 
    
signal.signal(signal.SIGTERM, sigterm_handler) 
signal.signal(signal.SIGINT, sigterm_handler)

# Main device loop
logging.info("Starting device")
while True:  
        if (actions["run"] == True):
            cpu = psutil.cpu_percent(percpu=True)        
            values['cpu1'] = cpu[0]                                 
            # Write values to disk
            writer.save(values,0x61)
            time.sleep(actions["sleep_time"])            
        else:
            time.sleep(0.01)     
