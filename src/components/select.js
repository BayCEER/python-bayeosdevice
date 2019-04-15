import React from 'react';

export class Select extends React.Component {  
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