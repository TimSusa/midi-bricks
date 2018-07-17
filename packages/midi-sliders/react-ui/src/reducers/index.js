
import { combineReducers } from 'redux'

import * as midiSliderReducer from './midi-sliders'

export default combineReducers({
  ...midiSliderReducer
})
