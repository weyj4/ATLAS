import dispatcher from '../Dispatcher';

export function changeDateIndex(index){
	dispatcher.dispatch({
		type : 'CHANGE_DATE_INDEX',
		index : index
	})
}