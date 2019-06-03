import { Actions as sliderListActions } from '../slider-list'
import { Actions as viewSettingsActions } from '../view-settings'
import { getUniqueId } from '../../utils/get-unique-id'
import { STRIP_TYPE } from '../../reducers/slider-list'

const { PAGE } = STRIP_TYPE
const { addPage, addMidiElement, setMidiPage } = sliderListActions
const { setLastFocusedPage, setLastFocusedIndex, addPageTarget } = viewSettingsActions

//TO DO: this is not used yet
export function thunkDeletePage(payload) {
  return async function(dispatch, getState) {
    const {
      viewSettings: { lastFocusedPage },
    } = getState()
    await dispatch(addMidiElement({ lastFocusedPage}))
  }
}
