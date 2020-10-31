import { Actions as viewActions } from '../view-settings'
import { Actions as pageActions } from '../pages'

import localforage from 'localforage'
const { deletePages, updatePages } = pageActions
const { toggleLiveMode } = viewActions

export function thunkLiveModeToggle() {
  return async function (dispatch, getState) {
    const {
      viewSettings: { isLiveMode },
      pages
    } = getState()

    if (!isLiveMode) {
      await save('pages', pages)
      dispatch(deletePages())

      //window.sessionStorage.setItem('state', JSON.stringify(null))
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
