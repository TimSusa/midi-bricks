import { batch } from 'react-redux'
import { Actions as sliderListActions } from '../slider-list'
import { Actions as viewSettingsActions } from '../view-settings'
const { copyToNextPage } = sliderListActions
const {
  setLastFocusedPage,
  setLastFocusedIndex,
  toggleSettingsMode
} = viewSettingsActions

export function thunkCopyToNextPage(payload) {
  return async function(dispatch, getState) {
    const {
      viewSettings: { lastFocusedIdxs },
      sliders: { pages }
    } = getState()
    const nextPageIdx = Object.keys(pages).reduce((acc, cur) => {
      return pages[cur].id
    }, '')
    console.log('nexpage', nextPageIdx)
    batch(() => {
      dispatch(copyToNextPage({ lastFocusedIdxs, nextPageIdx }))
      dispatch(setLastFocusedIndex({ i: 'none' }))
      dispatch(setLastFocusedPage({ lastFocusedPage: nextPageIdx }))
      dispatch(toggleSettingsMode(false))
    })
  }
}
