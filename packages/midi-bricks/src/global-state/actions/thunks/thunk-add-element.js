import { Actions as sliderListActions } from '../slider-list'
import { Actions as viewSettingsActions } from '../view-settings'
import { thunkChangePage } from './thunk-change-page'
//import { Actions as undoRedoActions } from '../undo-redo'
import { getUniqueId } from '../../../utils/get-unique-id'
import { STRIP_TYPE } from '../../reducers/slider-list'
import { Actions as pageActions } from '../pages'
import { updateSliderListOfPage } from './update-slider-list-of-page'
import localForage from 'localforage'

const { createPage } = pageActions
const { PAGE } = STRIP_TYPE
const { addMidiElement, updateSliderList } = sliderListActions
const { addPageTarget } = viewSettingsActions
//const { undoRedoUpdate } = undoRedoActions

export function addElement(type) {
  const pageId = `page-${getUniqueId()}`

  return async function (dispatch, getState) {
    const {
      viewSettings: { lastFocusedPage, pageTargets }
    } = getState()
    window.sessionStorage.setItem('state', JSON.stringify(getState()))
    //dispatch(undoRedoUpdate({ state: getState() }))

    if (type === PAGE) {
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
      // dispatch(createPage({ id: pageId, lastFocusedPage }))
      let tmpPages = localForage.getItem('pages')

      tmpPages = {
        ...tmpPages,
        [pageId]: {
          sliderList: [],
          id: pageId,
          label: `Page ${Object.keys(tmpPages).length + 1}`
        }
      }
      localForage.setItem('pages', tmpPages)
      dispatch(thunkChangePage(lastFocusedPage, pageId))
      //dispatch(thunkToggleLayoutMode())
    } else {
      const id = getUniqueId()
      dispatch(addMidiElement({ type, id }))
      const {
        viewSettings: { lastFocusedPage },
        sliders: { sliderList }
      } = getState()

      await updateSliderListOfPage({ lastFocusedPage, sliderList })
    }
  }
}
