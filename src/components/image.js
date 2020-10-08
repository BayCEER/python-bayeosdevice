import React from 'react';

export class Image extends React.Component {
  
    render(){
       return (
           <img alt={this.props.alt} src={this.props.item_value} width={this.props.width} height={this.props.height}></img>
       );
     }
}
  
 