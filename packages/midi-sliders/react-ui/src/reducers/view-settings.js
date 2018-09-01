import createReducer from './createReducer'
import { ActionTypeViewSettings } from '../actions/view-settings'

export const viewSettings = createReducer({}, {
  [ActionTypeViewSettings.TOGGLE_LAYOUT_MODE] (state = {isLayoutMode: true}, action) {
    const castedVal = !!state.isLayoutMode
    return Object.assign({}, {
      isLayoutMode: !castedVal
    })
  },

  [ActionTypeViewSettings.TOGGLE_COMPACT_MODE] (state = {isLayoutMode: true}, action) {
    const castedVal = !!state.isCompactHorz
    return Object.assign({}, {
      isCompactHorz: !castedVal
    })
  }
})
