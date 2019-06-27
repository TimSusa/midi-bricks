import { Actions as viewActions } from '../view-settings'
import { Actions as pageActions } from '../pages'
import { Actions as undoRedoActions } from '../undo-redo'
import { Actions as sliderActions } from '../slider-list'

import localforage from 'localforage'

const { deletePages, updatePages } = pageActions
const { toggleLiveMode, updateViewSettings } = viewActions
const { undoRedoUpdate, undoRedoDelete, undoRedoLoad } = undoRedoActions
const { loadFile } = sliderActions

export function thunkUndoRedo(payload) {
  return async function(dispatch, getState) {
    const { offset } = payload
    let history = {}
    const { undoRedo } = getState()

    if (offset) {
      if (offset === -1) {
        history = undoRedo
        //dispatch(undoRedoUpdate({state: future}))
      } else if (offset === 1) {
        // dispatch(undoRedoUpdate({state: past}))
        // history = future
      }
    }

    const { viewSettings, pages, sliders } = history

    dispatch(
      updateViewSettings({
        viewSettings,
        sliderList:
          (sliders.sliderList &&
            (sliders.sliderList.length > 0 && sliders.sliderList)) ||
          []
      })
    )
    dispatch(updatePages({ pages }))
    dispatch(loadFile({ content: { sliders, presetName: '' } }))

    return Promise.resolve()
  }
}
