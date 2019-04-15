import React from 'react';

export class Message extends React.Component {  
    render(){
     if (!this.props.error){
       return null;
     } else {
       return (
         <span class="help-block">{this.props.message}</span>
       );
     }
   }
  }
 