import React from 'react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { ReduxWrappedMuiApp } from './ReduxWrappedMuiApp'
import { createMount, createShallow } from '@material-ui/core/test-utils'

import configureStore from 'redux-mock-store'
import { mockStore as storeMock } from '../reducers/test/mock-store'
import thunk from 'redux-thunk'

import Footer from '../components/footer/Footer'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)
const store = mockStore(storeMock)

Enzyme.configure({ adapter: new Adapter() })

describe.skip('<ReduxWrappedMuiApp />', () => {
  let mount

  beforeEach(() => {
    mount = createShallow({options: {untilSelector: 'Footer'}})
  })

  afterEach(() => {
    //mount.cleanUp()
  })

  test('should work', () => {
    const wrapper = mount(<ReduxWrappedMuiApp store={store} children={<Footer/>}/>)
    const found = wrapper.find('FooterButton')
  })
  
})
