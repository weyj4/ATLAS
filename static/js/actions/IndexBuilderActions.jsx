import dispatcher from '../Dispatcher';

export function showBuilder(){
	dispatcher.dispatch({
		type : 'SHOW_BUILDER'
	});
}

export function hideBuilder(){
	dispatcher.dispatch({
		type : 'HIDE_BUILDER'
	});
}