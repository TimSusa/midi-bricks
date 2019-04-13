import React from 'react'
import ReactDOM from 'react-dom' 
import ReduxWrappedMuiApp from './providers/ReduxWrappedMuiApp'


const rootEl = document.querySelector('#root')
ReactDOM.render(<ReduxWrappedMuiApp />, rootEl)
if (module.hot) {
  module.hot.accept('./providers/ReduxWrappedMuiApp', () => {
    const NextApp = require('./providers/ReduxWrappedMuiApp').default
    ReactDOM.render(<NextApp />, rootEl)
  })
}
