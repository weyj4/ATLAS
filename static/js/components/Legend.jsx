import React from 'react';
import * as _ from 'lodash';
import * as MapActions from 'atlas/actions/MapActions';
import MapStore from 'atlas/stores/MapStore';

export default class Legend extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			classifications : [
				{label : 'Invsible', color : 'rgb(155,126,112)'},
				{label : 'Identifiable', color : 'rgb(101,167,217)'},
				{label : 'Deliverable', color : 'rgb(162,195,95)'}
			]
		}
	}

	componentDidMount(){
		$('.drag').draggable({
			helper : 'clone',
			stop : function(event, ui){
				var pos = [ui.offset.left + (ui.helper.width()/2), ui.offset.top];
				var latLng = MapStore.containerPointToLatLng(pos)
				MapActions.addMarker(latLng, require('atlas/../images/triangle.png'))
			}
		})
	}

	render(){					
		return(
			<div 
				style={_.extend(this.props.style, {
					backgroundColor : 'white'
				})} 
				{...this.props}
			>
 
				<div style={styles.classificationRow}>
				{
					this.state.classifications.map((c, i) => 
						<div key={i} style={_.extend({}, styles.classification, {
							backgroundColor : c.color
						})}>
							<div style={{
								display : 'flex',
								justifyContent : 'center',
								alignContent : 'center',
								flexDirection : 'column',
								height : '100%',
								width : '100%',
								color : 'white',
							}}>
								{c.label}
							</div>
						</div>
					)
				}
				</div>
 
				<div style={styles.coldSpots}>
					COLD SPOTS
				</div>

				<div style={styles.data}>
					DATA
				</div>

				<div style={styles.addPinContainer}>
					<div style={styles.pinContainer}>
						<img
							id='pin-img'
							class="drag"
							type="pin"
							style={styles.pinImg}
							src={require('atlas/../images/triangle.png')}
						/>	
					</div>
					<div style={styles.addPinText}>
						ADD A PIN
					</div>
				</div>
			</div>
		)
	}
}

const styles = {
	classificationRow : {
		marginLeft : '6%',
		position : 'absolute',
		height : '37%',
		width : '67%',
		top : '22%',
	},
	classification : {
		width : '31%',
		height : '100%',
		display : 'inline-block',
		borderRadius : 30,
		marginRight : '2%',
	},
	coldSpots : {
		position : 'absolute',
		bottom : '17.7%',
		left : '22.2%',
		color : 'rgb(125, 125, 125)',
	},
	data : {
		position : 'absolute',
		bottom : '17.7%',
		left : '58.5%',
		color : 'rgb(125, 125, 125)',
	},
	addPinContainer : {
		position : 'absolute',
		left : '82.53%',
		top : '8.04%',
		//height : '77.71%',
		height : '95%',
		width : '11.75%',
	},
	pinContainer : {
		borderRadius : 20,
		backgroundColor : 'rgb(239,239,239)',
	},
	pinImg : {
		maxWidth : '95%',
		maxHeight : '95%',
	},
	addPinText : {
		position : 'absolute',
		color : 'rgb(125, 125, 125)',
		width : '100%',
		fontSize : 12,
	}
}










