/**
 * Pages Actions.  These actions will inject
 * components into different pages.  The primary
 * use case is to overlay a component on top of 
 * the layout (Ex: a loading/progress bar)
 * @flow
 */
import type React from 'react'
import type {Action} from './Types'

/**
 * Show `component` on top of whatever is rendered in `Layout`
 * @param  {React.Component} component : The component to be rendered
 */
export function showComponent (component : React.Element<*>, style : Object, props : Object) : Action {
  return {
    type : 'SHOW_COMPONENT',
    component : component,
    style : style,
    props : props
  }
}

/**
 * Hide the currently displayed component (if any)
 */
export const hideCurrentComponent : Action = {
  type : 'HIDE_COMPONENT'
}