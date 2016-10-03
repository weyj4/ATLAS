import dispatcher from '../Dispatcher';

export function toggleLayer(term){
    dispatcher.dispatch({
        type: 'TOGGLE_LAYER'
    })
}

export function changeLayer(layer){
	dispatcher.dispatch({
		type : 'CHANGE_LAYER',
		layer : layer
	})
}

export function addLayer(layer){
	dispatcher.dispatch({
		type : 'ADD_LAYER',
		layer : layer
	})
}