import React from "react";

import { Message } from "./message";

export class NumberInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min: props.prop.min,
      max: props.prop.max,
      step: props.prop.step ? props.prop.step : 1,
    };
    this.onChange = this.onChange.bind(this);
  }

  
  onChange(e) {
    // console.log(`onChange:${e.target.value}`);
    if (e.target.value) {
      this.props.onChange(this.props.item_key, parseFloat(e.target.value));
    }
  }

  render() {
    var error = isNaN(parseFloat(this.props.item_value));
    var message = error ? "Please insert a valid number." : "";
    var className = error ? "has-error" : "";
    return (
      <div className={className}>
        <input
          type="number"
          min={this.state.min}
          max={this.state.max}
          step={this.state.step}
          onChange={this.onChange}
          value={this.props.item_value}
          className="form-control"
        />
        <Message message={message} error={error} />
      </div>
    );
  }
}
