/**
 * @flow
 */

import type {Action} from './Types'

export function setError (err : string) : Action {
  return {
    type: 'SET_ERROR',
    msg: err
  }
}

export const clearError : Action = {
  type: 'CLEAR_ERROR'
}