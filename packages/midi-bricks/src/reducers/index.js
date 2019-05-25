import { combineReducers } from 'redux'
import { generateReducers } from 'redux-generate'
import { sliders } from './slider-list'
import { initState, viewSettings } from './view-settings'
import { getUniqueId } from '../utils/get-unique-id'

const id = `page-${getUniqueId()}`

const pages = {
  [id]: {
    sliderList: [],
    id,
    label: 'Page 1'
  }
}

const slidersInitState = {
  pages, 
  sliderList: []
}

const viewSettingsInitState = {
  ...initState,
  lastFocusedPage: id,
  pageTargets: [{
    colors: {
      color: '#123456',
      colorFont: '#dddddd'
    },
    id: id,
    label: pages[id].label
  }]
}

export default combineReducers({
  sliders: generateReducers(slidersInitState, sliders),
  viewSettings: generateReducers(viewSettingsInitState, viewSettings)
})
