import React, { PropTypes } from 'react'
import { MapComponent } from 'react-leaflet'
var L = require('leaflet')
import MapStore from 'atlas/stores/MapStore'
import HeatmapLayer from 'react-leaflet-heatmap-layer'
import { BACKEND_URL } from 'atlas/Constants'

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

    component.refs.heatmap._heatmap.max(90)

    this.polygons = {}
    MapStore.clearRTree()
    L.TileLayer.HeatmapTileLayer = L.TileLayer.extend({
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

              console.log(`Currently have ${component.state.data.length} elements`)

              if (component.stale) {
                component.setState(_.extend({}, component.state, {data: geoJson}))
                component.stale = false
              }else {
                Array.prototype.push.apply(component.state.data, geoJson)
                component.setState(_.extend({}, component.state))
              }
            }
          })
        }
      }
    })
    var map = this.context.map
    map._initPathRoot()
    this.heatmapLayer = new L.TileLayer.HeatmapTileLayer(`${BACKEND_URL}/${this.props.endpoint}`, {layerName: 'blocks'}).addTo(map)
  }

  componentWillUnmount (nextProps) {
    this.context.map.removeLayer(this.heatmapLayer)
  }

  render () {
    return (
    this.state.data ?
      <HeatmapLayer
        ref='heatmap'
        {...this.props}
        max={1000}
        blur={1}
        radius={0.1}
        points={this.state.data}
        longitudeExtractor={p => p.lon}
        latitudeExtractor={p => p.lat}
        intensityExtractor={p => p.pop} /> : null
    )
  }
}
