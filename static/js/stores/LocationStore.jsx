import { EventEmitter } from 'events'
import dispatcher from '../Dispatcher'
import L from 'leaflet'

class LocationStore extends EventEmitter {
  constructor () {
    super()
    // this.location = {lat: 14.844444, lng: -91.501389}
    // this.location = {lat: 14.533574, lng: -90.592490}
    // this.location = {lat: 17.229645, lng: -90.806238}
    this.location = {lat: 14.84363107866439, lng: -91.52491092681885}
    this.bounds = undefined
    this.locations = []
    this.locationsBB = undefined
  }

  getLocation () {
    return this.location
  }

  updateLocation (loc) {
    this.locations = []
    this.location = loc
    this.emit('change-location')
  }

  pannedTo (loc) {
    this.location = loc
    this.emit('pan-change')
  }

  addLOI (locations) {
    console.log('Adding locations of interest')
    this.locations = locations

    // Get the bounding box of all locations of interest
    var coords = locations.map((l) => {
      return {
        lat: l.geometry.location.lat(),
        lng: l.geometry.location.lng()
      }
    })
    var polygon = new L.Polygon(coords)
    this.locationsBB = polygon.getBounds()

    this.emit('new-loi')
  }

  getLOI () {
    return {locations: this.locations, bounds: this.locationsBB}
  }

  handleActions = (action) => {
    switch (action.type) {
      case 'CHANGE_LOCATION':
        this.updateLocation(action.location)
        break
      case 'PANNED_TO':
        this.pannedTo(action.location)
        break
      case 'ADD_LOI':
        this.addLOI(action.locations)
        break
    }
  }
}

const locationStore = new LocationStore()

dispatcher.register(locationStore.handleActions)

export default locationStore
