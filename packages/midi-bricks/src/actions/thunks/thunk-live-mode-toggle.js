import { Actions as viewActions } from '../view-settings'
import { Actions as pageActions } from '../pages'
import { Actions as undoRedoActions } from '../undo-redo'

import localforage from 'localforage'
const { deletePages, updatePages } = pageActions
const { toggleLiveMode } = viewActions
const { undoRedoDelete } = undoRedoActions

export function thunkLiveModeToggle(lastFocusedPage, focusedPage) {
  return async function(dispatch, getState) {
    const {
      viewSettings: { isLiveMode },
      pages,
      undoRedo
    } = getState()

    if (!isLiveMode) {
      await save('pages', pages)
      dispatch(deletePages())

      await save('undoRedo', undoRedo)
      dispatch(undoRedoDelete())
    } else {
      dispatch(updatePages({ pages: await localforage.getItem('pages') }))
    }
    dispatch(toggleLiveMode())
    return Promise.resolve()
  }
}

async function save(key, value) {
  await localforage.setItem(key, value)
}
