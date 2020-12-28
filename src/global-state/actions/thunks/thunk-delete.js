import { batch } from 'react-redux'
import { Actions as sliderListActions } from '../slider-list'
import { Actions as viewSettingsActions } from '../view-settings'
import { Actions as pageActions } from '../pages'

const { deletePages } = pageActions
const {  deleteAll } = sliderListActions
const { deleteFooterPages, updateSliderListOfPage } = viewSettingsActions

export function thunkDelete(type) {
  return async function(dispatch, getState) {
    const {
      viewSettings: { lastFocusedPage },
    } = getState()
    batch(()=>{
      if (type === 'all') {
        // sliders
        dispatch(deleteAll())
        // viewsettginsg
        dispatch(deleteFooterPages())
        // pages
        dispatch(deletePages())
      }
      if (type === 'page') {
        // sliders
        dispatch(deleteAll())
        // viewsettginsg
        dispatch(deleteFooterPages())
        // pages
        dispatch(updateSliderListOfPage({ lastFocusedPage, sliderList: undefined }))
      }
    })
  }
}
