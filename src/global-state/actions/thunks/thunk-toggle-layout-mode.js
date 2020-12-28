import { Actions as sliderActions } from '../slider-list'
import { Actions as viewActions } from '../view-settings'
const { toggleLayoutMode } = viewActions
const { updateSliderList } = sliderActions

export function thunkToggleLayoutMode() {
  return async function (dispatch, getState) {
    //window.sessionStorage.setItem('state', JSON.stringify(getState()))
    const {
      viewSettings: { isLayoutMode },
      sliders: { sliderList: tmpSliderList }
    } = getState()

    let sliderList = []
    if (isLayoutMode) {
      sliderList = tmpSliderList.map((item) => {
        return { ...item, isDraggable: false, isResizable: false }
      })
    } else {
      sliderList = tmpSliderList.map((item) => {
        return { ...item, isDraggable: true, isResizable: true }
      })
    }

    dispatch(toggleLayoutMode({ isLayoutMode: !isLayoutMode }))
    dispatch(updateSliderList(sliderList))

    return Promise.resolve()
  }
}
