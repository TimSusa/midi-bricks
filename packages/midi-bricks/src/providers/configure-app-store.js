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
import undoable from 'redux-undo'

const persistConfig = {
  key: 'root',
  storage
}

const isDev = process.env.NODE_ENV !== 'production'

const logger = createLogger({
  duration: true,
  predicate: (getState, { type }) =>
    !['MIDI_MESSAGE_ARRIVED', 'HANDLE_SLIDER_CHANGE'].includes(type)
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
  serializableStateInvariant,
  logger
]
export function configureAppStore(preloadedState) {
  const reducer = persistReducer(
    persistConfig,
    undoable(rootReducer, {
      limit: 5,
      syncFilter: false,
      filter: function filterActions(action, currentState, previousHistory) {
        return [
          'DELETE',
          'DELETE_ALL',
          'CHANGE_LIST_ORDER',
          'ADD_MIDI_ELEMENT',
          'ADD_PAGE',
          'LOAD_FILE'
        ].includes(action.type)
      }
    })
  )
  const store = configureStore({
    reducer,
    middleware: isDev ? devMiddleware : [...getDefaultMiddleware()],
    preloadedState
    // enhancers: [monitorReducersEnhancer]
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
