import React, {PropTypes} from 'react';
import {MapComponent} from 'react-leaflet';
import polylabel from 'polylabel';

var L = require('leaflet');

const BACKEND_URL = process.env.NODE_ENV === 'production' ? 
				'http://ec2-54-149-176-177.us-west-2.compute.amazonaws.com' :
				'http://localhost:8080'

const TILE_URL = `${BACKEND_URL}/test_layer/{z}/{x}/{y}.geojson`
// See `get_top_20.m` and `index.js` in `zika_risk_map/compute_density`
// for more details on how this constant was computed
const POP_CUTOFF=2.1647

export default class VectorLayer extends MapComponent{
	static contextTypes = {
		map : PropTypes.instanceOf(L.Map)
	};

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

	constructor(props){
		super(props);
		var component = this;
		var polygons = {};
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
		    onRemove : function(map){
		    	L.TileLayer.prototype.onRemove.call(this, map);
		    },
		    _loadTile : function(tile,tilePoint) {
		        var self = this;
		        this._adjustTilePoint(tilePoint);

		        if (!tile.nodes && !tile.xhr) {
		            tile.xhr = d3.json(this.getTileUrl(tilePoint),function(error, geoJson) {
		                if (error) {
		                    console.log(error);
		                } else if(!component.unmounted){
		                	// range of population data
        			        var range = [1, 6397];

					        var palette = d3.scale.linear()
					        		.domain(range)
					        		.interpolate(d3.interpolateRgb)
					        		.range(['blue', 'red'])

		                    tile.xhr = null;
		                    tile.nodes = d3.select(component.context.map._container)
		                    				.select("svg")
		                    				.append("g")

		                    component.filterPolygons(polygons, geoJson)
		                    
		                    tile.nodes.selectAll("path")
		                        .data(geoJson.features).enter()
		                      .append("path")
		                        .attr("d", self._path)
		                        .style('fill-opacity', 0.2)
		                        .style("stroke-width", "0px")
		                        .style('fill', (d) => {
		                        	polygons[d.gid] = true
		                        	return component.props.layer.fill(d);
		                        }).on('mousemove', (d, i, children) => {
				                    var mouse = d3.mouse(document.body);
				                    var point = new L.Point(mouse[1], mouse[0]);
				                    var coords = component.context.map.layerPointToLatLng(point)

				                    component.tooltip.classed('hidden', false)
				                        .attr('style', 'left:' + (mouse[0] + 15) +
				                                'px; top:' + (mouse[1] - 35) + 'px')
				                        .html(`ID: ${d.gid}<br/>Population Density: ${d.properties.pop_per_sq_km}<br/>
				                        	   Zika Risk: ${d.properties.zika_risk}<br/>Care Delivery: ${d.properties.care_delivery}
				                        	   <br/>Coordinates: (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);

				                }).on('mouseout', (d) => {
				                	component.tooltip.classed('hidden', true)
				                })
		                }
		            });
		        }
		    }
		});''
	}

	addLayer = () => {
		var map = this.context.map;
		map._initPathRoot();

		// Add a fake GeoJSON line to coerce Leaflet into creating the <svg> tag that d3_geoJson needs
		this.fakeGeoJSON = new L.geoJson({"type": "LineString","coordinates":[[0,0],[0,0]]}).addTo(map);

		this.polyLayer = new L.TileLayer.d3_topoJSON(TILE_URL, {layerName : 'blocks'}).addTo(map);

		this.tooltip = d3.select(this.context.map._container).append('div')
            	.attr('class', 'hidden tooltip')
            	.attr('id', 'tooltip');
	}

	componentDidMount(){
		this.addLayer()
	}

	clear = () => {
		const svg = d3.select(this.context.map._container).select('svg');
		svg.selectAll('*').remove();
		this.context.map.removeLayer(this.polyLayer);
	}

	componentWillUnmount(nextProps){
		this.unmounted = true;
		this.clear()
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.layer !== this.props.layer){
			this.props = nextProps;
			var selection = d3.select(this.context.map._container)
				.select('svg')
				.selectAll('g')
				.selectAll('path')
				.style('fill', (d) => {
					if(d){
						return this.props.layer.fill(d);
					}
				})
		}
		
	}

	render(){
		return(null)
	}
}