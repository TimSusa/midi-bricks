// import { batch } from 'react-redux'
import { Actions as sliderListActions } from '../slider-list'
import { Actions as viewSettingsActions } from '../view-settings'
import { Actions as pageActions } from '../pagesx'
import { getUniqueId } from '../../utils/get-unique-id'

const { updateSliderListOfPage } = pageActions
const { setMidiPage } = sliderListActions

const {
  setLastFocusedPage,
  setLastFocusedIndex,
  toggleSettingsMode
} = viewSettingsActions

export function thunkCopyToNextPage() {
  return async function(dispatch, getState) {
    const {
      viewSettings: { lastFocusedIdxs, lastFocusedPage },
      pagesx
    } = getState()

    // TODO: Put a modal here to ask the user where to copy that shit
    const nextPageIdx = Object.keys(pagesx).reduce((acc, cur) => {
      return pagesx[cur].id
    }, '')
    const sliderList = lastFocusedIdxs.reduce((acc, id) => {
      const entry = pagesx[lastFocusedPage].sliderList.find(er => er.i === id)
      if (entry){
        acc.push({...entry, i: getUniqueId()})
      }
      return acc
    }, [...pagesx[nextPageIdx].sliderList])
    //batch(() => {
    dispatch(setLastFocusedIndex({ i: 'none' }))
    dispatch(setLastFocusedPage({ lastFocusedPage: nextPageIdx }))
    dispatch(updateSliderListOfPage({lastFocusedPage: nextPageIdx, sliderList}))
    dispatch(setMidiPage({sliderList}))
    dispatch(toggleSettingsMode(false))
    //})
    return Promise.resolve()
  }
}
