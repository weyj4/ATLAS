import axios from 'axios'

export const changeZoom = (zoom) => ({
	type : 'CHANGE_ZOOM',
	payload : zoom
})

export const changePos = (pos) => ({
	type : 'CHANGE_POS',
	payload : pos
})

export const fetchMarkers = () => ({
  type : 'FETCH_MARKERS',
  payload : axios.get('/Markers')
})

export const activateMarker = marker => ({
  type : 'ACTIVATE_MARKER',
  payload : marker
})