'use strict';

class Text extends React.Component {
  render() {
    return (
      <div>
        {this.props.item_value}
      </div>
    );
  }
}

class TextInput extends React.Component {  
  constructor(props){
    super(props);
    this.state = {
      item_value: props.item_value
    }
    this.keyPress = this.keyPress.bind(this);                 
    this.handleChange = this.handleChange.bind(this); 
  }

  handleChange(e){    
    this.setState({
      item_value: e.target.value
    });          
  }
  
  keyPress(e){    
    if (e.key == 'Enter' && this.state.item_value != ""){
        this.props.onChange(this.props.item_key, this.state.item_value);    
        e.target.blur();
    }
  }
  
   render() {
    return (
      <div>
        <input type="text" onChange={this.handleChange} onKeyPress={this.keyPress} value={this.state.item_value} className="form-control"></input>
      </div>
    );
  }
}


class NumberInput extends React.Component {  
  constructor(props){
    super(props);       
    this.state = {
      min: props.prop.min,
      max: props.prop.max,
      step: props.prop.step ? props.prop.step: 1,
      item_value: props.item_value      
    }
    this.handleChange = this.handleChange.bind(this);
    this.keyPress = this.keyPress.bind(this);                 
  }

  keyPress(e){    
    if (e.key == 'Enter' && this.state.item_value != ""){     
      this.props.onChange(this.props.item_key, this.state.item_value);    
      e.target.blur();
    }
  }

  handleChange(e){  
      this.setState({
        item_value: e.target.value
      });          
  }
    
  render() {
    return (      
      <div>
        <input type="number" min={this.state.min} max={this.state.max} step={this.state.step} onChange={this.handleChange} onKeyPress={this.keyPress} value={this.state.item_value} className="form-control"/>                      
      </div>
    );
  }
}


class Slider extends React.Component {  
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


class Select extends React.Component {  
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);       
    var ops = this.props.prop.map((value) =>
    <option value={value} key={value}>{value}</option>
    );
    this.state = {
      options : ops
    }
  }
  handleChange(e){
      this.props.onChange(this.props.item_key, e.target.value);
      e.target.blur();
  }
  render() {    
    return (
      <div>
        <select onChange={this.handleChange} value={this.props.item_value} className="form-control">
            {this.state.options}
        </select>        
      </div>
    );
  }
}

class Toggle extends React.Component { 
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



class CheckBox extends React.Component { 
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






 





