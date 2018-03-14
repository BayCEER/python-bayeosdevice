$(document).ready(function() {        

    var url = "ws://" + location.host + "/messages";
    var ws = new WebSocket(url);
    
    ws.onopen = function() {
      console.log("WS opened.");        
      ws.send('{"type":"get items"}');      
    };

    ws.onerror = function (evt) {
      alert("Communication error");
    };

    ws.onclose = function() {
      console.log("WS closed.");      
      // Disable all input elements 
      $("input[data-toggle='toggle']").bootstrapToggle('disable');
      $("input").attr("disabled","True");
      $("#div_values").before("<div class=\"row\"><div class=\"container\"><div class=\"alert alert-danger\" role=\"alert\">Communication error, please reload the page.</div></div></div>");
    }
  
    ws.onmessage = function (evt) {       
      console.log("Received Message:" + evt.data);
      items = JSON.parse(evt.data);        
      var i;
      for (i in items){        
        var item = items[i];                        
        $("." + item['class'] + "[key='" + item['key'] + "']").each(function(){
          if (item['value-type'] == 'float' || item['value-type'] == 'int'){
            // Numeric             
            if (item['class'] == 'action'){
              $(this).html("<input type=\"number\" class=\"form-control\" value=\"" + item['value'] + "\" required>");
              $(this).children("input:first").on("keypress", function(e) {
                if (e.keyCode == 13 && this.value.length > 0){                  
                    ws.send(JSON.stringify({"type":"set action","key":$(this).parent().attr('key'),"value":this.valueAsNumber}));                                  
                }                                
              });
            } else {
              $(this).html(item['value']);
            }            
          } else if (item['value-type'] == 'boolean') {
            // Checkbox        
            $(this).html("<input data-toggle=\"toggle\" type=\"checkbox\" data-size=\"small\"" + ((item['value']==true)?'checked':'') + ">");        
            var tog = $(this).children("input:first").bootstrapToggle();            
            tog.bootstrapToggle((item['type']=="value")?'disable':'enable');
            if (item['class'] == 'action'){
              tog.change(function() {                
                ws.send(JSON.stringify({"type":"set action","key":$(this).parent().parent().attr('key'),"value":this.checked}));                                  
              });
            }   
          } else {
            // Text
            if (item['class'] == 'action'){
              $(this).html("<input type=\"text\" class=\"form-control\" value=\"" + item['value'] + "\" required>");              
              $(this).children("input:first").on("keypress", function(e) {
                if (e.keyCode == 13 && this.value.length > 0){                  
                    ws.send(JSON.stringify({"type":"set action","key":$(this).parent().attr('key'),"value":this.value}));                                  
                }                                
              });
            } else {
              $(this).html(item['value']);
            }
          }
        });
      }
    }; // End on message
  


      // Navigation Buttons
      $("#nav_settings").click(function(){
        toggleActiveButton();
      });
      
      $("#nav_values").click(function(){
        toggleActiveButton();
      });

      function toggleActiveButton(){
        $("#div_settings").toggle();
        $("#nav_settings").toggleClass("active")
        $("#div_values").toggle();
        $("#nav_values").toggleClass("active")
      }    
});
 
