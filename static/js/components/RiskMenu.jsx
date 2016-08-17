import React from 'react';

var _ = require('underscore');

export default class RiskMenu extends React.Component{

	constructor(){
		super()
	}

	render(){
		return(
			<div style={_.extend({}, this.props.style, styles.container)}>
				
			</div>
		)
	}
}

const styles = {
	container : {
		backgroundColor : 'white',
		zIndex : 1
	}
}