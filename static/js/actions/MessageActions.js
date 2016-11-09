import dispatcher from '../Dispatcher'

/*
 * This module contains actions pertaining
 * to messages throughout the system, such
 * as messages to be displayed be loading
 * components or error/warning message components
 */

export function setLoadingMsg (msg) {
  dispatcher.dispatch({
    type: 'SET_LOADING_MSG',
    msg: msg
  })
}

export function clearLoadingMsg (msg) {
  dispatcher.dispatch({
    type: 'SET_LOADING_MSG',
    msg: undefined
  })
}
