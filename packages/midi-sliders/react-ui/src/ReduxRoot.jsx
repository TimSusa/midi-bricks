import * as React from 'react'
import App from './App'
import {
  createStore,
  applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'

const logger = (createLogger)()

var middleware = applyMiddleware(logger, thunk)

if (process.env.NODE_ENV === 'development') {
  middleware = composeWithDevTools(middleware)
}

const defaultState = JSON.parse(
  window.localStorage.getItem('state')
)

export const store = createStore(rootReducer, {...defaultState}, middleware)

class ReduxRoot extends React.Component {
    state = {
      mobileOpen: true
    };

    render () {
      return (
        <Provider store={store}>
          <App />
        </Provider>
      )
    }
}

export default ReduxRoot
