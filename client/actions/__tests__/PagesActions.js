import React from 'react'
import PagesReducer from '../../reducers/PagesReducer'
import * as PagesActions from '../PagesActions'

describe('PagesActions', () => {
  it('Shows and hides components', () => {
    const state1 = PagesReducer(undefined, {type : '_'})
    expect(state1.popup).toBeNull()

    // Display a popup
    const state2 = PagesReducer(state1, PagesActions.showComponent(<div></div>, {position : 'absolute'}, {dummy : 1}))
    expect(state2.popup.component).not.toBeNull()
    expect(state2.popup.style.position).toBe('absolute')
    expect(state2.popup.props.dummy).toBe(1)

    // Clear the popup
    const state3 = PagesReducer(state2, PagesActions.hideCurrentComponent)
    expect(state3.popup).toBeNull()
  })
})