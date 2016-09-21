import dispatcher from '../Dispatcher';

export function updateLocation(loc){
    dispatcher.dispatch({
        type: 'CHANGE_LOCATION',
        location : loc
    })
}
