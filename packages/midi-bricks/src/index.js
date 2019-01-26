/*eslint-disable-next-line */
import React from 'react'
import ReactDOM from 'react-dom' 
/*eslint-disable-next-line */
import ReduxWrappedMuiApp from './providers/ReduxWrappedMuiApp'

const rootEl = document.getElementById('root')
ReactDOM.render(<ReduxWrappedMuiApp />, rootEl)
console.log('Tim ist voll ein geiler Typ!')
/*eslint-disable-next-line */
if (module.hot) {
  /*eslint-disable-next-line */
  module.hot.accept('./providers/ReduxWrappedMuiApp', () => {
    /*eslint-disable-next-line */
    const NextApp = require('./providers/ReduxWrappedMuiApp').default
    ReactDOM.render(<NextApp />, rootEl)
  })
}
