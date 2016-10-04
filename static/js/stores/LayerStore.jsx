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
                label : 'Dengue Risk Index',
                value : 'dengue',
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
                ],
                notes : [
                    'Level 1: A. Aegypti mosquito present, no care delivery, high population density',
                    'Level 2: A. Aegypti mosquito present, no care delivery, low population density',
                    'Level 3: A. Aegypti mosquito not present, no care delivery, high population density',
                ]
            }, 
            population : {
                value : 'population',
                label : 'Population Density',
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
                ],
                notes : []
            },
            mosquito : {
                value : 'mosquito',
                label : 'Mosquito Presence',
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
                ],
                notes : []
            },
            care_delivery : {
                value : 'care_delivery',
                label : 'Care Delivery',
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
                ],
                notes : []
            },
            custom : {
                value : 'custom',
                label : 'Build Custom Layer',
            }
        }
    }

    isEditable = (layerName) => {
        return this.layers[layerName].editable;
    }

    getLayerOptions = () => {
        var options = []
        for(var field in this.layers){
            if(field !== 'custom'){
                options.push({value : field, label : this.layers[field].label});
            }
        }
        //Make sure this one shows up last.
        options.push({value : 'custom', label : 'Build Custom Layer'});
        return options;
    }

    getLayer = () => {
        return this.layers[this.currentLayer];
    }

    toggleLayer = () => {
        this.layerStatus = !this.layerStatus;
        this.emit('change');
    }

    getLayerStatus = () => {
        return this.layerStatus;
    }

    changeLayer = (layer) => {
        this.currentLayer = layer;
        this.emit('change-layer')
    }

    addLayer = (layer) => {
        if(this.editLayer){
            //If we are editing a layer, clear the old one out
            delete this.layers[this.editLayer.value];
            this.editLayer = undefined;
        }
        this.layers[layer.value] = layer;
        this.currentLayer = layer.value;
        this.emit('change-layer');
    }

    setEditLayer = (layer) => {
        this.editLayer = this.layers[layer];
        this.emit('edit-layer');
    }

    getEditLayer = () => {
        return this.editLayer;
    }

    handleActions = (action) => {
        switch(action.type){
            case 'TOGGLE_LAYER':
                this.toggleLayer();
                break;
            case 'CHANGE_LAYER':
                this.changeLayer(action.layer);
                break;
            case 'ADD_LAYER':
                this.addLayer(action.layer);
                break;
            case 'EDIT_LAYER':
                this.setEditLayer(action.layer);
                break;
        }
    }
}

const layerStore = new LayerStore();

dispatcher.register(layerStore.handleActions)

export default layerStore
