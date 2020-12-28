import { Actions as sliderListActions } from '../slider-list'
import { Actions as pageActions } from '../pages'

const { changeListOrder } = sliderListActions
const { updateSliderListOfPage } = pageActions

export function thunkChangeListOrder(listOrder) {
  return async function (dispatch, getState) {
    //window.sessionStorage.setItem('state', JSON.stringify(getState()))

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
    dispatch(
      updateSliderListOfPage({ lastFocusedPage, sliderList: mergedList })
    )
  }
}
