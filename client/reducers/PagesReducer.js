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
    case 'SAVE_SURVEY_FULFILLED':
    case 'LOGIN_FULFILLED':
    case 'LOGOUT_FULFILLED':
    case 'POST_RESPONSE_FULFILLED':
    case 'FETCH_RESPONSES_FULFILLED':
    case 'CREATE_SURVEY_FULFILLED':
    case 'FETCH_SURVEY_FULFILLED':
    case 'UPDATE_PASSWORD_FULFILLED':
      return {popup : null}
    case 'LOGIN_PENDING':
    case 'SAVE_SURVEY_PENDING':
    case 'POST_RESPONSE_PENDING':
    case 'LOGOUT_PENDING':
    case 'FETCH_RESPONSES_PENDING':
    case 'CREATE_SURVEY_PENDING':
    case 'FETCH_SURVEY_PENDING':
    case 'UPDATE_PASSWORD_PENDING':
      return loader
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