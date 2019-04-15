import React from 'react';

export class Toggle extends React.Component { 
    constructor(props){   
      super(props);
          
      this.state = {
        text_on : props.prop.text_on ? props.prop.text_on : "On",
        text_off: props.prop.text_off ? props.prop.text_off : "Off",
        width: props.prop.width ? props.prop.width : 58,
        height: props.prop.height ? props.prop.height : 34
      }
      this.handleChange = this.handleChange.bind(this);       
    }
  
    handleChange(e){
      this.props.onChange(this.props.item_key, !this.props.item_value);
      e.target.blur();
    }
  
    render() { 
      const className = "toggle btn btn-" + (this.props.item_value ? "primary on":"default off");
      const style={'width': this.state.width + 'px','height':this.state.height + 'px'};
      return (      
        <div className={className} style={style}>
          <div className="toggle-group" onClick={this.handleChange}>
            <label className="btn btn-primary toggle-on">{this.state.text_on}</label>
            <label className="btn btn-default toggle-off">{this.state.text_off}</label>          
            <span className="toggle-handle btn btn-default"></span>          
          </div>
        </div>
      );
    }
  }