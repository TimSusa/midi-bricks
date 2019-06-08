import { batch } from 'react-redux'
import { Actions as sliderActions } from '../slider-list'
import { Actions as viewActions } from '../view-settings'
import { Actions as pageActions } from '../pages'
import localforage from 'localforage'
const { deletePages, updatePages } = pageActions
const { setMidiPage } = sliderActions
const { setLastFocusedIndex, toggleLiveMode } = viewActions

export function thunkLiveModeToggle(lastFocusedPage, focusedPage) {
  return async function(dispatch, getState) {
    const {
      viewSettings: { lastFocusedPage, isLiveMode },
      sliders: { sliderList = [] },
      pages
    } = getState()
    console.log('thunkLiveModeToggle')

    if (!isLiveMode) {
      console.log('Live mode started, persist pages...', pages)
      await save('pages', pages)
      dispatch(deletePages())
    } else {
      const pages = await localforage.getItem('pages')
      console.log('load pages', pages)
      dispatch(updatePages({pages}))
    }
    //batch(() => {
    dispatch(toggleLiveMode())
    // dispatch(updateSliderListOfPage({ lastFocusedPage, sliderList }))
    // dispatch(setLastFocusedIndex({ i: 'none' }))
    // dispatch(setMidiPage({ sliderList: pages[focusedPage].sliderList }))
    // dispatch(setLastFocusedPage({ lastFocusedPage: focusedPage }))
    //})

    return Promise.resolve()
  }
}

async function save (key, value) {
  await localforage.setItem(key, value)
}

