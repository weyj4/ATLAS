import Dispatcher from 'atlas/Dispatcher';

export function hideEditor(){
	Dispatcher.dispatch({
		type : 'HIDE_EDITOR',
	})
}

export function showEditor(marker){
	Dispatcher.dispatch({
		type : 'SHOW_EDITOR',
		marker : marker
	})
}