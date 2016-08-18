import React from 'react'
import Map from '../components/Map';
import RiskMenu from '../components/RiskMenu'

export default class Main extends React.Component{

	render(){
		return(
			<div style={styles.mapContainer}>
				<Map style={styles.map}/>
			</div>	
		)
	}
}

const styles = {
	mapContainer : {
		position : 'absolute',
		top : 75,
		left : 0,
		bottom : 0,
		right : 0,
		zIndex : 0,
	},
	map : {
		width : '100%',
		height : '100%'
	},
	riskMenu : {
		position : 'absolute',
		right : 0,
		width : '30%',
		height : '40%',
		bottom : 0,
		zIndex : 1,
	},
}