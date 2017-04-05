import axios from 'axios'
import sinon from 'sinon'

import MapReducer from '../../reducers/MapReducer'
import * as MapActions from '../MapActions'

describe('Map Actions', () => {

  var store;

  beforeEach(() => {
    jest.resetModules()
    store = require('../../store').store
  })

  it('Changes Zoom Level', () => {
    var initalZoom = store.getState().map.zoom;

    store.dispatch(MapActions.changeZoom(initalZoom+1))
    expect(store.getState().map.zoom).toBe(initalZoom+1)
  })

  it('Changes Positions', () => {
    store.dispatch(MapActions.changePos([0,0]))

    expect(store.getState().map.pos[0]).toBe(0)
    expect(store.getState().map.pos[1]).toBe(0)
  })

  it('Fetches Markers', done => {
    var stub = sinon.stub(axios, 'get').callsFake(function(route){
      expect(route).toBe('/Markers')
      return Promise.resolve({data : ['fake marker']})
    })

    var spy = sinon.spy(store, 'dispatch')

    store.dispatch(MapActions.fetchMarkers())
      .then(() => {
        expect(spy.getCall(0).args[0].type).toBe('FETCH_MARKERS')
        expect(store.getState().map.markers.length).toBe(1)
        expect(store.getState().map.markers[0]).toBe('fake marker')
        spy.restore()
        stub.restore()
        done()
      })
  })

  it('Activates Markers', () => {
    store.dispatch(MapActions.activateMarker({id : 1, data : 'fake_data'}))
    expect(store.getState().map.activeMarkers[1].data).toBe('fake_data')
  })

  it('It deactivates Markers', () => {
    store.dispatch(MapActions.activateMarker({id : 1, data : 'fake_data'}))
    expect(store.getState().map.activeMarkers[1].data).toBe('fake_data')
    store.dispatch(MapActions.activateMarker({id : 1, data : 'fake_data'}))
    expect(store.getState().map.activeMarkers[1]).toBe(undefined)
  })
})