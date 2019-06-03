import React from 'react'
import PropTypes from 'prop-types'
import MuiWrappedApp from './MuiWrappedApp'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { configureAppStore } from './configure-app-store'
import { persistStore } from 'redux-persist'

ReduxWrappedMuiApp.propTypes = {
  children: PropTypes.any,
  store: PropTypes.any
}

export function ReduxWrappedMuiApp(props) {
  const store = configureAppStore()
  const persistedStore = persistStore(store)
  const { store: propsStore, children } = props
  return (
    <Provider store={propsStore || store}>
      {children ? (
        <MuiWrappedApp {...props}>{children}</MuiWrappedApp>
      ) : (
        <PersistGate loading={<div>Loading...</div>} persistor={persistedStore}>
          <MuiWrappedApp {...props} />
        </PersistGate>
      )}
    </Provider>
  )
}
ReduxWrappedMuiApp.displayName = 'ReduxWrappedMuiApp'
export default ReduxWrappedMuiApp
