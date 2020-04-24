
import tornado.web
import tornado.ioloop
import tornado.httpserver
import logging
import threading
import socket
import json
import os
import re

from threading import Thread
from tornado.web import RequestHandler, Application
from tornado.websocket import WebSocketClosedError, WebSocketError, WebSocketHandler
from bayeosdevice.item import SetItemHandler
from ConfigParser import SafeConfigParser


log = logging.getLogger(__name__)

class WebSocket(WebSocketHandler):
        handlers = set()            
        def open(self):
            user_id = self.get_secure_cookie("user")
            if not user_id: return None            
            log.debug("WebSocket opened")
            WebSocket.handlers.add(self)            
        
        def on_message(self, msg):
            # try:             
                log.debug("Received message:{0}".format(msg))   
                m = json.loads(msg)            
                if m['type'] =='c':
                    WebSocket.send_message(json.dumps(DeviceController.getAllControls()))                              
                elif m['type'] == 'a':                
                    av = DeviceController.actions
                    key = m['key']
                    if isinstance(av[key],bool):
                        av[key] = bool(m['value'])
                    elif isinstance(av[key],int):
                        av[key] = int(m['value'])                    
                    elif isinstance(av[key],float):
                        av[key] = float(m['value'])
                    else:                
                        av[key] = m['value']    
                elif m['type'] == 'e':
                    log.error("Error message received.")
            # except:
            #    log.error("Error on message:" + msg)
                
        def on_close(self):
            log.debug("WebSocket closed")  
            WebSocket.handlers.remove(self)            
        
        @classmethod
        def send_message(cls,msg): 
            try:           
                for h in cls.handlers:
                    log.debug("Sending message:{0}".format(msg))
                    h.write_message(msg)
            except WebSocketClosedError:
                log.warn("WebSocket closed error")
            except WebSocketError:
                log.warn("WebSocket error")
            except:
                log.error("Unexpected error in send_message")
            

