import localforage from 'localforage'
import { initApp } from '../init'
import { Actions as sliderActions } from '../slider-list'
import { Actions as viewActions } from '../view-settings'
import { Actions as pageActions } from '../pages'
import { Actions as undoRedoActions } from '../undo-redo'
const { updateSliderListOfPage } = pageActions
const { setMidiPage } = sliderActions
const { setLastFocusedIndex, setLastFocusedPage } = viewActions
const { undoRedoUpdate } = undoRedoActions

export function thunkChangePage(lastFocusedPage, focusedPage) {
  return async function(dispatch, getState) {
    const {
      viewSettings: { lastFocusedPage, isLiveMode },
      sliders: { sliderList = [] },
      pages: storedPages
    } = getState()

    if (isLiveMode) {
      // console.log('isLiveMode')
      const pages = await localforage.getItem('pages')
      const updatedPages = {
        ...pages,
        [lastFocusedPage]: {
          ...pages[lastFocusedPage],
          sliderList
        }
      }
      await localforage.setItem('pages', updatedPages)
      //dispatch(updateSliderListOfPage({ lastFocusedPage, sliderList }))
      dispatch(setLastFocusedIndex({ i: 'none' }))
      dispatch(setMidiPage({ sliderList: pages[focusedPage].sliderList }))
      dispatch(setLastFocusedPage({ lastFocusedPage: focusedPage }))
    } else {
      dispatch(undoRedoUpdate({ state: getState() }))

      // console.log('is no LiveMode')
      //batch(() => {
      if (storedPages[focusedPage]) {
        dispatch(updateSliderListOfPage({ lastFocusedPage, sliderList }))
        dispatch(setLastFocusedIndex({ i: 'none' }))
        dispatch(
          setMidiPage({ sliderList: storedPages[focusedPage].sliderList })
        )
        dispatch(setLastFocusedPage({ lastFocusedPage: focusedPage }))
      } else {
        dispatch(updateSliderListOfPage({ lastFocusedPage, sliderList }))
        dispatch(setLastFocusedIndex({ i: 'none' }))
        dispatch(setMidiPage({ sliderList: [] }))
        dispatch(setLastFocusedPage({ lastFocusedPage: focusedPage }))
      }
      //})
    }
    dispatch(initApp())

    return Promise.resolve()
  }
}
