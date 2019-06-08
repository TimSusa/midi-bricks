import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import {
  configureStore,
  getDefaultMiddleware,
  createSerializableStateInvariantMiddleware
} from 'redux-starter-kit'
import { persistReducer } from 'redux-persist'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

const persistConfig = {
  key: 'root',
  storage
}

const isDev = process.env.NODE_ENV !== 'production'

const logger = createLogger({
  duration: true
  // predicate: (getState, { type }) =>
  //   !['MIDI_MESSAGE_ARRIVED', 'HANDLE_SLIDER_CHANGE'].includes(type)
})

const serializableStateInvariant = createSerializableStateInvariantMiddleware({
  isSerializable(val) {
    const valType = typeof value
    return (
      valType === 'undefined' ||
      val === null ||
      valType === 'string' ||
      valType === 'boolean' ||
      valType === 'number' ||
      Array.isArray(val) ||
      isPlainObject(val)
    )
  }
})

const [immutableStateInvariant] = getDefaultMiddleware()
const devMiddleware = [
  immutableStateInvariant,
  thunk,
  rafScheduler,
  serializableStateInvariant,
  logger
]
export function configureAppStore(preloadedState) {
  const reducer = persistReducer(persistConfig, rootReducer)
  const store = configureStore({
    reducer,
    middleware: isDev
      ? devMiddleware
      : [...getDefaultMiddleware(), rafScheduler],
    preloadedState
    //enhancers: [monitorReducersEnhancer]
  })

  if (isDev && module.hot) {
    module.hot.accept('../reducers', () => store.replaceReducer(rootReducer))
  }

  return store
}

/**
 * Returns true if the passed value is "plain" object, i.e. an object whose
 * protoype is the root `Object.prototype`. This includes objects created
 * using object literals, but not for instance for class instances.
 *
 * @param {any} value The value to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
export default function isPlainObject(value) {
  if (typeof value !== 'object' || value === null) return false

  let proto = value
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(value) === proto
}

/**
 * Schedules actions with { meta: { raf: true } } to be dispatched inside a rAF loop
 * frame.  Makes `dispatch` return a function to remove the action from the queue in
 * this case.
 */
function rafScheduler(store) {
  return function(next) {
    let queuedActions = []
    let frame = null

    function loop() {
      frame = null
      try {
        if (queuedActions.length > 0) {
          next(queuedActions.shift())
        }
      } finally {
        maybeRaf()
      }
    }

    function maybeRaf() {
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

      return function cancel() {
        queuedActions = queuedActions.filter((a) => a !== action)
      }
    }
  }
}
