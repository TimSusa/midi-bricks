// import { Actions as sliderListActions } from '../slider-list'
// import { Actions as viewSettingsActions } from '../view-settings'


//TO DO: this is not used yet
export function thunkDeletePage(payload) {
  return async function(dispatch, getState) {
    const {
      viewSettings: { lastFocusedPage },
    } = getState()
    // await dispatch(addMidiElement({ lastFocusedPage}))
  }
}
