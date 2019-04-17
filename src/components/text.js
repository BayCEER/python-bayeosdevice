import React from 'react';

export class Text extends React.Component {
    render() {
      if (isNaN(this.props.item_value)){
        return (
          <div>
            {this.props.item_value}
          </div>
        );
      } else {
        return (
          <div>
            {new Intl.NumberFormat().format(this.props.item_value)}
          </div>
        );

      }
      
    }
  }