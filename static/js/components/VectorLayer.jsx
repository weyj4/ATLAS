import React, {PropTypes} from 'react';
import {MapComponent} from 'react-leaflet';
import polylabel from 'polylabel';
var L = require('leaflet');
import MapStore from 'atlas/stores/MapStore';

const BACKEND_URL = process.env.NODE_ENV === 'production' ? 
				'http://ec2-54-149-176-177.us-west-2.compute.amazonaws.com' :
				'http://localhost:8080'

export default class VectorLayer extends MapComponent{
	static contextTypes = {
		map : PropTypes.instanceOf(L.Map)
	};

	filterPolygons(geoJson){
		var j = 0;
		for(var i = 0; i < geoJson.features.length; i++)	{
        	if(!this.polygons[geoJson.features[i].gid]){
        		this.polygons[geoJson.features[i].gid] = true;
        		geoJson.features[j] = geoJson.features[i];
        		j++;
        	}
        }
        geoJson.features.length = j;
	}

	constructor(props){
		super(props);
		var component = this;
		this.polygons = {};
		MapStore.clearRTree();
		L.TileLayer.d3_topoJSON =  L.TileLayer.extend({
		    onAdd : function(map) {
		        L.TileLayer.prototype.onAdd.call(this,map);
		        this.map = map;
		        this._path = d3.geo.path().projection(function(d) {
		            var point = map.latLngToLayerPoint(new L.LatLng(d[1],d[0]));
		            return [point.x,point.y];
		        });
		        this.on("tileunload",function(d) {
		        	component.polygons = {}
					MapStore.clearRTree();
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
		                    tile.xhr = null;
		                    tile.nodes = d3.select(component.context.map._container)
		                    				.select("svg")
		                    				.append("g")

		                    var map = component.context.map;
		                    var strokeWidth = 1; //Math.pow(map.getZoom() / map.getMaxZoom(), 3) * 2;

		                    component.filterPolygons(geoJson)
		                    var paths = tile.nodes.selectAll("path")
		                        .data(geoJson.features).enter()
		                      .append("path")
		                      	.attr('class', component.props.id)
		                        .attr("d", self._path)
//		                        .style('fill-opacity', 0.7)
		                        .style("stroke-width", `${strokeWidth}px`)
		                        .style('stroke', '#000000')
		                        .style('fill', (d) => {
		                        	component.polygons[d.gid] = true
		                        	return component.props.layer.fill(d);
		                        })
		                    if(component.props.tooltip){
		                    	paths.on('mousemove', (d, i, children) => {
				                    component.tooltipPolygonInfo.html(component.props.tooltip(d))
				                })
		                    }

		                    MapStore.addFeaturesToRTree(geoJson);

		                }
		            });
		        }
		    }
		});
	}

	addLayer = () => {
		var map = this.context.map;
		map._initPathRoot();

		// Add a fake GeoJSON line to coerce Leaflet into creating the <svg> tag that d3_geoJson needs
		this.fakeGeoJSON = new L.geoJson({"type": "LineString","coordinates":[[0,0],[0,0]]}).addTo(map);

		this.polyLayer = new L.TileLayer.d3_topoJSON(`${BACKEND_URL}/${this.props.endpoint}`, {layerName : 'blocks'}).addTo(map);

        this.tooltip = d3.select(this.context.map._container).append('div')
        	.attr('class', 'hidden tooltip')
        	.attr('id', 'tooltip')

        this.tooltipPolygonInfo = this.tooltip.append('span');

        this.tooltipCoordinates = this.tooltip.append('span');

        map.on('mousemove', (d) => {
        	this.tooltip.classed('hidden', false)
        		.attr('style', `left: ${d.originalEvent.clientX}px; top: ${d.originalEvent.clientY}px`)
        	this.tooltipCoordinates.html(`<br/>Coordinates: (${d.latlng.lat.toFixed(4)}, ${d.latlng.lng.toFixed(4)})`)
        })
        map.on('mouseout', (d) => this.tooltip.classed('hidden', true))
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
		this.tooltip.classed('hidden', true)
		this.clear()
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.endpoint !== this.props.endpoint){
			this.clear();
			this.polygons = {}
			MapStore.clearRTree();
			this.props = nextProps;
			this.addLayer();
		}else if(nextProps.layer !== this.props.layer){
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