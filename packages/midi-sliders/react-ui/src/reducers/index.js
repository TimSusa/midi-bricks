
import { combineReducers } from 'redux'
import * as todoReducder from './todo'
import * as rackReducer from './rack'
import * as midiSliderReducer from './midi-sliders'
import * as midiAccessReducer from './midi-access'

export default combineReducers({
  ...todoReducder,
  ...rackReducer,
  ...midiAccessReducer,
  ...midiSliderReducer
})
