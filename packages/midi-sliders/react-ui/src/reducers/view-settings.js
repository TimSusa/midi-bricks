import createReducer from './createReducer'
import { ActionTypeViewSettings } from '../actions/view-settings'

export const viewSettings = createReducer({}, {
  [ActionTypeViewSettings.TOGGLE_LAYOUT_MODE] (state = {isLayoutMode: true}, action) {
    const castedVal = !!state.isLayoutMode
    return Object.assign({}, {
      isLayoutMode: !castedVal
    })
  },

  [ActionTypeViewSettings.INTEND_UPDATE_LIST_ORDER] (state, action) {
    const newState = Object.assign({}, state, {listOrder: action.payload})
    return newState
  }

})

//
