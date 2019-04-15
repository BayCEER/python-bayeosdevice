import React from 'react';

export class Text extends React.Component {
    render() {
      return (
        <div>
          {this.props.item_value}
        </div>
      );
    }
  }