import React from 'react';
import * as Leaflet from 'react-leaflet';
import topojson from 'topojson'
import {Button} from 'react-bootstrap';
import polylabel from 'polylabel';
import LayerStore from 'atlas/stores/LayerStore';
import VectorLayer from 'atlas/components/VectorLayer';
import L from 'leaflet'
import d3 from 'd3';
import _ from 'underscore';
import LocationStore from 'atlas/stores/LocationStore';
import * as LocationActions from 'atlas/actions/LocationActions';

const BACKEND_URL = process.env.NODE_ENV === 'production' ? 
				'http://ec2-54-149-176-177.us-west-2.compute.amazonaws.com' :
				'http://localhost:8080'

const DG_API_KEY='pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpdGJ4cmxwdjA5MHcyenM2Ym1nZGw4azYifQ.Iz3NSorwN_1qiWdXKZaK9w'

export default class Map extends React.Component{

	updateLayerState = () => {
		this.setState(_.extend({}, this.state, {
			showLayer : LayerStore.getLayerStatus()
		}))
	}

	updateLocation = () => {
		// Easier to just pan rather than have React re-render the scene
		// Otherwise we need to keep track of the current zoom level etc...
		//this.refs.map.leafletElement.panTo(LocationStore.getLocation())
		this.setState(_.extend({}, this.state, {
			loc : LocationStore.getLocation(),
			loi : LocationStore.getLOI(),
		}))
	}

	updateLayer = () => {
		this.setState(_.extend({}, this.state, {
			layer : LayerStore.getLayer()
		}))
	}

	updateLocationsOfInterest = () => {
		var loi = LocationStore.getLOI();
		this.state.loi = loi;
		this.addMarkers();
	}

	componentWillMount() {
        LayerStore.on('change', this.updateLayerState);
        LayerStore.on('change-layer', this.updateLayer);
        LocationStore.on('change-location', this.updateLocation);
        LocationStore.on('new-loi', this.updateLocationsOfInterest);
	}

    componentWillUnmount () {
    	LayerStore.removeListener('change', this.updateLayerState)
    	LayerStore.removeListener('change-layer', this.updateLayer)
    	LocationStore.removeListener('change-location', this.updateLocation)
    }

	constructor(){
		super()
		this.markers = [];
		this.state = {
			showLayer : LayerStore.getLayerStatus(),
			loc : LocationStore.getLocation(),
			layer : LayerStore.getLayer(),
			zoom : 15,
		}
	}

	gotoHighestRisk = (event) => {
		event.target.blur()
		$.get(`${BACKEND_URL}/HighestRisk`).then((res) => {
			var temp = res[1]
			res[1] = res[0];
			res[0] = temp;
			this.refs.map.leafletElement.panTo(res)
		})
	}

	moveEnd = (loc) => {
		var coords = loc.target.getCenter();
		LocationActions.pannedTo(coords);
	}

	componentDidMount(){
		var map = this.refs.map.leafletElement;
		// Keep track of the zoom level.  Don't actually set the state
		// though, this is only necessary when a different state change
		// occurs and we want to remember what the zoom level is.
		map.on('zoomend', (z) => {
			this.state.zoom = map.getZoom();
		})
		this.addMarkers();
	}

	addMarkers = () => {
		var map = this.refs.map.leafletElement;
		for(var i = 0; i < this.markers.length; i++){
			map.removeLayer(this.markers[i]);
		}
		this.markers = [];
		if(this.state.loi){
			for(var i = 0; i < this.state.loi.locations.length; i++){
				var loc = this.state.loi.locations[i];

				/*
				var icon = L.icon({
					iconUrl : loc.icon,
					iconSize : [25, 25]
				})*/

				var marker = new L.marker({
					lat : loc.geometry.location.lat(),
					lng : loc.geometry.location.lng()
				}/* {icon : icon}*/);
				marker.bindPopup(loc.name);

				let circle = new L.circle(marker.getLatLng(), 5000);
				marker.on('popupopen', () => {
					// 5 km circle
					circle.addTo(this.refs.map.leafletElement);
				})
				marker.on('popupclose', () => {
					this.refs.map.leafletElement.removeLayer(circle);
				})
				marker.addTo(map);
				this.markers.push(marker);
			}
			map.fitBounds(this.state.loi.bounds);
		}
	}

	render(){
		return(
			<div {...this.props}>
				<Button 
					bsStyle="danger" 
					style={{right : 10, top : 10, zIndex : 2, position : 'absolute'}}
					onClick={this.gotoHighestRisk}
				>
					Highest Risk
				</Button>
				<Leaflet.Map 
					ref='map'
					id='map'
					center={[this.state.loc.lat, this.state.loc.lng]} 
					zoom={this.state.zoom}
					style={{width : '100%', height : '100%'}}
					scrollWheelZoom={false}
					onDragEnd={this.moveEnd}
				>
				{/*
				<VectorLayer
					id={'__id__1'}
					layer={{
						value : 'water',
						label : 'Water',
						fill : (d) => 'pink'
					}}
					endpoint='water_layer/{z}/{x}/{y}.geojson'
					tooltip={(d, coords) => `Name: ${d.properties.name}`}
				/>*/}
				{
					this.state.showLayer ? 
						<VectorLayer 
							id={'__id__2'}
							layer={this.state.layer}
							endpoint='test_layer/{z}/{x}/{y}.geojson'
							tooltip={(d, coords) => {
								var pop = d.properties.pop_per_sq_km * 1000
								return `ID: ${d.gid}<br/>Population Density: ${pop.toFixed(1)} people/km<sup>2</sup><br/>
		                        	   Zika Risk: ${d.properties.zika_risk}<br/>Care Delivery: ${d.properties.care_delivery}
		                        	   <br/>Coordinates: (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`
							}}
						/> : null
						
				}
				<Leaflet.TileLayer
					url='http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
			    	attributio	n='&copy; <a href="http://www.esri.com/">Esri</a> contributors'
			    />
				</Leaflet.Map>
			</div>
		)
	}
}
