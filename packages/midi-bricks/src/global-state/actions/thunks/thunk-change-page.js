import localforage from 'localforage'
import { initApp } from '../init'
import { Actions as sliderActions } from '../slider-list'
import { Actions as viewActions } from '../view-settings'
//import { Actions as pageActions } from '../pages'
import { updateSliderListOfPage } from './update-slider-list-of-page'
//const { updateSliderListOfPage } = pageActions
const { setMidiPage } = sliderActions
const { setLastFocusedIndex, setLastFocusedPage } = viewActions

export function thunkChangePage(lastFocusedPage, focusedPage) {
  return async function (dispatch, getState) {
    const {
      viewSettings: { lastFocusedPage, isLiveMode, isLayoutMode },
      sliders: { sliderList = [] }
      //  pages: storedPages
    } = getState()
    let tmpSliderList = []
    let storedPages = await localforage.getItem('pages')
    if (!isLayoutMode) {
      tmpSliderList = sliderList.map((item) => {
        return {
          ...item,
          isDraggable: false,
          isResizable: false,
          static: true
        }
      })
    } else {
      tmpSliderList = sliderList.map((item) => {
        return {
          ...item,
          isDraggable: true,
          isResizable: true,
          static: false
        }
      })
    }

    if (isLiveMode) {
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
      //dispatch(undoRedoUpdate({ state: getState() }))
      window.sessionStorage.setItem('state', JSON.stringify(getState()))

      if (storedPages[focusedPage]) {
        await updateSliderListOfPage({
          lastFocusedPage,
          sliderList: tmpSliderList
        })

        dispatch(setLastFocusedIndex({ i: 'none' }))
        const tmpStoredList = storedPages[focusedPage].sliderList.map(
          (item) => {
            return {
              ...item,
              isDraggable: isLayoutMode,
              isResizable: isLayoutMode,
              static: !isLayoutMode
            }
          }
        )

        dispatch(setMidiPage({ sliderList: tmpStoredList }))
        dispatch(setLastFocusedPage({ lastFocusedPage: focusedPage }))
      } else {
        await updateSliderListOfPage({
          lastFocusedPage,
          sliderList: tmpSliderList
        })
        dispatch(setLastFocusedIndex({ i: 'none' }))
        dispatch(setMidiPage({ sliderList: [] }))
        dispatch(setLastFocusedPage({ lastFocusedPage: focusedPage }))
      }
    }
    //dispatch(toggleLayoutMode({ isLayoutMode: false }))
    dispatch(initApp())

    return Promise.resolve()
  }
}
