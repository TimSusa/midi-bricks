import { combineReducers } from 'redux'

import * as sliderListReducer from './slider-list'
import * as viewSettingsReducer from './view-settings'

export default combineReducers({
  ...sliderListReducer,
  ...viewSettingsReducer,
})
