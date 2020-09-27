import { Actions as sliderListActions } from '../slider-list'
//import { Actions as pageActions } from '../pages'
import { updateSliderListOfPage } from './update-slider-list-of-page'
const { changeListOrder } = sliderListActions
//const { updateSliderListOfPage } = pageActions

export function thunkChangeListOrder(listOrder) {
  return async function (dispatch, getState) {
    window.sessionStorage.setItem('state', JSON.stringify(getState()))

    const {
      viewSettings: { lastFocusedPage },
      sliders: { sliderList }
    } = getState()

    const mergedList = sliderList.reduce((acc, cur) => {
      const orderEntry = listOrder.find((er) => er.i === cur.i)
      if (orderEntry) {
        acc.push({ ...cur, ...orderEntry })
      }
      return acc
    }, [])
    dispatch(changeListOrder({ listOrder, lastFocusedPage }))

    await updateSliderListOfPage({ lastFocusedPage, sliderList: mergedList })
  }
}
