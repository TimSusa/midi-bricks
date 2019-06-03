import { batch } from 'react-redux'
import { Actions as sliderListActions } from '../slider-list'
import { Actions as viewSettingsActions } from '../view-settings'
import { Actions as pageActions } from '../pagesx'
import { thunkChangePage } from './thunk-change-page'
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
      sliders: {sliderList},
      pagesx
    } = getState()

    // TODO: Put a modal here to ask the user where to copy that shit
    const nextPageIdx = Object.keys(pagesx).reduce((acc, cur) => {
      return pagesx[cur].id
    }, '')
    console.log('nexpage', nextPageIdx)
    const me = lastFocusedIdxs.reduce((acc, id) => {
      const entry = pagesx[lastFocusedPage].sliderList.find(er => er.i === id)
      if (entry){
        // const toMergeStuff = sliderList.find(slider => slider.i === entry.i)
        acc.push({...entry, i: getUniqueId()})
      }
      return acc
    }, [...pagesx[nextPageIdx].sliderList])
    //dispatch(setLastFocusedPage({ lastFocusedPage: nextPageIdx }))
    //batch(() => {
    dispatch(setLastFocusedIndex({ i: 'none' }))
    dispatch(setLastFocusedPage({ lastFocusedPage: nextPageIdx }))
    dispatch(updateSliderListOfPage({lastFocusedPage: nextPageIdx, sliderList: me}))

    /// TODO: update sliderList here!!!!!
    dispatch(setMidiPage({sliderList: me}))

    //dispatch(thunkChangePage(lastFocusedPage, nextPageIdx))
    dispatch(toggleSettingsMode(false))
    //})
    return Promise.resolve()
  }
}
