import React, {Component} from 'react';
import Nav from 'atlas/components/Nav';

export default class Layout extends React.Component {
  render() {
    return (
      <div style={{position : 'absolute', top : 0, bottom : 0, left : 0, right : 0}}>
      	<Nav/>
        <div style={{display : 'flex', flexDirection : 'column', height : '100%'}}>
        	{this.props.children}
        </div>
      </div>
    );
  }
}

