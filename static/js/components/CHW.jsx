import React from 'react'
import { BACKEND_URL } from 'atlas/Constants'
import * as turf from 'turf'
import * as _ from 'lodash'
import L from 'leaflet'
import * as d3 from 'd3'

export default class CHW extends React.Component {
  static contextTypes = {
    map: React.PropTypes.instanceOf(L.Map)
  }

  addWorkers = (workers) => {
    var bounds = L.latLngBounds([])

    workers = workers.map(worker => {
      bounds.extend({lat : worker.lat, lng : worker.lon})
      return {
        type : 'Feature',
        properties : {
          title : worker.label1,
          description : worker.label2
        },
        geometry : {
          type : 'Point',
          coordinates : [worker.lon, worker.lat]
        },
        LatLng : new L.LatLng(worker.lat, worker.lon)
      }
    })

    var map = this.context.map

    var x = L;
    this.workerLayer = L.geoJSON(workers, {
      pointToLayer : function(feature, latlng){
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: 'yellow',
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        })
      },
      onEachFeature : function(obj, layer){
        layer.bindPopup(`
          Title: ${obj.properties.title}<br/>
          Description: ${obj.properties.description}
        `)
      }
    })
    this.workerLayer.addTo(this.context.map)
    this.context.map.fitBounds(bounds)
  }

  constructor () {
    super()
    $.get(`${BACKEND_URL}/CHW`).done(res => {
      this.addWorkers(res)
    }).fail(err => {
      console.log(err)
    })
  }

  removeWorkers = () => {
    this.context.map.removeLayer(this.workerLayer)
  }

  componentWillUnmount () {
    this.removeWorkers()
  }

  render () {
    return null
  }
}
