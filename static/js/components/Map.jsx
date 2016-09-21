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

	componentWillMount() {
        LayerStore.on('change', this.updateLayerState);
	}

    componentWillUnmount () {
    	LayerStore.removeListenter('change', this.updateLayerState)
    }

	constructor(){
		super()
		this.state = {
			latitude : 29.367493,
			longitude : -82.003767,
			showLayer : LayerStore.getLayerStatus(),
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
					center={[this.state.latitude, this.state.longitude]} 
					zoom={15}
					style={{width : '100%', height : '100%'}}
					scrollWheelZoom={false}
				>
				{
					this.state.showLayer ? <VectorLayer/> : null
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
