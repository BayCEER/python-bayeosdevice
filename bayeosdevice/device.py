
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


log = logging.getLogger(__name__)


def getValueType(value):
    if value is None:
        return "none"
    else:
        if isinstance(value,float):
            return "float"
        elif isinstance(value,bool):
            return "boolean"
        elif isinstance(value,int):
            return "int"       
        else:
            return "string"

class WebSocket(WebSocketHandler):
        handlers = set()            
        def open(self):
            user_id = self.get_secure_cookie("user")
            if not user_id: return None            
            log.debug("WebSocket opened")
            WebSocket.handlers.add(self)            
        
        def on_message(self, msg):            
            log.debug("Received message:{0}".format(msg))   
            m = json.loads(msg)            
            if m['type']=='get items':
                WebSocket.send_message(json.dumps(DeviceController.getActions()))
                WebSocket.send_message(json.dumps(DeviceController.getValues()))
            elif m['type'] == 'set action':                          
                DeviceController.actions[m['key']] = m['value']                                                  
            
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
    def notify( self, key, value, event=None):        
        WebSocket.send_message(json.dumps([{'class':'value', 'value-type':getValueType(value),'key':key,'value':value}]))

class ActionHandler(SetItemHandler):
    def notify( self, key, value, event=None):        
        WebSocket.send_message(json.dumps([{'class':'action','value-type':getValueType(value),'key':key,'value':value}]))


class DeviceController(Thread):
    values = None
    actions = None  
    units = None 
        
    def logMessage(self,msg):
        log.debug("Message:" + str(msg))

    @classmethod
    def getValues(cls):
        r = []
        for key,value in sorted(cls.values.items()):
            r.append({'class':'value','value-type':getValueType(value),'key':key,'value':value})
        return r

    @classmethod
    def getValueTags(cls):
        return cls.getTags(cls.values.items(),'value')

    @classmethod
    def getActionTags(cls):
        return cls.getTags(cls.actions.items(),'action')


    @classmethod
    def getActions(cls):
        r = []
        for key,value in sorted(cls.actions.items()):
            r.append({'class':'action','value-type':getValueType(value),'key':key,'value':value})
        return r
    
    @classmethod
    def getTags(cls, items, itemType):        
        r = []        
        for key,value in sorted(items):
            i = {'key':key,'label':key}                        
            for reg, unit in cls.units.items():
                if re.match(reg,key):                    
                    i['label'] = key + '[' + unit + ']'                        
            i['control'] = "<div class=\"" + itemType + "\" key=\"" + key + "\"></div>"                     
            r.append(i)    
        return r


    @classmethod
    def sendMessage(cls, msg):
        log.debug("Write message:" + str(msg))
        WebSocket.send_message(json.dumps(msg))
    
    @classmethod
    def sendError(cls,key,error):
        log.debug("Send error message:" + str(error))
        WebSocket.send_message(json.dumps([{'type':'e','key':key,'value':str(error)}]))         

    def __init__(self, values, actions, units={}, port=80, password="bayeos", template="items.html"): 
        Thread.__init__(self,name="DeviceController")             
        self.valueHandler = ValueHandler()
        values.addHandler(self.valueHandler) 
        DeviceController.values = values 

        self.actionHandler = ActionHandler()
        actions.addHandler(self.actionHandler) 
        DeviceController.actions = actions
        
        DeviceController.units = units
        
        self.port = port
        self.password = password 
        self.template = template
        

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

        








