/**
 * Reducer for keeping track of map state
 */

import update from 'immutability-helper';

const initialState = {
	pos : [15.468487, -90.381398], //Coban
	zoom : 10,
	markers : [],
	activeMarkers : {}
}

const reducer = (state = initialState, action) => {
	switch(action.type){
		case 'CHANGE_LOC':
			return {...state, pos : action.payload}
		case 'CHANGE_ZOOM':
			return {...state, zoom : action.payload}
		case 'FETCH_MARKERS_FULFILLED':
			return {...state, markers : action.payload.data}
		case 'ACTIVATE_MARKER':
			if(state.activeMarkers[action.payload.id]){
				state = update(state, {
					activeMarkers : {
						[action.payload.id] : {
							$set : null
						}
					}
				})
				delete state.activeMarkers[action.payload.id]
				return state
			}else{
				return update(state, {
					activeMarkers : {
						[action.payload.id] : {
							$set : action.payload
						}
					}
				})
			}
		default:
			return state;
	}
}

export default reducer