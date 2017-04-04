/**
 * Reducer for keeping track of map state
 */

const initialState = {
	pos : [15.468487, -90.381398], //Coban
	zoom : 10
}

const reducer = (state = initialState, action) => {
	switch(action.type){
		case 'CHANGE_LOC':
			return {...state, pos : action.payload}
		case 'CHANGE_ZOOM':
			return {...state, zoom : action.payload}
		default:
			return state;
	}
}

export default reducer