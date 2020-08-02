import { batch } from 'react-redux'
import { Actions as sliderListActions } from '../slider-list'
import { Actions as undoRedoActions } from '../undo-redo'
// import { Actions as viewSettingsActions } from '../view-settings'
import { Actions as pageActions } from '../pages'

const { changeListOrder } = sliderListActions
const { updateSliderListOfPage } = pageActions
const { undoRedoUpdate } = undoRedoActions

export function thunkChangeListOrder(listOrder, lastFocusedPage) {
  return async function(dispatch, getState) {
    dispatch(undoRedoUpdate({ state: getState() }))

    const {
      viewSettings: { lastFocusedPage: lastFocusedPageLocal },
      sliders: { sliderList }
    } = getState()

    const mergedList = sliderList.reduce((acc, cur) => {
      const orderEntry = listOrder.find((er) => er.i === cur.i)
      if (orderEntry) {
        acc.push({ ...cur, ...orderEntry })
      }
      return acc
    }, [])
    batch(() => {
      dispatch(changeListOrder({ listOrder, lastFocusedPage: lastFocusedPageLocal }))
      dispatch(
        updateSliderListOfPage({ lastFocusedPage: lastFocusedPageLocal, sliderList: mergedList })
      )
    })
  }
}
