import { Actions as viewActions } from '../view-settings'
import { Actions as pageActions } from '../pages'
import { Actions as sliderActions } from '../slider-list'

const { updatePages } = pageActions
const { updateViewSettings } = viewActions
const { updateSliderList } = sliderActions

export function thunkUndoRedo() {

  return async function (dispatch) {
    let historyList = JSON.parse(window.sessionStorage.getItem('history'))
    const undoRedo = historyList.shift()
    if (historyList.length > 0) {
      window.sessionStorage.setItem('history', JSON.stringify(historyList))
    }
    console.log('thunkUndoRedo ', historyList)

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
