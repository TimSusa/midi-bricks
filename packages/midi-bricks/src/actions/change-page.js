import { Actions as sliderListActions } from './slider-list'
import { Actions as viewSettingsActions } from './view-settings'
import { getUniqueId } from '../utils/get-unique-id'
import { STRIP_TYPE } from '../reducers/slider-list'

const { PAGE } = STRIP_TYPE
const { addPage, addMidiElement } = sliderListActions
const { setLastFocusedPage, addPageTarget, setPageTargetSettings } = viewSettingsActions


export function changePage(payload) {
  console.log('changePage', payload)
  setPageTargetSettings(payload)
  return function(dispatch, getState) {
    setPageTargetSettings(payload)

    return new Promise((resolve, reject) => {
      resolve( dispatch(setPageTargetSettings(payload)))
    })
  }
}
