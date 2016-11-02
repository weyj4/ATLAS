import {EventEmitter} from 'events';
import dispatcher from '../Dispatcher';
import rtree from 'rtree';

class MapStore extends EventEmitter{
	constructor(){
		super();
		this.markers = [];
		this.rtree = rtree();
	}

	setMap(map){
		this.map = map;
	}

	addMarker = (marker) => {
		this.markers.push(marker);
		this.emit('new-marker');
	}

	getMarkers = () => {
		return this.markers;
	}

	addFeaturesToRTree = (features) => {
		this.rtree.geoJSON(features);
	}

	lookupRTree = (point) => {
		return this.rtree.search({x : point.lng, y : point.lat, w : 0, h : 0});
	}

	clearRTree = () => {
		this.rtree = rtree();
	}

	containerPointToLatLng = (point) => {
		return this.map.containerPointToLatLng(point);
	}

	handleActions = (event) => {
		switch(event.type){
			case 'NEW_MARKER':
				this.addMarker(event);
				break;
		}
	}
}


const mapStore = new MapStore();
dispatcher.register(mapStore.handleActions);
export default mapStore;