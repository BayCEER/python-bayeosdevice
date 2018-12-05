'use strict';

/* String to class map */

var components = {
  Text: Text,
  TextInput: TextInput,
  NumberInput: NumberInput,
  CheckBox: CheckBox,
  Select: Select,
  Slider: Slider,
  Toggle: Toggle
};

$(document).ready(function () {

  function sendValue(key, value) {
    console.log("Send: {" + key + ":" + value + "}");
    ws.send(JSON.stringify({ 'type': 'a', 'key': key, 'value': value }));
  }

  var url = "ws://" + location.host + "/messages";
  var ws = new WebSocket(url);

  ws.onopen = function () {
    //console.log("WS opened.");        
    ws.send('{"type":"c"}');
  };

  ws.onerror = function (evt) {
    alert("Communication error");
  };

  ws.onclose = function () {
    // console.log("WS closed.");   
    $("#div_values").before("<div class=\"row\"><div class=\"container\"><div class=\"alert alert-danger\" role=\"alert\">Communication error, please reload the page.</div></div></div>");
  };

  ws.onmessage = function (evt) {
    // console.log("Received Message:" + evt.data);
    var items = JSON.parse(evt.data);
    var i;
    var onChange = sendValue.bind(this);
    for (i in items) {
      var item = items[i];
      var node = document.getElementById(item.type + ":" + item.key);
      // console.log("Render:" + item.class);     
      var container = { 'item_value': item.value, 'item_key': item.key, 'onChange': onChange };
      if (item.prop) {
        container.prop = item.prop;
      }
      ReactDOM.render(React.createElement(components[item.class], container), node);
    }
  };

  // Navigation Buttons
  $("#nav_settings").click(function () {
    toggleActiveButton();
  });

  $("#nav_values").click(function () {
    toggleActiveButton();
  });

  function toggleActiveButton() {
    $("#div_settings").toggle();
    $("#nav_settings").toggleClass("active");
    $("#div_values").toggle();
    $("#nav_values").toggleClass("active");
  }
});