import React from 'react'
import PropTypes from 'prop-types'
import MuiWrappedApp from './MuiWrappedApp'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from '../reducers'
import { PersistGate } from 'redux-persist/integration/react'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

const logger = createLogger({
  duration: true,
  // predicate: (getState, { type }) =>
  //   !['MIDI_MESSAGE_ARRIVED', 'HANDLE_SLIDER_CHANGE'].includes(type)
})

let middleware = null
if (process.env.NODE_ENV === 'development') {
  middleware = applyMiddleware(thunk, logger)
  middleware = composeWithDevTools(middleware)
} else {
  middleware = applyMiddleware(thunk)
}

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = createStore(persistedReducer, {}, middleware)

let persistor = persistStore(store)

ReduxWrappedMuiApp.propTypes = {
  children: PropTypes.any,
  store: PropTypes.any
}

export function ReduxWrappedMuiApp(props) {
  const { store: propsStore, children } = props
  return (
    <Provider store={propsStore || store}>
      {children ? (
        <MuiWrappedApp {...props}>{children}</MuiWrappedApp>
      ) : (
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <MuiWrappedApp {...props} />
        </PersistGate>
      )}
    </Provider>
  )
}
ReduxWrappedMuiApp.displayName = 'ReduxWrappedMuiApp'
export default ReduxWrappedMuiApp
