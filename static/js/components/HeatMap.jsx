import React, { PropTypes } from 'react'
import { MapComponent } from 'react-leaflet'
import polylabel from 'polylabel'
var L = require('leaflet')
import MapStore from 'atlas/stores/MapStore'
import HeatmapLayer from 'react-leaflet-heatmap-layer'

// var HeatMapOverlay = require('atlas/L.Heatmap.js')

const BACKEND_URL = process.env.NODE_ENV === 'production' ?
  'http://ec2-54-149-176-177.us-west-2.compute.amazonaws.com' :
  'http://localhost:8080'

export default class VectorLayer extends MapComponent {
  static contextTypes = {
    map: PropTypes.instanceOf(L.Map)
  }

  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount () {
    var component = this
    this.polygons = {}
    MapStore.clearRTree()
    L.TileLayer.d3_topoJSON = L.TileLayer.extend({
      onAdd: function (map) {
        L.TileLayer.prototype.onAdd.call(this, map)
        this.map = map
        this._path = d3.geo.path().projection(function (d) {
          var point = map.latLngToLayerPoint(new L.LatLng(d[1], d[0]))
          return [point.x, point.y]
        })
        this.on('tileunload', function (d) {
          component.polygons = {}
          component.stale = true
          if (d.tile.xhr) d.tile.xhr.abort()
          if (d.tile.nodes) d.tile.nodes.remove()
          d.tile.nodes = null
          d.tile.xhr = null
        })
      },
      onRemove: function (map) {
        L.TileLayer.prototype.onRemove.call(this, map)
      },
      _loadTile: function (tile, tilePoint) {
        var self = this
        this._adjustTilePoint(tilePoint)

        if (!tile.nodes && !tile.xhr) {
          tile.xhr = d3.json(this.getTileUrl(tilePoint), function (error, geoJson) {
            if (error) {
              console.log(error)
            } else if (!component.unmounted) {
              tile.xhr = null

              // console.log(`Currently have ${component.state.data.length} elements`)

              if (component.stale) {
                component.setState(_.extend({}, component.state, {data: geoJson}))
                component.stale = false
              }else {
                Array.prototype.push.apply(component.state.data, geoJson)
                component.setState(_.extend({}, component.state))
              }
              /*
              if (component.refs.heatmap) {
                console.log(`Adding ${geoJson.length} elements`)
                var heatmap = component.refs.heatmap._heatmap
                for (var i = 0; i < geoJson.length; i++) {
                  // heatmap.add([geoJson[i].lat, geoJson[i].lon, geoJson[i].pop])
                  heatmap.add(geoJson[i])
                }
                heatmap.draw()
              }else {
                console.log(`Adding ${geoJson.length} elements`)
                component.setState(_.extend({}, component.state, {
                  data: geoJson
                }))
              }*/

            // geoJson.length > 0 && component.heatLayer.addArray(geoJson)
            }
          })
        }
      }
    })
    var map = this.context.map
    map._initPathRoot()
    this.polyLayer = new L.TileLayer.d3_topoJSON(`${BACKEND_URL}/${this.props.endpoint}`, {layerName: 'blocks'}).addTo(map)
  // this.heatLayer = new HeatMapOverlay({
  //   latField: 'lat',
  //   lngField: 'lon',
  //   valueField: 'pop'
  // })
  // map.addLayer(this.heatLayer)
  }

  componentWillUnmount (nextProps) {
    this.context.map.removeLayer(this.polyLayer)
  }

  render () {
    return (
    this.state.data ?
      <HeatmapLayer
        ref='heatmap'
        {...this.props}
        max={1.0}
        radius={1000}
        points={this.state.data}
        longitudeExtractor={p => p.lon}
        latitudeExtractor={p => p.lat}
        intensityExtractor={p => p.pop} /> : null
    )
  }
}
