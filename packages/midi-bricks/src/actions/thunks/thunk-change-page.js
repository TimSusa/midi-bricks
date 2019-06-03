import { batch } from 'react-redux'
import { Actions as sliderActions } from '../slider-list'
import { Actions as viewActions } from '../view-settings'
import { Actions as pageActions } from '../pagesx'

const { updateSliderListOfPage } = pageActions
const { setMidiPage } = sliderActions
const { setLastFocusedIndex, setLastFocusedPage } = viewActions

export function thunkChangePage(lastFocusedPage, focusedPage) {
  return function(dispatch, getState) {
    const {
      viewSettings: { lastFocusedPage },
      sliders: { sliderList = [] },
      pagesx
    } = getState()

    //batch(() => {
      dispatch(updateSliderListOfPage({ lastFocusedPage, sliderList }))
      dispatch(setLastFocusedIndex({ i: 'none' }))
      dispatch(setMidiPage({ sliderList: pagesx[focusedPage].sliderList }))
      dispatch(setLastFocusedPage({ lastFocusedPage: focusedPage }))
    //})

    return Promise.resolve()
  }
}