class BaseHandler(RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")
    def get_host_name(self):
        return socket.gethostname()


class MainHandler(BaseHandler): 
    def initialize(self,template):
        self.template = template        
    @tornado.web.authenticated                        
    def get(self): 
        self.render(self.template,values=DeviceController.getValueTags(),actions=DeviceController.getActionTags(), error=None)
  
class LoginHandler(BaseHandler):
    def initialize(self, password):
        self.password = password
    def get(self):
        self.render("login.html", error=None)
    def post(self):
        if self.password == self.get_argument("password"):
            self.set_secure_cookie("user", self.password)
            self.redirect(self.get_argument("next", "/"))
        else:
            self.render("login.html", error="Incorrect password")

class LogoutHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        self.clear_cookie("user")
        self.redirect(self.get_argument("next", "/"))

class ValueHandler(SetItemHandler):
    def notify( self, key, newValue, oldValue, event=None):                
        WebSocket.send_message(json.dumps([{'type':'v','key':key,'value':newValue, 'class': DeviceController.getValueControls()[key]['class']}]))

class ActionHandler(SetItemHandler):
    def notify( self, key, newValue, oldValue, event=None):  
        if event=="U" and newValue == oldValue:
            return
        else:               
            WebSocket.send_message(json.dumps([{'type':'a','key':key,'value':newValue, 'class':DeviceController.getActionControls()[key]['class']}]))

class ConfigFileHandler(SetItemHandler):
    def __init__(self, config, file):
        self.config = config
        self.file = file
        if not self.config.has_section('ACTIONS'):
            self.config.add_section("ACTIONS")
        
    def notify(self, key, newValue, oldValue, event=None):
        self.config.set('ACTIONS',key,str(newValue))
        with open(self.file, 'wb') as configfile:
            self.config.write(configfile)
        

class DeviceController(Thread):
    values = None
    actions = None  
    units = None 
    
    value_controls = None
    action_controls = None

            
    def logMessage(self,msg):
        log.debug("Message:" + str(msg))
   

    @classmethod
    def getAllControls(cls):
        r = []
        for key,control in sorted(cls.value_controls.items()):            
            r.append({'type':'v','key':key,'value':cls.values[key],'class':control['class'],'prop':control['prop']})
        for key,control in sorted(cls.action_controls.items()):            
            r.append({'type':'a','key':key,'value':cls.actions[key],'class':control['class'],'prop':control['prop']})
        return r        

    @classmethod
    def getValueTags(cls):
        return cls.getTags(cls.values.items(),'v')

    @classmethod
    def getActionTags(cls):
        return cls.getTags(cls.actions.items(),'a')     

   
    @classmethod
    def getTags(cls, items, itemType):        
        r = []        
        for key,value in sorted(items):
            i = {'key':key,'label':key}                        
            for reg, unit in cls.units.items():
                if re.match(reg,key):                    
                    i['label'] = key + '[' + unit + ']'                                                
            i['control'] = "<div id=\"" + itemType + ":" + key + "\"></div>"                          
            r.append(i)    
        return r

    @classmethod
    def sendMessage(cls, msg):
        log.debug("Write message:" + str(msg))
        WebSocket.send_message(json.dumps(msg))
    
    @classmethod
    def getActionControls(cls):
        return cls.action_controls

    @classmethod
    def getValueControls(cls):
        return cls.value_controls        
    
    @classmethod
    def sendError(cls,key,error):
        log.debug("Send error message:" + str(error))
        WebSocket.send_message(json.dumps([{'type':'e','key':key,'value':str(error)}]))         

    def __init__(self, values, actions,units={}, components={}, configFile="", port=80, password="bayeos", template="items.html"): 
        Thread.__init__(self,name="DeviceController")    

        self.valueHandler = ValueHandler()
        values.addHandler(self.valueHandler) 
        DeviceController.values = values 

        if configFile != "":
            p = SafeConfigParser()
            if p.read(configFile):
                for key,value in actions.items():
                    if p.has_option("ACTIONS",key):
                        if isinstance(value,bool):
                            actions[key] = p.getboolean("ACTIONS",key)                        
                        elif isinstance(value,int):
                            actions[key] = p.getint("ACTIONS",key)                        
                        elif isinstance(value,float):
                            actions[key] = p.getfloat("ACTIONS",key)                        
                        else:
                            actions[key] = p.get("ACTIONS",key)                    
            self.configFileHandler = ConfigFileHandler(p,configFile)
            actions.addHandler(self.configFileHandler)

        self.actionHandler = ActionHandler()
        actions.addHandler(self.actionHandler) 
        DeviceController.actions = actions
        
        DeviceController.units = units
        DeviceController.components = components

        value_controls = {}
        for key, value in values.items():
            value_controls[key] = self.getControl(components,key,value,'v')        
        DeviceController.value_controls = value_controls

        action_controls = {}
        for key, value in actions.items():
            action_controls[key] = self.getControl(components,key,value,'a')                
        DeviceController.action_controls = action_controls
        
        self.port = port
        self.password = password 
        self.template = template
        

    def getControl(self, components, key, value, itemType):        

        # Default types for values 
        if (itemType == 'v'):
             c = 'Text'
        else:
            # Dynamic types for actions 
            if value is None:
                c = 'Text'
            else:
                if isinstance(value,bool):
                    c = 'Toggle'
                elif isinstance(value,int) or isinstance(value,float):
                    c = 'NumberInput'
                else:
                    c = 'TextInput'
        d = {'class':c,'prop':{}}                    
        # Overwrite type by configuration             
        for reg, co in components.items():
            if re.match(reg,key):
                d['class'] = co['class']
                if ('prop' in co):
                    d['prop'] = co['prop']
        return d;   

    def run(self):        
        log.debug('Starting DeviceController')
        handlers = [
                ("/", MainHandler, {'template':self.template}),
                ("/messages",WebSocket),
                ("/login", LoginHandler, {"password":self.password}),
                ("/logout", LogoutHandler),
        ]        
        settings = dict(
            cookie_secret="0389dfklj0asdfasdfqwefasvasdsd",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),            
            login_url="/login",
            debug=False,
        )      
        
        application = Application(handlers,**settings)        
        http_server = tornado.httpserver.HTTPServer(application)
        http_server.listen(self.port)           
        tornado.ioloop.IOLoop.instance().start()  

    def stop(self):
        log.debug("Stopping DeviceController")
        tornado.ioloop.IOLoop.instance().stop()

        








