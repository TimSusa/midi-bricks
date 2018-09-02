import * as React from 'react'
import MuiWrappedApp from './MuiWrappedApp'
import {
  createStore,
  applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'
import { PersistGate } from 'redux-persist/integration/react'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

const logger = (createLogger)()

let middleware = null
if (process.env.NODE_ENV === 'development') {
  middleware = applyMiddleware(logger, thunk)
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

class ReduxRoot extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <MuiWrappedApp />
        </PersistGate>
      </Provider>
    )
  }
}

export default ReduxRoot
