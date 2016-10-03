import {EventEmitter} from 'events';
import dispatcher from '../Dispatcher';


class IndexBuilderStore extends EventEmitter{
    constructor(){
        super();
    	this.visible = false;
    }

    getBuilderVisibility(){
    	return this.visible;
    }

    showBuilder(){
    	this.visible = true;
    	this.emit('change-visibility');
    }

    hideBuilder(){
    	this.visible = false;
    	this.emit('change-visibility');
    }

    handleActions = (action) => {
    	switch(action.type){
    		case 'SHOW_BUILDER':
    			this.showBuilder();
    			break;
    		case 'HIDE_BUILDER':
    			this.hideBuilder();
    			break;
    	}
    }

}

const indexBuilderStore = new IndexBuilderStore();

dispatcher.register(indexBuilderStore.handleActions)

export default indexBuilderStore
