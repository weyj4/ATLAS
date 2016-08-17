import React from 'react';
import {Link} from 'react-router';


export default class Nav extends React.Component{

	constructor(){
		super()
		this.state = {
			showMenu : false,
			routes : [
				{to : "settings", label : 'Settings', key : 0},
				{to : "contact", label : 'Contact', key : 1},
				{to : "about", label : 'About', key : 2},

			]
		}
	}

	chooseColor = (idx) => idx % 2 == 0 ? 'gray' : '#A9A9A9'

	render(){
		return(
			<div>
				<div style={styles.bar}>
					<a onClick={() => this.setState({showMenu : !this.state.showMenu})} 
					   			href="#" style={styles.dropdownIcon}>
						&#x2630;
					</a>
				</div>
				<div style={styles.menu}>
				{
					this.state.showMenu ? 
					this.state.routes.map((route, idx) => 
						<div key={route.key} style={{backgroundColor : this.chooseColor(idx), width: 150, height : '100%'}}>
							<Link to={route.to} style={styles.menuItem}>
								<p style={{textAlign : 'center'}}>{route.label}</p>
							</Link>
						</div>
					) : undefined
				}
				</div>
			</div>
		)
	}
}

const styles = {
	bar : {
		backgroundColor : 'black',
		position : 'absolute',
		left : 0,
		right : 0,
		height : 75,
	},
	dropdownIcon : {
		position : 'absolute',
		fontSize : '300%',
		color : 'white',
		left : 20,
		textDecoration : 'none',
	},
	menuItem : {
		color : 'white',
		fontSize : '150%',
		textDecoration : 'none',
	},
	menu : {
		position : 'absolute',
		left : 0,
		top : 75,
		zIndex  : 1,
		padding : 0,
		margin : 0,
	}
}




