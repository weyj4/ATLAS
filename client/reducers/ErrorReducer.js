/**
 * Store containing error messages
 * @flow
 */

import type {Action} from '../actions/Types'

export type State = {
  msg : ?string
};

const initialState = {
  msg : null
}

const reduce = (state : State = initialState, action : Action) : State => {
  if(action.error){
    return {msg : action.payload}
  }
  switch(action.type){
    case 'POST_RESPONSE_REJECTED':
      return {msg : action.payload}
    case 'FETCH_SURVEY_REJECTED':
      return {msg : action.payload}
    case 'FETCH_RESPONSES_REJECTED':
      return {msg : action.payload}
    case 'SET_ERROR':
      return {msg : action.msg}
    case 'CLEAR_ERROR':
      return {msg : null}
    default:
      return state
  }
}

export default reduce;