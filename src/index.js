'use strict';

import React from "react";
import ReactDOM from "react-dom";
import { Text } from "./components/text";
import { TextInput } from "./components/textinput";
import { NumberInput } from "./components/numberinput";
import { CheckBox } from "./components/checkbox";
import { Select } from "./components/select";
import { Slider } from "./components/slider";
import { Toggle } from "./components/toggle";
import { Image } from "./components/image";
import Highcharts from "highcharts";

/* String to class map */
const components = {
  Text: Text,
  TextInput: TextInput,
  NumberInput: NumberInput,
  CheckBox: CheckBox,
  Select: Select,
  Slider: Slider,
  Toggle: Toggle,
  Image: Image
};

const MAX_DATA = 100;
Highcharts.setOptions({
  global: {
      useUTC: false
  }
});

var keys = [];
const sections = ['values', 'charts', 'settings'];

$(document).ready(function () {

  var chart = Highcharts.chart('chart', {    
    chart: {
        // FireFox Bug 
        animation: false
    },
    title: {
      text: ''
    },     
    xAxis: {
        type: 'datetime',
        title: {
          text: 'Date',
          margin: 10
        }        
    },
    yAxis: {
        minPadding: 0.2,
        maxPadding: 0.2,
        title: {
            text: 'Value',
            margin: 10
        }
    }
  }); 

  function sendValue(key, value) {
    console.log("Send: {" + key + ":" + value + "}");
    ws.send(JSON.stringify({ 'type': 'a', 'key': key, 'value': value }));
  }

  var url = "ws://" + location.host + "/messages";
  var ws = new WebSocket(url);

  ws.onopen = function () {    
    ws.send('{"type":"c"}');
  };

  ws.onerror = function (evt) {
    alert("Communication error");
  };

  ws.onclose = function () {
    $("#div_values").before("<div class=\"row\"><div class=\"container\"><div class=\"alert alert-danger\" role=\"alert\">Communication error, please reload the page.</div></div></div>");
  }

  ws.onmessage = function (evt) {
    console.log("Received Message:" + evt.data);
    var onChange = sendValue.bind(this);
    
    // Values 
    var items = JSON.parse(evt.data);
    var date = new Date().getTime();
    items.forEach(item => {
      var container = { 'item_value': item.value, 'item_key': item.key, 'onChange': onChange };
      if (item.prop) {
        container.prop = item.prop;
      }
      var node = document.getElementById(item.type + ":" + item.key);
      ReactDOM.render(React.createElement(components[item.class], container), node);
      
      if (item.type == 'v' && !Number.isNaN(Number.parseFloat(item.value))){ 
        var rec = [date,item.value];
        if (!keys.includes(item.key)){
          chart.addSeries({name: item.key});
          keys.push(item.key);
        } else {
          var i = keys.indexOf(item.key);
          var s = chart.series[i];
          s.addPoint(rec);
          if (s.data.length > MAX_DATA) {
            s.removePoint(0);
          }
        } 
      }
    });
      
  };

  $("#nav_values").click(function () {
    activateSection("values");
  });
  $("#nav_charts").click(function () {
    activateSection("charts");
  });
  $("#nav_settings").click(function () {
    activateSection("settings");
  });
  

  function activateSection(nav) {
    sections.forEach(sec => {
      if (sec == nav) {
        $("#div_" + sec).show();
        $("#nav_" + sec).addClass("active");
      } else {
        $("#div_" + sec).hide();
        $("#nav_" + sec).removeClass("active");
      }
    });
  }

  $("#hs_series").click(function () {
    if("Hide series"==$(this).val()){
      $(chart.series).each(function(){
        this.setVisible(!1,!1)
        });
      chart.redraw(),
      $(this).val("Show series") 
    } else {
     $(chart.series).each(function(){
       this.setVisible(!0,!1)});
     chart.redraw(),
     $(this).val("Hide series") 
    } 
  });

  





});


