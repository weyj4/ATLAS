import React, {Component} from 'react';
import Nav from 'atlas/components/Nav';

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <Nav/>
        {this.props.children}
      </div>
    );
  }
}

