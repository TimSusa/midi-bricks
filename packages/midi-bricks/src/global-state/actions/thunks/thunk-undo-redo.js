import { Actions as viewActions } from '../view-settings'
import { Actions as pageActions } from '../pages'
import { Actions as sliderActions } from '../slider-list'

const { updatePages } = pageActions
const { updateViewSettings } = viewActions
const { updateSliderList } = sliderActions

export function thunkUndoRedo() {
  return async function (dispatch) {
    const undoRedo = JSON.parse(window.sessionStorage.getItem('state'))
    const { viewSettings, pages, sliders } = undoRedo
    const { sliderList } = sliders || {}
    dispatch(
      updateViewSettings({
        viewSettings,
        sliderList: sliderList || []
      })
    )
    dispatch(updatePages({ pages }))
    dispatch(updateSliderList(sliderList))

    return Promise.resolve()
  }
}
