import dispatcher from '../Dispatcher';

// This is used when the user enters a location
// in the side menu and the map needs to update
// the location
export function updateLocation(loc){
    dispatcher.dispatch({
        type: 'CHANGE_LOCATION',
        location : loc
    })
}

// This is used when the user pans on the map
// and the menu needs the updated location
export function pannedTo(loc){
	dispatcher.dispatch({
		type: "PANNED_TO",
		location : loc
	})
}