import React from 'react';
import MapGL from 'react-map-gl'
import * as Leaflet from 'react-leaflet';
import {TRACTS} from '../data/census_tracts/new_york/new_york';
var _ = require('underscore')

export default class Map extends React.Component{

	constructor(){
		super()
		this.state = {
			latitude : 40.7918850,
			longitude : -73.9525810,
		}
	}

	mkColor = (index) => {
		switch(index){
			case 0: return 'red';
			case 1: return 'blue';
			case 2: return 'green';
		}
	}

	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}

	click = (d) => {
		var component = this
		var center = d.target.getBounds().getCenter()
		console.log(center)
	}

	render(){
		return(
				<Leaflet.Map 
					ref='map'
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
				    {
				    	TRACTS.features.map((p, i) => {
				    		var bounds = p.geometry.coordinates[0]
				    		// Shape files come lng,lat but we need them swapped
				    		for(var j = 0; j < bounds.length; j++){
				    			var temp = bounds[j][0]
				    			bounds[j][0] = bounds[j][1];
				    			bounds[j][1] = temp;
				    		}

				    		// fake data for now...
				    		p.index = this.getRandomInt(0, 3)
				    		return(
				    			<Leaflet.Polygon
					    			key={i}
					    			onClick={this.click}
					    			weight={2}
					    			color={this.mkColor(p.index)}
					    			fillColor={this.mkColor(p.index)}
					    			positions={bounds}
					    		/>
				    		)
				    	})
				    }
				</Leaflet.Map>
		)
	}
}
