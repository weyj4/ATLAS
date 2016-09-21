import {EventEmitter} from 'events';
import dispatcher from '../Dispatcher';

class LayerStore extends EventEmitter{
    constructor(){
        super();
        this.layerStatus = true;
    }

    toggleLayer = () => {
        this.layerStatus = !this.layerStatus;
        this.emit('change');
    }

    getLayerStatus = () => {
        return this.layerStatus;
    }

    handleActions = (action) => {
        switch(action.type){
            case 'TOGGLE_LAYER':
                this.toggleLayer();
                break;
        }
    }
}

const layerStore = new LayerStore();

dispatcher.register(layerStore.handleActions)

export default layerStore
