import {EventEmitter} from 'events';
import dispatcher from '../Dispatcher';

// See `get_top_20.m` and `index.js` in `zika_risk_map/compute_density`
// for more details on how this constant was computed
const POP_CUTOFF=2.1647

class LayerStore extends EventEmitter{
    constructor(){
        super();
        this.layerStatus = true;
        this.currentLayer = 'dengue'
        this.layers = {
            dengue : {
                fill : function(d){
                    if(d.properties.zika_risk){
                        if(!d.properties.care_delivery){
                            if(d.properties.pop_per_sq_km >= POP_CUTOFF){
                                return 'red'; //level 1
                            }else{
                                return 'orange'; // level 2
                            }
                        }
                    }
                    if(!d.properties.care_delivery && !d.properties.zika_risk && d.properties.pop_per_sq_km >= POP_CUTOFF){
                        return 'yellow'; // level 3
                    }
                    return 'lightgray';
                },
                options : [
                    {label : 'Level 1 Cold Spot', color : 'red'}, 
                    {label  :'Level 2 Cold Spot', color : 'orange'},
                    {label : 'Level 3 Cold Spot', color : 'yellow'},
                    {label : 'Stable', color : 'lightgray'}
                ]
            }, 
            population : {
                fill : function(d){
                    if(d.properties.pop_per_sq_km >= POP_CUTOFF){
                        return 'red';
                    }else{
                        return 'lightgray';
                    }
                },
                options : [
                    {label : 'High Population Density', color : 'red'},
                    {label : 'Low Population Density', color : 'lightgray'}
                ]
            },
            mosquito : {
                fill : function(d){
                    if(d.properties.zika_risk){
                        return 'red';
                    }else{
                        return 'lightgray'
                    }
                },
                options : [
                    {label : 'A. Aegypti Mosquito Present', color : 'red'},
                    {label : 'A. Aegypti Mosquito Not Present', color : 'lightgray'}
                ]
            },
            care_delivery : {
                fill : function(d){
                    if(d.properties.care_delivery){
                        return 'lightgray';
                    }else{
                        return 'red'
                    }
                },
                options : [
                    {label : 'Minimal/No Care Delivery', color : 'red'},
                    {label : 'Care Delivery', color : 'lightgray'}
                ]
            }
        }
    }

    getLayer(){
        return this.layers[this.currentLayer];
    }

    toggleLayer = () => {
        this.layerStatus = !this.layerStatus;
        this.emit('change');
    }

    getLayerStatus = () => {
        return this.layerStatus;
    }

    changeLayer(layer){
        this.currentLayer = layer;
        this.emit('change-layer')
    }

    handleActions = (action) => {
        switch(action.type){
            case 'TOGGLE_LAYER':
                this.toggleLayer();
                break;
            case 'CHANGE_LAYER':
                this.changeLayer(action.layer);
                break;
        }
    }
}

const layerStore = new LayerStore();

dispatcher.register(layerStore.handleActions)

export default layerStore
