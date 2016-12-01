import React from 'react'
import { Link } from 'react-router'
import * as BS from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

export default class Nav extends React.Component {

  constructor () {
    super()
    this.state = {
      active: 1
    }
  }

  onSelect = (event) => {
    this.setState({active: event})
  }

  render () {
    return (
      <BS.Navbar style={{marginBottom: 0, zIndex: 5000}} collapseOnSelect={true}>
        <BS.Navbar.Header>
          <BS.Navbar.Brand>
            <a href='#'>ATLAS</a>
          </BS.Navbar.Brand>
          <BS.Navbar.Toggle/>
        </BS.Navbar.Header>
        <BS.Navbar.Collapse>
          <BS.Nav activeKey={this.state.active} onSelect={this.onSelect}>
            <LinkContainer to='/landing-page'>
              <BS.NavItem eventKey={1}>
                Home
              </BS.NavItem>
            </LinkContainer>
            <LinkContainer to='/main'>
              <BS.NavItem eventKey={2}>
                Map
              </BS.NavItem>
            </LinkContainer>
          </BS.Nav>
        </BS.Navbar.Collapse>
      </BS.Navbar>
    )
  }
}
