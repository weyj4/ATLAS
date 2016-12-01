import React from 'react'
import { BACKEND_URL } from 'atlas/Constants'
import * as turf from 'turf'
import * as _ from 'lodash'

export default class CHW extends React.Component {
  static contextTypes = {
    map: React.PropTypes.instanceOf(L.Map)
  }

  removeVists = () => {
    var map = this.context.map
    if (this.currentVisits && this.currentVisits.length > 0) {
      for (var i = 0; i < this.currentVisits.length; i++) {
        map.removeLayer(this.currentVisits[i])
      }
      this.currentCHW.addTo(map)
      this.currentCHW = null
      this.currentVisits = []
    }
  }

  showVisits = (chw, chws, chwMarker) => {
    var map = this.context.map
    this.removeVists()

    var yellowIcon = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
    this.currentVisits = []
    var visits = chws[chw]
    for (var i = 0; i < visits.length; i++) {
      var marker = L.marker({lat: visits[i].lat, lng: visits[i].lon}, {
        icon: yellowIcon
      })
      this.currentVisits.push(marker)
      marker.bindPopup([
        'Household ID: ' + visits[i].hh_id,
        'Cough Diagnosis: ' + visits[i].diag_cough,
        'Fever Diagnosis: ' + visits[i].diag_fever,
        'Date of Visit: ' + new Date(visits[i].reported).toLocaleDateString()
      ].join('<br/>'))
      marker.addTo(map)
    }
    this.currentCHW = chwMarker
    map.removeLayer(chwMarker)
  }

  addWorkers = (chws) => {
    this.markers = []
    this.polygons = []
    var map = this.context.map

    // map.on('click', this.removeVists)

    _.forEach(Object.keys(chws), chw => {
      var points = chws[chw].map(hh => turf.point([hh.lon, hh.lat]))
      var hull = turf.convex({type: 'FeatureCollection', features: points})

      var polygon = L.geoJson(hull, {
        style: function (feature) {return {
            color: 'white',
            fillColor: 'white',
            fillOpacity: 0.3
          }}
      })

      polygon.addTo(map)
      this.polygons.push(polygon)

      var center = turf.centroid(hull)
      var marker = L.marker({
        lat: center.geometry.coordinates[1],
        lng: center.geometry.coordinates[0]
      })
      marker.on('click', () => {
        this.showVisits(chw, chws, marker)
      })
      marker.bindPopup(`CHW ID: ${chws[chw][0].chw_id}`)
      marker.addTo(map)
      this.markers.push(marker)
    })
  }

  constructor () {
    super()
    $.get(`${BACKEND_URL}/CHW`).done(res => {
      console.log('adding workers')
      this.addWorkers(res)
    }).fail(err => {
      console.log(err)
    })
  }

  removeWorkers = () => {
  }

  componentWillUnmount () {
    this.removeWorkers()
  }

  render () {
    return null
  }
}
