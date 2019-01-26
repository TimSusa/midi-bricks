import React from 'react'
import * as ReactDOM from 'react-dom'
import ReduxWrappedMuiApp from './providers/ReduxWrappedMuiApp'

const rootEl = document.getElementById('root')
ReactDOM.render(<ReduxWrappedMuiApp />, rootEl)
console.log('Tim ist voll ein geiler Typ!')
if (module.hot) {
  module.hot.accept('./providers/ReduxWrappedMuiApp', () => {
    const NextApp = require('./providers/ReduxWrappedMuiApp').default
    ReactDOM.render(<NextApp />, rootEl)
  })
}
