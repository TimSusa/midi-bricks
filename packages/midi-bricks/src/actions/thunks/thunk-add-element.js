import { Actions as sliderListActions } from '../slider-list'
import { Actions as viewSettingsActions } from '../view-settings'
import { getUniqueId } from '../../utils/get-unique-id'
import { STRIP_TYPE } from '../../reducers/slider-list'

const { PAGE } = STRIP_TYPE
const { addPage, addMidiElement, setMidiPage } = sliderListActions
const { setLastFocusedIndex, addPageTarget } = viewSettingsActions

export function addElement(type, payload) {
  return async function(dispatch, getState) {
    const {
      viewSettings: { lastFocusedPage, pageTargets }
    } = getState()

    if (type === PAGE) {
      await createPage(dispatch, lastFocusedPage, pageTargets)
    } else {
      await dispatch(
        addMidiElement({ lastFocusedPage, type, id: getUniqueId() })
      )
    }
  }
}

function createPage(dispatch, lastFocusedPage, pageTargets) {
  const pageId = `page-${getUniqueId()}`

  return Promise.all([
    dispatch(setLastFocusedIndex({ i: 'none' })),
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
    ),
    dispatch(addPage({ id: pageId, lastFocusedPage })),
    dispatch(setMidiPage({ focusedPage: pageId }))
  ])
}
