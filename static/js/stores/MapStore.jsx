import {EventEmitter} from 'events';
import dispatcher from '../Dispatcher';

class MapStore extends EventEmitter{
	constructor(){
		super();
		this.markers = [];
	}

	setMap(map){
		this.map = map;
	}

	addMarker = (img, location) => {
		this.markers.push({
			img : img, 
			location : location
		})
		this.emit('new-marker');
	}

	getMarkers = () => {
		return this.markers;
	}

	containerPointToLatLng = (point) => {
		return this.map.containerPointToLatLng(point);
	}

	handleActions = (event) => {
		switch(event.type){
			case 'NEW_MARKER':
				this.addMarker(event.img, event.location);
				break;
		}
	}
}


const mapStore = new MapStore();
dispatcher.register(mapStore.handleActions);
export default mapStore;