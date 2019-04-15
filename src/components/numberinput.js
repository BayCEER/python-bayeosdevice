import React from 'react';

import {Message} from './message';


export class NumberInput extends React.Component {  
    constructor(props){
      super(props);       
      this.state = {
        min: props.prop.min,
        max: props.prop.max,
        step: props.prop.step ? props.prop.step: 1,
        item_value: null
      }    
      this.keyPress = this.keyPress.bind(this);    
      this.onChange = this.onChange.bind(this);    
      this.onBlur = this.onBlur.bind(this);    
    }
  
    keyPress(e){   
      // console.log("keyPress:" + e.target.value);
      if (e.key == 'Enter' && !isNaN(e.target.value)){               
        this.props.onChange(this.props.item_key, parseFloat(e.target.value));        
        e.target.blur();                  
      } 
    }
  
    onBlur(e){
      this.setState(
        { item_value: null}
      );
    }
  
    onChange(e){
      // console.log("onChange");
      this.setState(
        { item_value: e.target.value}
      );
    }
  
    render() {
      // console.log("render");
      var value = this.state.item_value != null ? this.state.item_value:this.props.item_value;
      var error = isNaN(parseFloat(value));
      var message = error ? 'Please insert a valid number.':'';    
      var className = error ? 'has-error':'';
      return (      
        <div className={className}>
          <input type="number" min={this.state.min} max={this.state.max} step={this.state.step} 
          onChange={this.onChange} onKeyPress={this.keyPress} onBlur={this.onBlur} value={value} className="form-control"/>                      
          <Message message={message} error={error}/>
        </div>
      );
    }
  }
  