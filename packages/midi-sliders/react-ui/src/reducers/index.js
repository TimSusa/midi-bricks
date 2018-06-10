
import { combineReducers } from 'redux'

import * as midiSliderReducer from './midi-sliders'
import * as midiAccessReducer from './midi-access'

export default combineReducers({
  ...midiAccessReducer,
  ...midiSliderReducer
})
