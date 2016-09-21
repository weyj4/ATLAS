import {EventEmitter} from 'events';
import dispatcher from '../Dispatcher';

class LocationStore extends EventEmitter{
    constructor(){
        super();
        // Default location.  Some place in Florida...
        this.location = {lat : 29.367493, lng : -82.003767}
        this.bounds = undefined;
    }

    getLocation(){
        return this.location;
    }

    updateLocation(loc){
        this.location = loc;
        this.emit('change-location');
    }

    handleActions = (action) => {
        switch(action.type){
            case 'CHANGE_LOCATION':
                this.updateLocation(action.location);
                break;
        }
    }
}

const locationStore = new LocationStore();

dispatcher.register(locationStore.handleActions)

export default locationStore
