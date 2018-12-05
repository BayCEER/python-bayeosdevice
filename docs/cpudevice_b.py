#!/usr/bin/python
# -*- coding: utf-8 -*-

import time
import psutil
import logging
import sys, signal

from bayeosdevice.device import DeviceController
from bayeosdevice.item import ItemDict

logging.basicConfig(format='%(asctime)s %(levelname)s:%(message)s', level=logging.DEBUG) 
logging.getLogger('bayeosdevice.device').setLevel(logging.DEBUG)

# Values
values = ItemDict({"cpu1":None})  

# Units for values and actions
units = {"^cpu":'%',"\w+time$":'secs'}    

# Example
components =  {'^slider': {'class':'Slider','prop':{'min':0,'max':100,'step':10}}, '^select': {'class':'Select','prop':['high','medium','low']}, 'run': {'class':'CheckBox'},'booster':{'class':'Toggle','prop':{'text_on':'Enabled','text_off':'Disabled','width':200}}}    
actions = ItemDict({'sleep_time':10,'integer':0,'float':0.1,'run':True})

con = DeviceController(values,actions,units,components,"actions.conf")
con.start()

# Stop handler 
def sigterm_handler(_signo, _stack_frame):
    logging.info("Stopping device")
    if con is not None:
        con.stop()    
    sys.exit(0) 
signal.signal(signal.SIGTERM, sigterm_handler) 
signal.signal(signal.SIGINT, sigterm_handler)

try:
    logging.debug("Starting device")
    while True:  
        if (actions["run"] == True):
            cpu = psutil.cpu_percent(percpu=True)        
            values['cpu1'] = cpu[0]                                             
            time.sleep(actions["sleep_time"])            
        else:
            time.sleep(0.01)     
except KeyboardInterrupt:
    con.stop()
finally:
    logging.debug("Stopped device")