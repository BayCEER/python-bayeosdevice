import React from 'react';

export class TextInput extends React.Component {  
    constructor(props){
      super(props);
      this.state = {
        item_value: null
      }
      this.keyPress = this.keyPress.bind(this);                 
      this.handleChange = this.handleChange.bind(this); 
      this.onBlur = this.onBlur.bind(this);  
    }
  
    keyPress(e){    
      if (e.key == 'Enter'){
          this.props.onChange(this.props.item_key, e.target.value);    
          e.target.blur();
      }
    }
  
    onBlur(e){
      this.setState(
        { item_value: null}
      );
    }
  
    handleChange(e){    
      this.setState({
        item_value: e.target.value
      });          
    }
    
    render() {
      var value = this.state.item_value != null ? this.state.item_value:this.props.item_value;
      return (
        <div>
          <input type="text" onChange={this.handleChange} onKeyPress={this.keyPress}  onBlur={this.onBlur} value={value} className="form-control"></input>
        </div>
      );
    }
  }