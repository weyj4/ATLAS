import React from 'react';
import MapGL from 'react-map-gl'
import * as Leaflet from 'react-leaflet';
//import {TRACTS} from '../data/census_tracts/new_york/new_york';
import {Zika} from '../data/zika-simplified';
var _ = require('underscore')
var d3 = require('d3')

// For zika.json:
// Display POP10 if risk_zone == 1
// same for cold spot data

export default class Map extends React.Component{

	constructor(){
		super()
		this.state = {
			latitude : 29.367493,
			longitude : -82.003767,
		}
	}

	mkColor = (index) => {
		var third = (this.range[1] - this.range[0]) / 3;
		if(index <= this.range[0] + third){
			return 'red';
		}else if(index <= this.range[0] + 2*third){
			return 'blue'
		}else{
			return 'green'
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
		var pop = d.target.options.value;
		d.target.bindPopup('Population = ' + pop.toLocaleString()).openPopup(center)
	}

	getRange(){
		var range = [Number.MAX_VALUE, Number.MIN_VALUE];
		var features = Zika.features;
		for(var i = 0; i < features.length; i++){
			range[0] = Math.min(range[0], features[i].properties.POP10);
			range[1] = Math.max(range[1], features[i].properties.POP10);
		}
		return range
	}

	render(){
		this.range = this.getRange()
		return(
				<Leaflet.Map 
					ref='map'
					id='map'
					center={[this.state.latitude, this.state.longitude]} 
					zoom={7}
					style={this.props.style}
					scrollWheelZoom={false}
				>
					<Leaflet.TileLayer
						url='http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
				    	attributio	n='&copy; <a href="http://www.esri.com/">Esri</a> contributors'
				    />
				    {
				    	Zika.features.map((p, i) => {
				    		var bounds = p.geometry.coordinates[0]
				    		// Shape files come lng,lat but we need them swapped
				    		for(var j = 0; j < bounds.length; j++){
				    			var temp = bounds[j][0]
				    			bounds[j][0] = bounds[j][1];
				    			bounds[j][1] = temp;
				    		}
				    		return(
				    			<Leaflet.Polygon
					    			key={i}
					    			onClick={this.click}
					    			weight={2}
					    			color={this.mkColor(p.properties.POP10)}
					    			fillColor={this.mkColor(p.properties.POP10)}
					    			positions={bounds}
					    			value={p.properties.POP10}
					    		/>
				    		)
				    	})
				    }
				</Leaflet.Map>
		)
	}
}
