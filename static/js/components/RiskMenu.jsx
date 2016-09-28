import React from 'react';
import {Row, Col, Button, FormControl} from 'react-bootstrap'
import Select from 'react-select';
import d3 from 'd3';
import Measure from 'react-measure';
import * as LayerActions from 'atlas/actions/LayerActions';
import LayerStore from 'atlas/stores/LayerStore';
import * as LocationActions from 'atlas/actions/LocationActions';
import LocationStore from 'atlas/stores/LocationStore';

var _ = require('underscore');

export default class RiskMenu extends React.Component{

	updateLayerState = () => {
		this.setState(_.extend({}, this.state, {
			showLayer : LayerStore.getLayerStatus(),
		}))
	}

	updateLayer = () => {
		this.setState(_.extend({}, this.state, {
			layer : LayerStore.getLayer()
		}))
	}

	updateLocation = () => {
		var latLng = LocationStore.getLocation();
		var radius = 2000; // meters
		var bounds = new google.maps.Circle({center: latLng, radius: radius}).getBounds();
		this.searchBox.setBounds(bounds);
	}

	componentWillMount() {
        LayerStore.on('change', this.updateLayerState);
        LayerStore.on('change-layer', this.updateLayer);
        LocationStore.on('pan-change', this.updateLocation);
        LocationStore.on('change-location', this.updateLocation);
	}

    componentWillUnmount () {
    	LayerStore.removeListenter('change', this.updateLayerState);
    	LayerStore.removeListenter('change-layer', this.updateLayer);
    	LocationStore.removeListenter('pan-change', this.updateLocation);
    	LocationStore.removeListenter('change-location', this.updateLocation)
    }

	constructor(props){
		super(props);
		this.state = {
			diseases : [{label : 'Dengue', value : 'dengue'} /*, {label : 'Zika', value : 'zika'}*/],
			selectedDisease : {value : 'dengue', label : 'Dengue'},
			showLayer : LayerStore.getLayerStatus(),
			layer : LayerStore.getLayer(),
			layers : LayerStore.getLayerOptions()
		}
	}

	changeDisease = (disease) => {
		this.setState(_.extend({}, this.state, {
			selectedDisease : disease
		}))
	}

	componentDidMount(){
		var latLng = LocationStore.getLocation();
		var radius = 2000; // meters
		var bounds = new google.maps.Circle({center: latLng, radius: radius}).getBounds();
		this.searchBox = new google.maps.places.SearchBox(this.refs.locInput);
		this.searchBox.setBounds(bounds);

		this.searchBox.addListener('places_changed', () => {
			var places = this.searchBox.getPlaces();
			if(places.length === 0){
				return;
			}
			var loc = places[0].geometry.location;
			LocationActions.updateLocation({
				lat : loc.lat(),
				lng : loc.lng()
			});
		})
	}

	toggleLayer = (event) => {
		event.target.blur();
		LayerActions.toggleLayer();
	}
	
	changeLayer = (layer) => {
		LayerActions.changeLayer(layer.value);
	}

	render(){
		return(
			<div style={_.extend({}, this.props.style, {backgroundColor : 'white', zIndex : 1})}>

				<div style={{position : 'relative', 'top' : 30}}>
					<p class="text-center" style={{fontSize : 25}}>{this.state.selectedDisease.label}</p>
				</div>

				<div style={{width : '80%', margin : '0 auto', position : 'relative', top : 30}}>
					<Select
						value={this.state.layer.value}
						options={this.state.layers}
						onChange={this.changeLayer}
						clearable={false}
					/>
				</div>

				<table style={{position : 'relative', 'margin' : '0 auto', top : 50, width : '90%'}}>
					<tbody>
						{
							this.state.layer.options.map((elem) => 
							 	<tr key={elem.color}>
							 		<td style={{paddingBottom : '1em'}}>
										<div style={_.extend({}, styles.cell, {color : elem.color, backgroundColor : elem.color})}></div>
									</td>
									<td style={{align : 'left', paddingBottom : '1em'}}>
										{elem.label}
									</td>
							 	</tr>
							 )

						}
					</tbody>
				</table>

				<div style={{margin : '0 auto', position : 'relative', top : 50, width : '50%'}}>
					<Button onClick={this.toggleLayer} bsStyle="primary" style={{width : '100%'}}>
					{	
						this.state.showLayer ? "Hide Layer" : "Show Layer"
					}
					</Button>
				</div>

				<div style={{margin : '0 auto', marginTop : 10, position : 'relative', top : 50, width : '90%'}}>
					<input 
						style={{width : '100%'}}
						ref='locInput' 
						class="controls" 
						type="text" 
						placeholder="Enter Location"
					/>
				</div>
			</div>
		)
	}
}

const styles = {
	cell : {
			height : 40,
			width : 40,
			opacity : 0.5,
		},
}