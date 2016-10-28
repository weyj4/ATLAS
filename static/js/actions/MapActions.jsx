import dispatcher from '../Dispatcher';

export function addMarker(location, img){
	dispatcher.dispatch({
		type : 'NEW_MARKER',
		img : img,
		location : location, 
	})
}