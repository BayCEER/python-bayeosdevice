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
      $("input[type='number']").attr("disabled","True");
      $("#div_values").before("<div class=\"row\"><div class=\"container\"><div class=\"alert alert-danger\" role=\"alert\">Communication error, please reload the page.</div></div></div>");
    }

    ws.onmessage = function (evt) {       
      console.log("Received Message:" + evt.data);
      items = JSON.parse(evt.data);        
      var i;
      for (i in items){
        var item = items[i];
        var key = "#" + item['type'] + item['key'];
        if (typeof(item['value']) == 'boolean'){           
          // CheckBox   
          $(key).html(
            "<input data-toggle=\"toggle\" type=\"checkbox\" data-size=\"small\"" + ((item['value']==true)?'checked':'') + ">"
          );
          var tog = $(key).children("input:first").bootstrapToggle();            
          tog.bootstrapToggle(((item['type']=="v")?'disable':'enable'));          
          if (item['type'] == 'a'){
            tog.change(function() {                
              ws.send(JSON.stringify({"type":"set action","key":$(this).parent().parent().attr('id').substr(1),"value":this.checked}));                                  
            });
          }            
        } else {
          // Text
          if (item['type'] == 'a'){
            $(key).html(
              "<input type=\"number\" class=\"form-control\" value=\"" + item['value'] + "\" required>"
            )
            $(key).children("input:first").on("keypress", function(e) {
               if (e.keyCode == 13) {                       
                    if (this.value.length > 0){
                      ws.send(JSON.stringify({"type":"set action","key":$(this).parent().attr('id').substr(1),"value":this.valueAsNumber}));                                  
                    } else {
                      alert("Please fill in a valid number.")
                    }                       
                }

              });              
          } else {
            if (item['value'] != null){
              $(key).text(parseFloat(item['value'].toFixed(2)));
            } else {
              $(key).text("");
            }
             
          }
        }
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
 