import React from 'react';

export class CheckBox extends React.Component { 
    constructor(props){    
      super(props);     
      this.handleChange = this.handleChange.bind(this);       
    }
  
     
    handleChange(event){
      this.props.onChange(this.props.item_key, !this.props.item_value);
    }
  
    render() { 
      return (      
        <div>
        <input type="checkbox" onChange={this.handleChange} value={this.props.item_value} checked={this.props.item_value}></input>            
        </div>
      );
    }
  }