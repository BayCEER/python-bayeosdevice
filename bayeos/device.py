
import tornado.web
import tornado.ioloop
import tornado.httpserver
import logging
import threading
import socket
import json
import os

from threading import Thread
from tornado.web import RequestHandler
from tornado.websocket import WebSocketHandler

class WebSocket(WebSocketHandler):
        handlers = set()            
        def open(self):
            logging.debug("WebSocket opened")
            WebSocket.handlers.add(self)            
        
        def on_message(self, msg):
            logging.debug("On message" + msg)
            DeviceController.callback(msg)
        
        def on_close(self):
            logging.debug("WebSocket closed")  
            WebSocket.handlers.remove(self)            
        
        @classmethod
        def send_message(cls,msg):
            logging.debug("Sending messages")
            for h in cls.handlers:
                h.write_message(msg)

class MainHandler(RequestHandler):                         
        @tornado.web.asynchronous    
        def get(self):        
            self.render("main.html",title=socket.gethostname(), items=DeviceController.items)

class DeviceController(Thread):
    items = {}
    callback = None

    def sendMessage(self, msg):
        logging.debug("Write message:" + str(msg))
        WebSocket.send_message(json.dumps(msg))

    @classmethod
    def set_items(cls, items):
        cls.items = items        
    
    @classmethod
    def set_callback(cls, callback):
        cls.callback = callback
        

    def __init__(self, port, items, received): 
        Thread.__init__(self)              
        self.port = port
        DeviceController.set_items(items)    
        DeviceController.set_callback(received)    

    def run(self):        
        logging.debug('Starting DeviceController')
        application = tornado.web.Application([
            ("/", MainHandler),("/messages",WebSocket)
        ])  
        application.settings = dict(
            cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            xsrf_cookies=True,
        )      
        http_server = tornado.httpserver.HTTPServer(application)
        http_server.listen(self.port)           
        tornado.ioloop.IOLoop.instance().start()  







