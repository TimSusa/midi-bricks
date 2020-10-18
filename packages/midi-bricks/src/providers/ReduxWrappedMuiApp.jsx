import React from 'react'
import PropTypes from 'prop-types'
import MuiWrappedApp from './MuiWrappedApp'
import { Provider } from 'react-redux'

import { configureAppStore } from '../global-state/configure-app-store'

import localforage from 'localforage'

localforage.config({
  //driver      : localforage.WEBSQL, // Force WebSQL; same as using setDriver()
  name: 'MIDI-Bricks',
  version: 1,
  // size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName: 'midi-bricks-store', // Should be alphanumeric, with underscores.
  description: 'This store is intended to save MIDI Bricks Pages for live mode.'
})

ReduxWrappedMuiApp.propTypes = {
  children: PropTypes.any,
  store: PropTypes.object
}

export function ReduxWrappedMuiApp(props) {
  const store = configureAppStore()
  const { store: propsStore, children } = props
  return (
    <Provider store={propsStore || store}>
      {children ? (
        <MuiWrappedApp {...props}>{children}</MuiWrappedApp>
      ) : (
        <MuiWrappedApp {...props} />
      )}
    </Provider>
  )
}
ReduxWrappedMuiApp.displayName = 'ReduxWrappedMuiApp'
export default ReduxWrappedMuiApp
