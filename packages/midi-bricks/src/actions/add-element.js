import { Actions as sliderListActions } from './slider-list'
import { Actions as viewSettingsActions } from './view-settings'
import { getUniqueId } from '../utils/get-unique-id'
import { STRIP_TYPE } from '../reducers/slider-list'

const { PAGE } = STRIP_TYPE
const { addPage, addMidiElement } = sliderListActions
const { setLastFocusedPage, addPageTarget } = viewSettingsActions

export function addElement(type, payload) {
  return function(dispatch, getState) {
    if (type === PAGE) {
      const pageId = `page-${getUniqueId()}`

      dispatch(addPage({ lastFocusedPage: pageId }))
      const { viewSettings } = getState()
      dispatch(
        addPageTarget({
          pageTarget: {
            id: pageId,
            label: Array.isArray(viewSettings.pageTargets)
              ? `Page ${viewSettings.pageTargets.length}`
              : 'Page',
            colors: { colorFont: '#123456', color: '#dddddd' }
          }
        })
      )
      dispatch(setLastFocusedPage({ lastFocusedPage: pageId }))
    } else {
      const {
        viewSettings: { lastFocusedPage }
      } = getState()
      dispatch(addMidiElement({ lastFocusedPage, type }))
    }
  }
}
