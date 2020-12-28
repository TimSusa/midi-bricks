import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { reducer } from './'
import isEmpty from 'lodash/isEmpty'
import isObject from 'lodash/isObject'

const setToSessionStorage = store => next => action => {
  if (!isObject(action)) return
  let result = next(action)
  if ( !['update', 'init', 'viewSettings', 'delete'].some(type => action&&action.type.includes(type))) {
    const state = store.getState()
    const tmpList = JSON.parse(window.sessionStorage.getItem('history'))
    let historyList = !isEmpty(tmpList) ? tmpList : []
    if (!state.viewSettings.isLiveMode && historyList.length <= state.viewSettings.historyMaxLength) {
      historyList.unshift(state)
      if ((historyList.length+1) > state.viewSettings.historyMaxLength) {
        historyList.pop()
      }
      window.sessionStorage.setItem('history', JSON.stringify(historyList))
    }
  }
  return result
}


export function configureAppStore () {
  const obj = {
    reducer,
    middleware: getDefaultMiddleware().concat(setToSessionStorage)
  }
  const store = configureStore(obj)
  return store
}
