import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import reducer from './reducers'

/**
 * Schedules actions with { meta: { delay: N } } to be delayed by N milliseconds.
 * Makes `dispatch` return a function to cancel the timeout in this case.
 */
const timeoutScheduler = () => next => action => {
  if (!action.meta || !action.meta.delay) {
    return next(action)
  }

  const timeoutId = setTimeout(() => next(action), action.meta.delay)

  return function cancel () {
    clearTimeout(timeoutId)
  }
}

export function configureAppStore () {
  const obj = {
    reducer,
    middleware: getDefaultMiddleware().concat(timeoutScheduler, rafScheduler)
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
