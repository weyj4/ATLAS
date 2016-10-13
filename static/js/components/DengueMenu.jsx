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
import * as _ from 'lodash';

export default class DengueMenu extends React.Component{

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
    	LayerStore.removeListener('change', this.updateLayerState);
    	LayerStore.removeListener('change-layer', this.updateLayer);
    	LocationStore.removeListener('pan-change', this.updateLocation);
    	LocationStore.removeListener('change-location', this.updateLocation)
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

	toggleLayer = (event) => {
		event.target.blur();
		LayerActions.toggleLayer();
	}
	
	changeLayer = (layer) => {
		LayerActions.changeLayer(layer.value);
	}

	render(){
		return(
			<div {...this.props}>
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

				<div style={{width : '100%', margin : '0 auto', position : 'relative', top : 60}}>
					<ul>
					{
						this.state.layer.notes.map((note, i) => 
							<li key={i}>{note}</li>
						)
					}
					</ul>
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