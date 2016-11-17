import React from 'react';
import * as Leaflet from 'react-leaflet';
import topojson from 'topojson'
import {Button} from 'react-bootstrap';
import polylabel from 'polylabel';
import LayerStore from 'atlas/stores/LayerStore';
import VectorLayer from 'atlas/components/VectorLayer';
import L from 'leaflet'
import * as _ from 'lodash';
import LocationStore from 'atlas/stores/LocationStore';
import * as LocationActions from 'atlas/actions/LocationActions';
import d3 from 'd3';
import ZikaStore from 'atlas/stores/ZikaStore';
import MapStore from 'atlas/stores/MapStore';
import * as InstructionEditorActions from 'atlas/actions/InstructionEditorActions';
import GeoJSONVTLayer from 'atlas/components/GeoJSONVTLayer';
import * as MessageActions from 'atlas/actions/MessageActions';

import {
	INVISIBLE_COLOR,
	IDENTIFIABLE_COLOR,
	DELIVERABLE_COLOR,
	BACKEND_URL
} from 'atlas/Constants'; 

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

	loadingMsg = (tick) => {
		var dots = tick % 4;
		return(
			<div style={{
				position : 'absolute',
				top : '50%',
				left : '50%',
				transform : 'translateX(-50%) translateY(-50%)',
			}}>
				<p style={{fontSize : 30, color : 'white'}}>
					Loading{'.'.repeat(dots)}
				</p>
			</div>
		)
	}

	updateDate = () => {
		var date = ZikaStore.getDate();
		console.log(`${BACKEND_URL}/zika_layer_all&date=${date}`)
		//MessageActions.setLoadingMsg(this.loadingMsg)
		$.get(`${BACKEND_URL}/zika_layer_all?date=${date}`).done(result => {
			console.log(result.features[10])
			MapStore.addFeaturesToRTree(result);
			//MessageActions.clearLoadingMsg()
			this.setState(_.extend({}, this.state, {features : result}));
	    }).fail(err => {
	      console.log(err)
	    })

		this.setState(_.extend({}, this.state, {
			zikaDate : date
		}))
	}

	updateMarkers = () => {
		this.state.markers = MapStore.getMarkers();
		this.addMarkers();
	}

	updateFeatures = () => {
		this.setState(_.extend({}, this.state, {features : MapStore.getFeatures()}))
	}

	componentWillMount() {
		ZikaStore.on('change-dates', this.updateDate);
		ZikaStore.on('change-date-index', this.updateDate);
        LayerStore.on('change', this.updateLayerState);
        LayerStore.on('change-layer', this.updateLayer);
        LocationStore.on('change-location', this.updateLocation);
        LocationStore.on('new-loi', this.updateLocationsOfInterest);
        MapStore.on('new-marker', this.updateMarkers);
        MapStore.on('new-features', this.updateFeatures);
	}

    componentWillUnmount () {
    	ZikaStore.removeListener('change-dates', this.updateDate);
    	ZikaStore.removeListener('change-date-index', this.updateDate);
    	LayerStore.removeListener('change', this.updateLayerState);
    	LayerStore.removeListener('change-layer', this.updateLayer);
    	LocationStore.removeListener('change-location', this.updateLocation);
    	MapStore.removeListener('new-marker', this.updateMarkers);
    	MapStore.removeListener('new-features', this.updateFeatures);
    }

	constructor(){
		super()
		this.markers = [];
		ZikaStore.on('change-dates change-date-index', this.updateDate);
		this.state = {
			showLayer : LayerStore.getLayerStatus(),
			loc : LocationStore.getLocation(),
			layer : LayerStore.getLayer(),
			zoom : 8,
			zikaDate : ZikaStore.getDate(),
			markers : []
		}
		if(this.state.zikaDate){
			this.updateDate()
		}
	}

	moveEnd = (loc) => {
		var coords = loc.target.getCenter();
		LocationActions.pannedTo(coords);
	}

	componentDidMount(){
		var map = this.refs.map.leafletElement;
		MapStore.setMap(map);
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

		// Add user created markers
		_.forEach(this.state.markers, marker => {
			var icon = L.icon({
				iconUrl : marker.icon,
				iconSize : [30,30]
			})
			var point = L.marker(marker.coordinates, {
				icon : icon
			}).addTo(map);

			point.on('click', () => {
				InstructionEditorActions.showEditor(marker)
			})

			this.markers.push(point);
		})
	}

	render(){
		var pallete = d3.scale.linear()
			.domain([0, 63]).interpolate(d3.interpolateRgb)
			.range(['blue', 'red'])
		return(
			<div {...this.props}>
				<Leaflet.Map 
					ref='map'
					id='map'
					center={[this.state.loc.lat, this.state.loc.lng]} 
					zoom={this.state.zoom}
					style={{width : '100%', height : '100%'}}
					scrollWheelZoom={false}
					onDragEnd={this.moveEnd}
				>
				{
					this.state.showLayer && this.state.zikaDate && this.state.features ? 
						<GeoJSONVTLayer
							id={'__id__1'}
							features={this.state.features}
							layer={{
								label : 'Columbian Zika',
				                value : 'columbia_zika',
				                fill : (d) => {
				                	/*
				                	if(d.properties.confirmed_lab == null){
				                		console.log('null')
				                	}
				                	return pallete(d.properties.confirmed_lab + d.properties.confirmed_clinic)
*/
				                	
				                	if(d.properties.confirmed_lab == undefined || 
				                	   d.properties.confirmed_clinic == undefined || 
				                	   d.properties.suspected == undefined){
				                		//missing health data
				                		if(!d.properties.pop){
				                			return INVISIBLE_COLOR;
				                		}
				                		return IDENTIFIABLE_COLOR;
				                	}else{
				                		return DELIVERABLE_COLOR;
				                	}
				                },
				                options : [],
				                notes : []
				            }}
							endpoint={`zika_layer/{z}/{x}/{y}.geojson?date=${this.state.zikaDate}`}
							tooltip={(d) => {
								return `Department: ${d.properties.department}<br/>
										Municipality: ${d.properties.municipality}<br/>
										Population: ${d.properties.pop ? d.properties.pop.toLocaleString() : 'Missing Population Data'}<br/>
										Date: ${this.state.zikaDate}<br/>
										Clinic Confirmed Cases: ${d.properties.confirmed_clinic}<br/>
										Confirmed Lab Cases: ${d.properties.confirmed_lab}<br/>
										Suspected Cases: ${d.properties.suspected}`;
							}}
						/> : null						
				}
				<Leaflet.TileLayer
					url='http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
			    	attribution='&copy; <a href="http://www.esri.com/">Esri</a> contributors'
			    />
				</Leaflet.Map>
			</div>
		)
	}
}
