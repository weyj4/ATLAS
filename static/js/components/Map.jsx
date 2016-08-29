import React from 'react';
import MapGL from 'react-map-gl'
import * as Leaflet from 'react-leaflet';
import topojson from 'topojson'
var _ = require('underscore')
var d3 = require('d3')
var L = require('leaflet')

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
		                    				.style('opacity', '0.2')
		                    				.append("g")

		                    tile.nodes.selectAll("path")
		                        .data(geoJson.features).enter()
		                      .append("path")
		                        .attr("d", self._path)
		                        .style('stroke', '#000000')
		                        .style('fill-opacity', '0.2')
		                        .style("stroke-width", "1.5px")
		                        .style('fill', (d) => {
		                        	return palette(d.properties.pop10)
		                        })
		                }
		            });
		        }
		    }
		});
	}

	componentDidMount(){
		var map = this.refs.map.leafletElement;
		map._initPathRoot();
		var url = 'http://localhost:8082/test_layer/{z}/{x}/{y}.geojson'
		// Add a fake GeoJSON line to coerce Leaflet into creating the <svg> tag that d3_geoJson needs
		new L.geoJson({"type": "LineString","coordinates":[[0,0],[0,0]]}).addTo(map);

		this.polyLayer = new L.TileLayer.d3_topoJSON(url, {layerName : 'blocks'}).addTo(map);
	}

	render(){
		return(
				<Leaflet.Map 
					ref='map'
					id='map'
					center={[this.state.latitude, this.state.longitude]} 
					zoom={15}
					style={this.props.style}
					scrollWheelZoom={false}
				>
					<Leaflet.TileLayer
						url='http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
				    	attributio	n='&copy; <a href="http://www.esri.com/">Esri</a> contributors'
				    />
				</Leaflet.Map>
		)
	}
}
