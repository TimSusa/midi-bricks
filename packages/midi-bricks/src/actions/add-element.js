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
      createPage(dispatch, getState)
    } else {
      const {
        viewSettings: { lastFocusedPage },
        sliders: { pages }
      } = getState()
      if (!pages) {
        const np = createPage(dispatch, getState)
        dispatch(addMidiElement({ lastFocusedPage: np, type }))
      } else {
        dispatch(addMidiElement({ lastFocusedPage, type }))
      }
      
    }
  }
}

function createPage(dispatch, getState) {
  const pageId = `page-${getUniqueId()}`

  dispatch(addPage({ lastFocusedPage: pageId }))
  const { viewSettings } = getState()
  dispatch(
    addPageTarget({
      pageTarget: {
        id: pageId,
        label: Array.isArray(viewSettings.pageTargets)
          ? `Page ${viewSettings.pageTargets.length+1}`
          : 'Page',
        colors: { colorFont: '#123456', color: '#dddddd' }
      }
    })
  )
  dispatch(setLastFocusedPage({ lastFocusedPage: pageId }))
  return pageId
}
