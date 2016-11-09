import React, { PropTypes } from 'react'
import geojsonvt from 'geojson-vt'
import { MapComponent } from 'react-leaflet'
import MapStore from 'atlas/stores/MapStore'
import * as d3 from 'd3'

require('atlas/L.CanvasTiles')

export default class GeoJSONVTLayer extends MapComponent {
  static contextTypes = {
    map: PropTypes.instanceOf(L.Map)
  }

  constructor (props) {
    super(props)
  }

  drawingOnCanvas = (canvasOverlay, params) => {
    var component = this
    var bounds = params.bounds
    params.tilePoint.z = params.zoom

    var ctx = params.canvas.getContext('2d')
    ctx.globalCompositeOperation = 'source-over'

    params.canvas.onmousemove = e => {
      var map = this.context.map
      var coords = map.mouseEventToLatLng(e)
      var result = MapStore.lookupRTree(coords)
      if (result) {
        this.tooltip.classed('hidden', false)
        this.tooltipPolygonInfo.html(this.props.tooltip(result))
      }else {
        this.tooltip.classed('hidden', true)
      }
    }

    var tile = this.tileIndex.getTile(params.tilePoint.z, params.tilePoint.x, params.tilePoint.y)
    if (!tile) {
      console.log('empty tile')
      return
    }

    ctx.clearRect(0, 0, params.canvas.width, params.canvas.height)

    var features = tile.features

    ctx.strokeStyle = 'black'
    ctx.lineWidth = 0.5; // Math.pow(params.tilePoint.z / 18, 5)

    for (var i = 0; i < features.length; i++) {
      var feature = features[i]
      var type = feature.type

      // Make this feature *seem* like GeoJSON feature by renaming tags to properties
      Object.defineProperty(feature, 'properties', Object.getOwnPropertyDescriptor(feature, 'tags'))

      ctx.fillStyle = this.props.layer.fill(feature)
      ctx.beginPath()

      for (var j = 0; j < feature.geometry.length; j++) {
        var geom = feature.geometry[j]

        for (var k = 0; k < geom.length; k++) {
          var p = geom[k]
          var extent = 4096
          var x = p[0] / extent * 256
          var y = p[1] / extent * 256
          if (k) ctx.lineTo(x , y)
          else ctx.moveTo(x , y)
        }
      }

      if (type === 3 || type === 1) ctx.fill('evenodd')
      ctx.stroke()
    }
  }

  addFeatures = () => {
    var tileOptions = {
      maxZoom: 18,
      tolerance: 1,
      buffer: 64,
      debug: 0
    }

    this.tileIndex = geojsonvt({type: 'FeatureCollection', features: this.props.features.features}, tileOptions)

    var map = this.context.map

    var tileLayer = L.canvasTiles()
      .params({ debug: false, padding: 5 })
      .drawing(this.drawingOnCanvas)

    tileLayer.addTo(map)
  }

  componentDidMount () {
    console.log('adding features')
    this.addFeatures()

    var map = this.context.map

    this.tooltip = d3.select(map._container).append('div')
      .attr('class', 'hidden tooltip')
      .attr('id', 'tooltip')

    this.tooltipPolygonInfo = this.tooltip.append('span')

    this.tooltipCoordinates = this.tooltip.append('span')

    map.on('mousemove', (d) => {
      this.tooltip.classed('hidden', false)
        .attr('style', `left: ${d.originalEvent.clientX}px; top: ${d.originalEvent.clientY}px`)
      this.tooltipCoordinates.html(`<br/>Coordinates: (${d.latlng.lat.toFixed(4)}, ${d.latlng.lng.toFixed(4)})`)
    })
    map.on('mouseout', (d) => this.tooltip.classed('hidden', true))
  }

  render () {
    console.log('rendering geojsonvt')
    return null
  }
}
