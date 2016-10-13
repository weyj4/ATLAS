import {EventEmitter} from 'events';
import dispatcher from '../Dispatcher';
import L from 'leaflet';

class LocationStore extends EventEmitter{
    constructor(){
        super();
        // Default location.  Some place in Florida...
        //this.location = {lat : 29.367493, lng : -82.003767}
        // Default location.  Some place in Columbia...
        this.location = {lat : 6.2716, lng : -75.6573};
        this.bounds = undefined;
        this.locations = [];
        this.locationsBB = undefined;
    }

    getLocation(){
        return this.location;
    }

    updateLocation(loc){
        this.locations = [];
        this.location = loc;
        this.emit('change-location');
    }

    pannedTo(loc){
        this.location = loc;
        this.emit('pan-change');
    }

    addLOI(locations){
        console.log('Adding locations of interest')
        this.locations = locations;

        // Get the bounding box of all locations of interest
        var coords = locations.map((l) => {
            return {
                lat : l.geometry.location.lat(),
                lng : l.geometry.location.lng()
            }
        })
        var polygon = new L.Polygon(coords);
        this.locationsBB = polygon.getBounds();

        this.emit('new-loi');
    }

    getLOI(){
        return {locations : this.locations, bounds : this.locationsBB};
    }

    handleActions = (action) => {
        switch(action.type){
            case 'CHANGE_LOCATION':
                this.updateLocation(action.location);
                break;
            case 'PANNED_TO':
                this.pannedTo(action.location);
                break;
            case 'ADD_LOI':
                this.addLOI(action.locations);
                break;
        }
    }
}

const locationStore = new LocationStore();

dispatcher.register(locationStore.handleActions)

export default locationStore
