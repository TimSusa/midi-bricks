import maxBy from 'lodash/maxBy'
import localforage from 'localforage'
import { Actions as sliderListActions } from '../slider-list'
import { Actions as viewSettingsActions } from '../view-settings'
// import { Actions as pageActions } from '../pages'
import { getUniqueId } from '../../../utils/get-unique-id'

import { updateSliderListOfPage } from './update-slider-list-of-page'
//const { updateSliderListOfPage } = pageActions
const { setMidiPage } = sliderListActions

const {
  setLastFocusedPage,
  setLastFocusedIndex,
  toggleSettingsMode
} = viewSettingsActions

export function thunkCopyToNextPage() {
  return async function (dispatch, getState) {
    const {
      viewSettings: { lastFocusedIdxs, lastFocusedPage }
      //pages
    } = getState()
    const pages = await localforage.getItem('pages')
    // TODO: Put a modal here to ask the user where to copy that stuff
    const nextPageIdx = Object.keys(pages).reduce((acc, cur) => {
      return pages[cur].id
    }, '')
    const maxX = maxBy(pages[nextPageIdx].sliderList, 'x').x + 1
    const maxY = maxBy(pages[nextPageIdx].sliderList, 'y').y + 1
    const sliderList = lastFocusedIdxs.reduce(
      (acc, id) => {
        const entry = pages[lastFocusedPage].sliderList.find(
          (er) => er.i === id
        )
        if (entry) {
          acc.push({ ...entry, i: getUniqueId(), x: maxX, y: maxY })
        }
        return acc
      },
      [...pages[nextPageIdx].sliderList]
    )
    dispatch(setLastFocusedIndex({ i: 'none' }))
    dispatch(setLastFocusedPage({ lastFocusedPage: nextPageIdx }))

    await updateSliderListOfPage({ lastFocusedPage: nextPageIdx, sliderList })

    dispatch(setMidiPage({ sliderList }))
    dispatch(toggleSettingsMode(false))
    return Promise.resolve()
  }
}
