import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { reducer } from './'
import isEmpty from 'lodash/isEmpty'
/**
 * Schedules actions with { meta: { delay: N } } to be delayed by N milliseconds.
 * Makes `dispatch` return a function to cancel the timeout in this case.
 */
const timeoutScheduler = () => next => action => {
  if (action === undefined) return
  if (!action.meta || !action.meta.delay) {
    return next(action)
  }

  const timeoutId = setTimeout(() => next(action), action.meta.delay)

  return function cancel () {
    clearTimeout(timeoutId)
  }
}


//const HISTORY_LENGTH = 20
const setToSessionStorage = store => next => action => {
  let result = next(action)
  if ( !['update', 'init', 'toggleLive', 'delete', 'setLast'].some(type => action&&action.type.includes(type))) {
    const state = store.getState()
    const tmpList = JSON.parse(window.sessionStorage.getItem('history'))
    let historyList = !isEmpty(tmpList) ? tmpList : []
    if (!state.viewSettings.isLiveMode && historyList.length <= state.viewSettings.historyMaxLength) {
      historyList.unshift(state)
      if ((historyList.length+1) > state.viewSettings.historyMaxLength) {
        historyList.pop()
      }
      // console.log('afsdftim ', action.type)
      window.sessionStorage.setItem('history', JSON.stringify(historyList))
      // console.log('dispatching', action)
      // console.log('session history', historyList)
    }

    

  }
  // if (action.type === 'removeSession') {
  //   console.log('dispatching', action)
  //   window.sessionStorage.setItem('history', JSON.stringify(null))
  //   //window.sessionStorage.setItem('state', JSON.stringify(null))
  // }
  return result
}


export function configureAppStore () {
  const obj = {
    reducer,
    middleware: getDefaultMiddleware().concat(setToSessionStorage,timeoutScheduler, rafScheduler )
  }
  const store = configureStore(obj)
  return store
}

/**
 * Schedules actions with { meta: { raf: true } } to be dispatched inside a rAF loop
 * frame.  Makes `dispatch` return a function to remove the action from the queue in
 * this case.
 */
function rafScheduler () {
  return function (next) {
    let queuedActions = []
    let frame = null

    function loop () {
      frame = null
      try {
        if (queuedActions.length > 0) {
          next(queuedActions.shift())
        }
      } finally {
        maybeRaf()
      }
    }

    function maybeRaf () {
      if (queuedActions.length > 0 && !frame) {
        frame = requestAnimationFrame(loop)
      }
    }

    return (action) => {
      if (!action.meta || !action.meta.raf) {
        return next(action)
      }

      queuedActions.push(action)
      maybeRaf()

      return function cancel () {
        queuedActions = queuedActions.filter((a) => a !== action)
      }
    }
  }
}
