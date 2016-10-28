import React from 'react'
import Map from 'atlas/components/Map';
import RiskMenu from 'atlas/components/RiskMenu';
import Legend from 'atlas/components/Legend';

export default class Main extends React.Component{

	render(){
		return(
			<div
				style={{
					height : '100%',
					width : '100%',
					position : 'absolute',
					textAlign : 'center',
				}}
			>
				<Map 
					style={{
						width : '100%',
						height : '100%',
						position : 'absolute',
					}}
				/>
				<Legend
					style={{
						width : '80%',
						position : 'absolute',
						bottom : '5%',
						zIndex : 2,
						height : 125,
						left : '12%',
						right : '12%',
						borderRadius : 20,
					}}
				/>
			</div>	
		)
	}
}