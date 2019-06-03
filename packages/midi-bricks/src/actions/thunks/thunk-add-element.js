
import { Actions as sliderListActions } from '../slider-list'
import { Actions as viewSettingsActions } from '../view-settings'
import { thunkChangePage } from './thunk-change-page'
import { getUniqueId } from '../../utils/get-unique-id'
import { STRIP_TYPE } from '../../reducers/slider-list'
import { Actions as pageActions } from '../pagesx'

const { createPage, updateSliderListOfPage } = pageActions
const { PAGE } = STRIP_TYPE
const { addMidiElement } = sliderListActions
const { addPageTarget } = viewSettingsActions

export function addElement(type, payload) {
  const pageId = `page-${getUniqueId()}`

  return function(dispatch, getState) {
    const {
      viewSettings: { lastFocusedPage, pageTargets }
    } = getState()

    if (type === PAGE) {
      //batch(() => {
      dispatch(
        addPageTarget({
          pageTarget: {
            id: pageId,
            label: Array.isArray(pageTargets)
              ? `Page ${pageTargets.length + 1}`
              : 'Page',
            colors: { colorFont: '#123456', color: '#dddddd' }
          }
        })
      )
      dispatch(createPage({ id: pageId, lastFocusedPage }))
      dispatch(thunkChangePage(lastFocusedPage, pageId))
      //})
    } else {
      const id = getUniqueId()
      dispatch(addMidiElement({ type, id }))
      const {
        viewSettings: { lastFocusedPage },
        sliders: { sliderList }
      } = getState()

      dispatch(updateSliderListOfPage({ lastFocusedPage, sliderList }))
    }
  }
}
