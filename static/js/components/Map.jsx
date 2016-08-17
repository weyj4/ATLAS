import React from 'react';
import MapGL from 'react-map-gl'
import * as Leaflet from 'react-leaflet';
var _ = require('underscore')

export default class Map extends React.Component{

	constructor(){
		super()
		this.state = {
			latitude : 40.7918850,
			longitude : -73.9525810,
		}
	}

	render(){
		const rect = [[40.7818, -73.9525], [40.79, -73.9425]]

		return(
				<Leaflet.Map 
					id='map'
					center={[this.state.latitude, this.state.longitude]} 
					zoom={15}
					style={this.props.style}
					scrollWheelZoom={false}
				>
					<Leaflet.TileLayer
						url='http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
				    	attribution='&copy; <a href="http://www.esri.com/">Esri</a> contributors'
				    />
				    <Leaflet.Rectangle
				    	bounds={rect}
				    />
				</Leaflet.Map>
		)
	}
}
