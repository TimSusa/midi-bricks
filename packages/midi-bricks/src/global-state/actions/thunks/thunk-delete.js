import { batch } from 'react-redux'
import { Actions as sliderListActions } from '../slider-list'
import { Actions as viewSettingsActions } from '../view-settings'
import { Actions as pageActions } from '../pages'
import { updateSliderListOfPage } from './update-slider-list-of-page'

const { deletePages } = pageActions
const { deleteAll } = sliderListActions
const { deleteFooterPages } = viewSettingsActions

export function thunkDelete(type, i) {
  return async function (dispatch, getState) {
    const {
      viewSettings: { lastFocusedPage }
    } = getState()
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

      await updateSliderListOfPage({ lastFocusedPage, sliderList: undefined })
    }
  }
}
