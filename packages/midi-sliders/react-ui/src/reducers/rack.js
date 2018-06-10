import createReducer from './createReducer'
import {ActionTypeRack} from '../actions/rack'

export const rackItemList = createReducer([], {
  [ActionTypeRack.ADD_RACK_ITEM] (state, action) {
    return [...state, action.payload]
  },
  [ActionTypeRack.MUTE_RACK_ITEM] (state, action) {
    // search after todo item with the given id and set completed to true
    return state.map(t => t.id === action.payload ? { ...t, muted: true } : t)
  },
  [ActionTypeRack.UNMUTE_RACK_ITEM] (state, action) {
    // search after todo item with the given id and set completed to false
    return state.map(t => t.id === action.payload ? { ...t, muted: false } : t)
  },
  [ActionTypeRack.DELETE_RACK_ITEM] (state, action) {
    // remove all todos with the given id
    return state.filter(t => t.id !== action.payload)
  }
})
