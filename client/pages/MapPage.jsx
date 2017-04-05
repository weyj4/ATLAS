import React from 'react'
import {connect} from 'react-redux'
import {Map, TileLayer, Marker, Polyline} from 'react-leaflet'
import * as MapActions from '../actions/MapActions'
import L from 'leaflet'

class MapPage extends React.Component{

	moveEnd = event => {
		this.props.changePos(event.target.getCenter())
	}

	changeZoom = event => {
		this.props.changeZoom(event.target.getZoom())
	}

	getIcon = type => {
		switch(type){
			case 'cs':
				return 'https://data.kawok.net/images/CS.png'
			case 'ps':
				return 'https://data.kawok.net/images/PS.png'
			case 'ae':
				return 'https://data.kawok.net/images/AE.png'
			default:
				console.log('Unrecognized type!')
		}
	}

	handleClick = event => {
		var marker = event.target.options.marker
		this.props.activateMarker(marker)
	}

	render(){
		var counter = 0;
		console.log(this.props)
		var children = this.props.markers.filter(m => m.active).map((m, i) => 
			<Marker
				icon={L.icon({
					iconUrl : this.getIcon(m.type),
					iconSize : [30,30]
				})}
				marker={m}
				onClick={this.handleClick}
				key={i}
				position={[m.geom.coordinates[1], m.geom.coordinates[0]]}
			/>
		)
		counter += children.length

		for(let markerIdx in this.props.activeMarkers){
			let marker = this.props.activeMarkers[markerIdx];
			for(let childIdx of marker.neighbors){
				let child = this.props.markers[childIdx];
				children.push(
					<Polyline
						key={counter}
						positions={[
							[marker.geom.coordinates[1], marker.geom.coordinates[0]],
							[child.geom.coordinates[1], child.geom.coordinates[0]]
						]}
					/>
				)
				children.push(
					<Marker
						icon={L.icon({
							iconUrl : this.getIcon(child.type),
							iconSize : [30,30]
						})}
						marker={child}
						onClick={this.handleClick}
						key={counter+1}
						position={[child.geom.coordinates[1], child.geom.coordinates[0]]}
					/>	
				)
				counter += 2;
			}
		}

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
				{children}
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
	state => state.map,
	dispatch => ({
		changePos: pos => dispatch(MapActions.changePos(pos)),
		changeZoom: zoom => dispatch(MapActions.changeZoom(zoom)),
		activateMarker: markers => dispatch(MapActions.activateMarker(markers))
	})
)(MapPage)