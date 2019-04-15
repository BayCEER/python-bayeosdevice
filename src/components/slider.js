import React from 'react';

export class Slider extends React.Component {  
    constructor(props){
      super(props);
      this.handleChange = this.handleChange.bind(this);     
      this.state = {
        min: props.prop.min,
        max: props.prop.max,
        step: props.prop.step
      }     
    }
    handleChange(e){
        this.props.onChange(this.props.item_key, e.target.value);
    }  
    render() {
      return (
        <div>                
          <input type="range" onChange={this.handleChange} min={this.state.min} max={this.state.max} step={this.state.step} value={this.props.item_value} className="form-control"/>
          <div className="pull-left">{this.state.min}</div>  
          <div className="pull-right">{this.state.max}</div>          
        </div>
      );
    }
  }
  