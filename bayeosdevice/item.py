
import weakref
"""Observable types and handlers"""

class __itemDict__( type ):
    def __new__( cls, name, bases, classdict ):           
        def handlers( self ):
            if not hasattr( self, "__handlers" ):
                setattr( self, "__handlers", weakref.WeakSet() )
            return getattr( self, "__handlers" )
        def notifySetItem(func):
            def wrapper( *args, **kwargs ):
                instance, key, newVal = args[0], args[1], args[2]                                               
                if key in instance:
                    instance.notifyHandlers(key=key, newValue=newVal, oldValue=instance[key], event="U")            
                else:
                    instance.notifyHandlers(key=key, newValue=newVal, oldValue=None, event="N")        
                return func( *args, **kwargs )
            return wrapper
        def addHandler( self, handler):
            self.handlers().add(handler)
        def removeHandler( self, handler ):
            self.handlers().remove(handler)
        def notifyHandlers( self, key=None, newValue=None, oldValue=None, event=None ):
            for h in self.handlers():
                h.notify(key,newValue,oldValue,event)        
        classdict["handlers"] = handlers
        classdict["addHandler"] = addHandler
        classdict["removeHandler"] = removeHandler
        classdict["notifyHandlers"] = notifyHandlers
        aType = type.__new__( cls, name, bases, classdict )        
        aType.__setitem__ = notifySetItem( aType.__setitem__ )
        return aType 

class SetItemHandler( object ):
    """" Handles set item events """
    def notify( self, key, newValue, oldValue, event):
        raise NotImplementedError("must be implemented by subclass")

class ItemDict(dict,metaclass=__itemDict__):
    """" A dictionary which fires set item events on registered handlers"""
    
   
     
       