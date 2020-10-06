import React from 'react';

export class Image extends React.Component {  
    render(){
      var src = "data:/image/jpg;base64," + this.props.item_value
      var width = this.props.prop.width ? this.props.prop.width : 100
      var height = this.props.prop.height ? this.props.prop.height : 100
       return (
           <img alt={this.props.prop.alt} src={src} width={width} height={height}></img>
       );
     }
}
  
 