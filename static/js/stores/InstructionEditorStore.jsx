import {EventEmitter} from 'events';
import dispatcher from '../Dispatcher';


class InstructionEditorStore extends EventEmitter{
	constructor(){
		super();
		this.visibility = false;
		this.nextID = 1;
	}

	setVisibility = (visibility) => {
		this.visibility = visibility;
		this.emit('change-visibility');
	}

	getVisibility = () => {
		return this.visibility;
	}

	getMarkerIcon = () => {
		return this.marker.icon;
	}

	getMarkerLatLng = () => {
		return this.marker.coordinates;
	}

	getPolygon = () => {
		return this.marker.polygon;
	}

	getID = () => {
		return this.currentID;
	}

	getMarker = () => {
		return this.marker;
	}

	handleActions = (action) => {
		switch(action.type){
			case 'SHOW_EDITOR':
				this.marker = action.marker;
				if(action.marker.id === undefined){
					this.marker.id = this.nextID;
					this.nextID++;
				}
				this.setVisibility(true);
				break;
			case 'HIDE_EDITOR':
				this.setVisibility(false);
				break;
		}
	}
}

const instructionEditorStore = new InstructionEditorStore();

dispatcher.register(instructionEditorStore.handleActions)

export default instructionEditorStore