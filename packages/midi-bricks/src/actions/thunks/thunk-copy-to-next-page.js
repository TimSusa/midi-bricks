import { Actions as sliderListActions } from '../slider-list'
import { Actions as viewSettingsActions } from '../view-settings'
const { copyToNextPage, setMidiPage } = sliderListActions
const { setLastFocusedPage } = viewSettingsActions

export function thunkCopyToNextPage(payload) {
  return async function(dispatch, getState) {
    const {
      viewSettings: { lastFocusedIdxs, lastFocusedPage },
      sliders: { pages }
    } = getState()
    const nextPageIdx = Object.keys(pages).reduce((acc, cur) => {
      return pages[cur].id
    }, '')
    console.log('nexpage', nextPageIdx)
    return Promise.all([
      dispatch(copyToNextPage({ lastFocusedIdxs, nextPageIdx })),
      dispatch(setLastFocusedPage({lastFocusedPage: nextPageIdx}))
    ])
  }
}
