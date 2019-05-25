import { combineReducers } from 'redux'
import { generateReducers } from 'redux-generate'
import { sliders}  from './slider-list'
import {initState, viewSettings}  from './view-settings'

export default combineReducers({
  sliders: generateReducers({sliderList: [], pages: {'firstPageId': {
    sliderList: [],
    id: 'firstPageId',
    label: 'Page'
  }}}, sliders), 
  viewSettings: generateReducers(initState, viewSettings)
})
