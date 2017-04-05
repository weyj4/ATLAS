/**
 * Pages Store
 * @flow
 */

import React from 'react'
import type {Action} from '../actions/Types'
import type {Element} from 'react'
import Spinner from 'react-spinkit'

const loader = {
  popup : {
    component : <Spinner spinnerName='three-bounce' noFadeIn />,
    style : {},
    props : {}
  }
}

const initialState = {
  popup : null
}    
  
  
const reduce = (state : State = initialState, action : Action) : State => {
  switch(action.type){
    case 'SHOW_COMPONENT':
      return {
        popup : {
          component : action.component,
          style : action.style,
          props : action.props
        }
      }
    case 'HIDE_COMPONENT':
    case 'SET_ERROR':
      return {popup : null}
    default:
      return state
  }
}

export default reduce

export type State = {
  popup : ?{
    component : Element<*>,
    style : Object
  }
}