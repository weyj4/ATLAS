import React from 'react'
import {connect} from 'react-redux'
import {Map, TileLayer} from 'react-leaflet'
import * as MapActions from '../actions/MapActions'

class MapPage extends React.Component{

	moveEnd = event => {
		this.props.changePos(event.target.getCenter())
	}

	changeZoom = event => {
		this.props.changeZoom(event.target.getZoom())
	}

	render(){
		return(
			<div style={{width : '100%', height : '100%'}}>
				<Map 
					ref='map'
					id='map'
					center={this.props.pos} 
					maxZoom={17}
					zoom={this.props.zoom}
					style={{width : '100%', height : '100%'}}
					scrollWheelZoom={false}
					onDragEnd={this.moveEnd}
					onZoom={this.changeZoom}
				>
				<TileLayer
					url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
			    	attribution='&copy; <a href="http://www.esri.com/">Esri</a> contributors'
			    />
				</Map>
			</div>
		)
	}
}



export default connect(
	state => ({
		pos : state.map.pos, 
		zoom : state.map.zoom
	}),
	dispatch => ({
		changePos: pos => dispatch(MapActions.changePos(pos)),
		changeZoom: zoom => dispatch(MapActions.changeZoom(zoom))
	})
)(MapPage)