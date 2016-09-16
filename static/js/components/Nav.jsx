import React from 'react';
import {Link} from 'react-router';
import * as BS from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';



export default class Nav extends React.Component{

	constructor(){
		super()
		this.state = {
			active : 2
		}
	}


	onSelect = (event) => {
		this.setState({active : event})
	}

	render(){
		return(
			<BS.Navbar style={{marginBottom : 0}}>
				<BS.Navbar.Brand>
		          <a href="#">ATLAS</a>
		        </BS.Navbar.Brand>

		        <BS.Nav activeKey={this.state.active} onSelect={this.onSelect}>
		          <LinkContainer to="/landing-page">
		            <BS.NavItem eventKey={1}>
		              Home
		            </BS.NavItem>
		          </LinkContainer>
		          <LinkContainer to="/main">
		            <BS.NavItem eventKey={2}>
		              Risk Map
		            </BS.NavItem>
		          </LinkContainer>
		        </BS.Nav>
		      </BS.Navbar>
		)
	}
}


