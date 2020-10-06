import time
import psutil
import logging

from bayeosdevice.device import DeviceController
from bayeosdevice.item import ItemDict

logging.basicConfig(format='%(asctime)s %(levelname)s:%(message)s', level=logging.DEBUG) 
logging.getLogger('bayeosdevice.device').setLevel(logging.DEBUG)


img1 = "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
img2 = "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="

values = ItemDict({"cpu1":None,"cpu2":None, "cam1":img1, "cam2":img2})  
units = {"^cpu":'%',"\w+time$":'secs'}      
actions = ItemDict({"sleep_time":10, "run": True})        

components =  {
    '^cam': {'class':'Image','prop':{'alt':'Web Camera'}}, 
 }    

con = DeviceController(values,actions,units,components)
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
except KeyboardInterrupt:
    con.stop()
finally:
    logging.debug("Stopped device")