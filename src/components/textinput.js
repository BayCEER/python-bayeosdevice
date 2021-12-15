import React from "react";

export class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onChange(this.props.item_key, e.target.value);
  }

  render() {
    return (
      <div>
        <input
          type="text"
          onChange={this.handleChange}
          value={this.props.item_value}
          className="form-control"
        ></input>
      </div>
    );
  }
}
