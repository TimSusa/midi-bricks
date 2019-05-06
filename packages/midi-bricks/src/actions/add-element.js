import { Actions as sliderListActions } from './slider-list'
import { Actions as viewSettingsActions} from './view-settings'

const { addPage } = sliderListActions
const {updateViewSettings} = viewSettingsActions

export  function addElement(mode) {
  return function(dispatch, getState) {
    return new Promise(async (resolve, reject) => {
      if (mode === 'PAGE') {
        dispatch(addPage())
        const {viewSettings, sliders: {sliderList}} = getState()
        resolve(dispatch(updateViewSettings({viewSettings, sliderList})))
      }
      reject(()=>{})
    })
  }
}
