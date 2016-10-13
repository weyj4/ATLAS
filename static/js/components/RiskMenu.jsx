import React from 'react';
import {Row, Col, Button, FormControl} from 'react-bootstrap'
import Select from 'react-select';
import d3 from 'd3';
import Measure from 'react-measure';
import * as LayerActions from 'atlas/actions/LayerActions';
import LayerStore from 'atlas/stores/LayerStore';
import * as LocationActions from 'atlas/actions/LocationActions';
import LocationStore from 'atlas/stores/LocationStore';
import {RIESelect} from 'riek';
import DengueMenu from 'atlas/components/DengueMenu';
import ZikaMenu from 'atlas/components/ZikaMenu';
import * as _ from 'lodash';

export default class RiskMenu extends React.Component{

	updateLocation = () => {
		var latLng = LocationStore.getLocation();
		var radius = 2000; // meters
		var bounds = new google.maps.Circle({center: latLng, radius: radius}).getBounds();
		this.searchBox.setBounds(bounds);
	}

	componentWillMount() {
        LocationStore.on('pan-change', this.updateLocation);
        LocationStore.on('change-location', this.updateLocation);
	}

    componentWillUnmount () {
    	LocationStore.removeListener('pan-change', this.updateLocation);
    	LocationStore.removeListener('change-location', this.updateLocation)
    }

	constructor(props){
		super(props);
		this.state = {
			diseases : [
				{text : 'Dengue', id : 'dengue', menu : <DengueMenu/> }, 
				{text : 'Zika', id : 'zika', menu : <ZikaMenu/>}
			],
			selectedDisease : {text : 'Zika', id : 'zika', menu : <ZikaMenu/>},
		}
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
			}else if(places.length === 1){
				var loc = places[0].geometry.location;
				LocationActions.updateLocation({
					lat : loc.lat(),
					lng : loc.lng()
				});
			}else{
				LocationActions.addLOI(places);
			}
		})
	}

	changeDisease = (disease) => {
		this.setState(_.extend({}, this.state, {
			selectedDisease : disease.select
		}))
	}

	render(){
		return(
			<div style={_.extend({}, this.props.style, {backgroundColor : 'white', zIndex : 1})}>

				<div style={{position : 'relative', 'top' : 30}}>
					<p class="text-center" style={{fontSize : 25}}>

						<RIESelect
							value={this.state.selectedDisease}
							options={this.state.diseases}
							change={this.changeDisease}
							classLoading="loading"
							propName="select"
						/>
					</p>
				</div>

				<div style={{margin : '0 auto', marginTop : 10, position : 'relative', top : 50, width : '90%', marginBottom : 30}}>
					<input 
						style={{width : '100%'}}
						ref='locInput' 
						class="controls" 
						type="text" 
						placeholder="Enter Location"
					/>
				</div>

				{this.state.selectedDisease.menu}
			</div>
		)
	}
}
