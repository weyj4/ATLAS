import React from 'react';
import * as Leaflet from 'react-leaflet';
import topojson from 'topojson'
import {Button} from 'react-bootstrap';
import polylabel from 'polylabel';


var _ = require('underscore')
var d3 = require('d3')
var L = require('leaflet')

// For zika.json:
// Display POP10 if risk_zone == 1
// same for cold spot data

const BACKEND_URL = process.env.NODE_ENV === 'production' ? 
				'http://ec2-54-149-176-177.us-west-2.compute.amazonaws.com' :
				'http://localhost:8080'

const TILE_URL = `${BACKEND_URL}/test_layer/{z}/{x}/{y}.geojson`

// See `get_top_20.m` and `index.js` in `zika_risk_map/compute_density`
// for more details on how this constant was computed
const POP_CUTOFF=2.1647

export default class Map extends React.Component{

	// Filter `features` without generating any garbage
	filterPolygons(polygons, geoJson){
		var j = 0;
		for(var i = 0; i < geoJson.features.length; i++){
        	if(!polygons[geoJson.features[i].gid]){
        		polygons[geoJson.features[i].gid] = true;
        		geoJson.features[j] = geoJson.features[i];
        		j++;
        	}
        }
        geoJson.features.length = j;
	}

	constructor(){
		super()
		this.state = {
			latitude : 29.367493,
			longitude : -82.003767,
		}

		/* http://bl.ocks.org/wboykinm/7393674
		 * Experimental vector tile layer for Leaflet
		 * Uses D3 to render TopoJSON. Derived from a GeoJSON thing that was
		 * Originally by Ziggy Jonsson: http://bl.ocks.org/ZJONSSON/5602552
		 * Reworked by Nelson Minar: http://bl.ocks.org/NelsonMinar/5624141
		 */
		var component = this;
		var polygons = {}
		L.TileLayer.d3_topoJSON =  L.TileLayer.extend({
		    onAdd : function(map) {
		        L.TileLayer.prototype.onAdd.call(this,map);
		        this.map = map;
		        this._path = d3.geo.path().projection(function(d) {
		            var point = map.latLngToLayerPoint(new L.LatLng(d[1],d[0]));
		            return [point.x,point.y];
		        });
		        this.on("tileunload",function(d) {
		        	polygons = {}
		            if (d.tile.xhr) d.tile.xhr.abort();
		            if (d.tile.nodes) d.tile.nodes.remove();
		            d.tile.nodes = null;
		            d.tile.xhr = null;
		        });
		    },
		    _loadTile : function(tile,tilePoint) {
		        var self = this;
		        this._adjustTilePoint(tilePoint);

		        if (!tile.nodes && !tile.xhr) {
		            tile.xhr = d3.json(this.getTileUrl(tilePoint),function(error, geoJson) {
		                if (error) {
		                    console.log(error);
		                } else {
		                	// range of population data
        			        var range = [1, 6397];

					        var palette = d3.scale.linear()
					        		.domain(range)
					        		.interpolate(d3.interpolateRgb)
					        		.range(['blue', 'red'])

		                    tile.xhr = null;
		                    tile.nodes = d3.select(self.map._container)
		                    				.select("svg")
		                    				.append("g")

		                    component.filterPolygons(polygons, geoJson)
		                    
		                    tile.nodes.selectAll("path")
		                        .data(geoJson.features).enter()
		                      .append("path")
		                        .attr("d", self._path)
		                        .style('stroke', '#000000')
		                        .style('fill-opacity', 0.4)
		                        .style("stroke-width", "1.5px")
		                        .style('fill', (d) => {
		                        	var getPole = polylabel;
		                        	polygons[d.gid] = true
		                        	if(d.properties.zika_risk){
		                        		if(!d.properties.care_delivery){
			                        		if(d.properties.pop_per_sq_km >= POP_CUTOFF){
			                        			return 'red'; //level 1
			                        		}else{
			                        			return 'orange'; // level 2
			                        		}
		                        		}
		                        	}
		                        	if(!d.properties.care_delivery && !d.properties.zika_risk && d.properties.pop_per_sq_km >= POP_CUTOFF){
		                        		return 'yellow'; // level 3
		                        	}
		                        	return 'lightgray';
		                        }).on('mousemove', (d, i, children) => {
				                    var mouse = d3.mouse(document.body);
				                    var point = new L.Point(mouse[1], mouse[0]);
				                    var coords = component.refs.map.leafletElement.layerPointToLatLng(point)

				                    var chromeIsDumb = component;
				                    component.tooltip.classed('hidden', false)
				                        .attr('style', 'left:' + (mouse[0] + 15) +
				                                'px; top:' + (mouse[1] - 35) + 'px')
				                        .html(`ID: ${d.gid}<br/>Population Density: ${d.properties.pop_per_sq_km}<br/>
				                        	   Zika Risk: ${d.properties.zika_risk}<br/>Care Delivery: ${d.properties.care_delivery}
				                        	   <br/>Coordinates: (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
				                })
				                .on('mouseout', () => component.tooltip.classed('hidden', true))
		                }
		            });
		        }
		    }
		});
	}

	componentDidMount(){
		var map = this.refs.map.leafletElement;
		map._initPathRoot();
		// Add a fake GeoJSON line to coerce Leaflet into creating the <svg> tag that d3_geoJson needs
		new L.geoJson({"type": "LineString","coordinates":[[0,0],[0,0]]}).addTo(map);

		this.polyLayer = new L.TileLayer.d3_topoJSON(TILE_URL, {layerName : 'blocks'}).addTo(map);

		this.tooltip = d3.select(this.refs.map.leafletElement._container).append('div')
            	.attr('class', 'hidden tooltip')
            	.attr('id', 'tooltip');
        console.log('Added tooltip')
	}

	gotoHighestRisk = (event) => {
		event.target.blur()
		$.get(`${BACKEND_URL}/HighestRisk`).then((res) => {
			var temp = res[1]
			res[1] = res[0];
			res[0] = temp;
			this.refs.map.leafletElement.panTo(res)
			console.log(res)
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
					<Leaflet.TileLayer
						url='http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
				    	attributio	n='&copy; <a href="http://www.esri.com/">Esri</a> contributors'
				    />
				</Leaflet.Map>
			</div>
		)
	}
}
