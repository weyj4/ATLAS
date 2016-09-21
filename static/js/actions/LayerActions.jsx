import dispatcher from '../Dispatcher';

export function toggleLayer(term){
    dispatcher.dispatch({
        type: 'TOGGLE_LAYER'
    })
}