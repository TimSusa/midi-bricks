import { Actions as sliderListActions } from '../slider-list'
import { Actions as viewSettingsActions } from '../view-settings'
import { Actions as pageActions } from '../pages'
import { getUniqueId } from '../../../utils/get-unique-id'
import maxBy from 'lodash/maxBy'

const { updateSliderListOfPage } = pageActions
const { setMidiPage } = sliderListActions

const {
  setLastFocusedPage,
  setLastFocusedIndex,
  toggleSettingsMode
} = viewSettingsActions

export function thunkCopyToNextPage(pageId) {
  return async function (dispatch, getState) {
    const {
      viewSettings: { lastFocusedIdxs, lastFocusedPage },
      pages
    } = getState()

    const maxX = maxBy(pages[pageId].sliderList, 'x').x + 1
    const maxY = maxBy(pages[pageId].sliderList, 'y').y + 1
    const sliderList = lastFocusedIdxs.reduce(
      (acc, id) => {
        const entry = pages[lastFocusedPage].sliderList.find(
          (er) => er.i === id
        )
        if (entry) {
          acc.push({
            ...entry,
            i: getUniqueId(),
            x: maxX,
            y: maxY,
            isDraggable: false,
            isResizable: false
          })
        }
        return acc
      },
      [...pages[pageId].sliderList]
    )
    dispatch(setLastFocusedIndex({ i: 'none' }))
    dispatch(setLastFocusedPage({ lastFocusedPage: pageId }))
    dispatch(updateSliderListOfPage({ lastFocusedPage: pageId, sliderList }))
    dispatch(setMidiPage({ sliderList }))
    dispatch(toggleSettingsMode(false))
    return Promise.resolve()
  }
}
