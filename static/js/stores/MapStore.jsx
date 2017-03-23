import { EventEmitter } from 'events'
import dispatcher from '../Dispatcher'
import * as _ from 'lodash'

class MapStore extends EventEmitter {
  constructor () {
    super()
    this.markers = []
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
