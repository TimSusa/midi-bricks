import { Actions as sliderListActions } from './slider-list'
import { Actions as viewSettingsActions } from './view-settings'
import { getUniqueId } from '../utils/get-unique-id'
import { STRIP_TYPE } from '../reducers/slider-list'

const { PAGE } = STRIP_TYPE
const { addPage, addMidiElement, setMidiPage } = sliderListActions
const { setLastFocusedPage, setLastFocusedIndex, addPageTarget } = viewSettingsActions

export function addElement(type, payload) {
  return async function(dispatch, getState) {
    if (type === PAGE) {
      await createPage(dispatch, getState)
    } else {
      const {
        viewSettings: { lastFocusedPage },
      } = getState()
      await dispatch(addMidiElement({ lastFocusedPage, type, id: getUniqueId() }))
    }
  }
}

function createPage(dispatch, getState) {
  const pageId = `page-${getUniqueId()}`

  const { viewSettings } = getState()
  
  return Promise.all([
    dispatch(addPage({ id: pageId, lastFocusedPage: viewSettings.lastFocusedPage })),
    dispatch(
      addPageTarget({
        pageTarget: {
          id: pageId,
          label: Array.isArray(viewSettings.pageTargets)
            ? `Page ${viewSettings.pageTargets.length + 1}`
            : 'Page',
          colors: { colorFont: '#123456', color: '#dddddd' }
        }
      })
    ),
    dispatch(setLastFocusedPage({ lastFocusedPage: pageId })),
    dispatch(setLastFocusedIndex({i: 'none'})),
    dispatch(setMidiPage({focusedPage: pageId, lastFocusedPage: viewSettings.lastFocusedPage}))
  ])
}
