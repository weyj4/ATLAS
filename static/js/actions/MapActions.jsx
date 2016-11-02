import dispatcher from '../Dispatcher';
import * as _ from 'lodash';

export function addMarker(arg){
	dispatcher.dispatch(_.extend({type : 'NEW_MARKER'}, arg))
}