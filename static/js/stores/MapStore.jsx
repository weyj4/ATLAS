import { EventEmitter } from 'events'
import dispatcher from '../Dispatcher'
import rtree from 'rtree'
import turf from 'turf'
import * as _ from 'lodash'

class MapStore extends EventEmitter {
  constructor () {
    super()
    this.markers = []
    this.rtree = rtree()
  }

  getFeatures = () => {
    return this.features
  }

  setMap (map) {
    this.map = map
  }

  addMarker = (marker) => {
    this.markers.push(marker)
    this.emit('new-marker')
  }

  getMarkers = () => {
    return this.markers
  }

  addFeaturesToRTree = (features) => {
    this.rtree.geoJSON(features)
  }

  lookupRTree = (point) => {
    var candidates = this.rtree.search({x: point.lng, y: point.lat, w: 0, h: 0})
    var point = turf.point([point.lng, point.lat])
    candidates = _.filter(candidates, p => turf.inside(point, p))

    if (candidates.length != 1) {
      return undefined
    }else {
      return candidates[0]
    }
  }

  clearRTree = () => {
    this.rtree = rtree()
  }

  containerPointToLatLng = (point) => {
    return this.map.containerPointToLatLng(point)
  }

  handleActions = (event) => {
    switch (event.type) {
      case 'NEW_MARKER':
        this.addMarker(event)
        break
    }
  }
}

const mapStore = new MapStore()
dispatcher.register(mapStore.handleActions)
export default mapStore
