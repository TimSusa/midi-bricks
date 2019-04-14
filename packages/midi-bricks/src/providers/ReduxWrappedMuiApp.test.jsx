import React from 'react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { ReduxWrappedMuiApp } from './ReduxWrappedMuiApp'
import { createMount } from '@material-ui/core/test-utils'

import configureStore from 'redux-mock-store'
import { mockStore as storeMock } from '../reducers/test/mock-store'
import thunk from 'redux-thunk'

import Footer from '../components/footer/Footer'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)
const store = mockStore(storeMock)

Enzyme.configure({ adapter: new Adapter() })

describe('<ReduxWrappedMuiApp />', () => {
  let mount

  beforeEach(() => {
    mount = createMount({ options: { untilSelector: 'Footer' } })
  })

  afterEach(() => {
    mount.cleanUp()
  })

  test('should work', () => {
    const wrapper = mount(
      <ReduxWrappedMuiApp store={store}>
        <Footer />
      </ReduxWrappedMuiApp>
    )
    const foundFooterButton = wrapper.find('FooterButton')
    expect(foundFooterButton).toHaveLength(4)
    expect(foundFooterButton.at(0).props()).toHaveProperty('item')
    expect(foundFooterButton.at(1).props()).toHaveProperty('item')
    expect(foundFooterButton.at(2).props()).toHaveProperty('item')
    expect(foundFooterButton.at(3).props()).toHaveProperty('item')
  })
})
