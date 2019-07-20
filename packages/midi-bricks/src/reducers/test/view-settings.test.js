import { reducers } from '../view-settings'
import { reducers as sliderListReducers } from '../slider-list'
import { mockStore } from './mock-store'

describe('Test Reducers for slider-list', () => {
  test('TOGGLE_PAGE', () => {
    const expected = 'HOME'
    const { TOGGLE_PAGE } = reducers
    const state = TOGGLE_PAGE(mockStore.viewSettings, {
      payload: { pageType: expected },
    })
    expect(state.pageType).toEqual(expected)
  })

  test('TOGGLE_LIVE_MODE with payload', () => {
    const val = mockStore.viewSettings.isLiveMode
    const expected = !val
    const { TOGGLE_LIVE_MODE } = reducers
    const { isLiveMode } = TOGGLE_LIVE_MODE(mockStore.viewSettings, {
      payload: { isLiveMode: true },
    })
    expect(isLiveMode).toEqual(expected)
  })

  test('TOGGLE_LIVE_MODE without payload', () => {
    const val = mockStore.viewSettings.isLiveMode
    const expected = !val
    const { TOGGLE_LIVE_MODE } = reducers
    const { isLiveMode } = TOGGLE_LIVE_MODE(mockStore.viewSettings, {
      payload: {},
    })
    expect(isLiveMode).toEqual(expected)
  })

  test('TOGGLE_COMPACT_MODE without payload', () => {
    const val = mockStore.viewSettings.isCompactHorz
    const expected = !val
    const { TOGGLE_COMPACT_MODE } = reducers
    const { isCompactHorz } = TOGGLE_COMPACT_MODE(mockStore.viewSettings, {
      payload: {},
    })
    expect(isCompactHorz).toEqual(expected)
  })

  test('TOGGLE_SETTINGS_MODE without payload', () => {
    const val = mockStore.viewSettings.isSettingsMode
    const expected = !val
    const { TOGGLE_SETTINGS_MODE } = reducers
    const { isSettingsMode } = TOGGLE_SETTINGS_MODE(mockStore.viewSettings, {
      payload: {},
    })
    expect(isSettingsMode).toEqual(expected)
  })

  test('TOGGLE_AUTO_ARRANGE_MODE without payload', () => {
    const val = mockStore.viewSettings.isAutoArrangeMode
    const expected = !val
    const { TOGGLE_AUTO_ARRANGE_MODE } = reducers
    const { isAutoArrangeMode } = TOGGLE_AUTO_ARRANGE_MODE(
      mockStore.viewSettings,
      { payload: {} }
    )
    expect(isAutoArrangeMode).toEqual(expected)
  })

  test('CHANGE_THEME without payload', () => {
    const val = mockStore.viewSettings.isChangedTheme
    const expected = !val
    const { CHANGE_THEME } = reducers
    const { isChangedTheme } = CHANGE_THEME(mockStore.viewSettings, {
      payload: {},
    })
    expect(isChangedTheme).toEqual(expected)
  })

  test('TOGGLE_SETTINGS_DIALOG_MODE without payload', () => {
    const val = mockStore.viewSettings.isSettingsDialogMode
    const expected = !val
    const { TOGGLE_SETTINGS_DIALOG_MODE } = reducers
    const { isSettingsDialogMode } = TOGGLE_SETTINGS_DIALOG_MODE(
      mockStore.viewSettings,
      { payload: {} }
    )
    expect(isSettingsDialogMode).toEqual(expected)
  })

  test('DELETE_FOOTER_PAGES', () => {
    const val = mockStore.viewSettings.footerPages
    const expected = []
    const { DELETE_FOOTER_PAGES } = reducers

    const { footerPages } = DELETE_FOOTER_PAGES(mockStore.viewSettings, {
      payload: {},
    })
    expect(val.length > 0).toEqual(true)
    expect(footerPages.length).toEqual(0)
    expect(footerPages).toEqual(expected)
  })

  test('UPDATE_VIEW_SETTINGS', () => {
    const { ADD_PAGE } = sliderListReducers
    const { sliderList: listWithAddedPage } = ADD_PAGE(mockStore.sliders, {})
    const { UPDATE_VIEW_SETTINGS } = reducers
    const { footerPages } = UPDATE_VIEW_SETTINGS(mockStore.viewSettings, {
      payload: { sliderList: listWithAddedPage },
    })
    expect(mockStore.viewSettings.footerPages.length + 1).toEqual(
      footerPages.length
    )
  })


  test('DELETE_PAGE_FROM_FOOTER', () => {
    const { DELETE_PAGE_FROM_FOOTER } = reducers
    const {i} = mockStore.viewSettings.footerPages.find(cur => cur.type === 'PAGE')
    const { footerPages } = DELETE_PAGE_FROM_FOOTER(mockStore.viewSettings, {
      payload: { i },
    })
    expect(mockStore.viewSettings.footerPages.length-1).toEqual(
      footerPages.length
    )
    expect(footerPages.find(cur => cur.i === i)).toBeFalsy()
  })

  // test('CHANGE_FOOTER_PAGE label', () => {
  //   const expLabel = 'this is just a test'
  //   const { CHANGE_FOOTER_PAGE } = reducers
  //   const idx = mockStore.viewSettings.footerPages.findIndex(cur => cur.type === 'PAGE')
  //   const {i} = mockStore.viewSettings.footerPages[idx]
  //   const { footerPages } = CHANGE_FOOTER_PAGE(mockStore.viewSettings, {
  //     payload: { i, label: expLabel },
  //   })
  //   expect(footerPages[idx].label).toEqual(
  //     expLabel
  //   )
  // })
  // test('CHANGE_FOOTER_PAGE color', () => {
  //   const expColor = 'rgba(24, 11, 11, 1)'
  //   const { CHANGE_FOOTER_PAGE } = reducers
  //   const idx = mockStore.viewSettings.footerPages.findIndex(cur => cur.type === 'PAGE')
  //   const {i} = mockStore.viewSettings.footerPages[idx]
  //   const { footerPages } = CHANGE_FOOTER_PAGE(mockStore.viewSettings, {
  //     payload: { i, color: expColor },
  //   })
  //   expect(footerPages[idx].colors.color).toEqual(
  //     expColor
  //   )
  // })
  // test('CHANGE_FOOTER_PAGE colorFont', () => {
  //   const expcolorFont = 'rgba(24, 11, 11, 1)'
  //   const { CHANGE_FOOTER_PAGE } = reducers
  //   const idx = mockStore.viewSettings.footerPages.findIndex(cur => cur.type === 'PAGE')
  //   const {i} = mockStore.viewSettings.footerPages[idx]
  //   const { footerPages } = CHANGE_FOOTER_PAGE(mockStore.viewSettings, {
  //     payload: { i, colorFont: expcolorFont },
  //   })
  //   expect(footerPages[idx].colors.colorFont).toEqual(
  //     expcolorFont
  //   )
  // })

  test('SET_FOOTER_BUTTON_FOCUS', () => {
    const { SET_FOOTER_BUTTON_FOCUS } = reducers
    const idx = mockStore.viewSettings.footerPages.findIndex(cur => cur.type === 'PAGE')
    const {i} = mockStore.viewSettings.footerPages[idx]
    const explastFocusedFooterButtonIdx = i

    const { lastFocusedFooterButtonIdx } = SET_FOOTER_BUTTON_FOCUS(mockStore.viewSettings, {
      payload: { i },
    })
    expect(lastFocusedFooterButtonIdx).toEqual(
      explastFocusedFooterButtonIdx
    )
  })

  test('SWAP_FOOTER_PAGES to the right', () => {
    const { SWAP_FOOTER_PAGES } = reducers
    const idx = mockStore.viewSettings.footerPages.findIndex(cur => cur.type === 'PAGE')
    const {i} = mockStore.viewSettings.footerPages[idx]
    const explastFocusedFooterButtonIdx = idx + 1 

    const { footerPages } = SWAP_FOOTER_PAGES(mockStore.viewSettings, {
      payload: { srcIdx: idx, offset: 1 },
    })
    const newIdx = footerPages.findIndex(cur => cur.i === i)
    expect(newIdx).toEqual(
      explastFocusedFooterButtonIdx
    )
  })

  test('SWAP_FOOTER_PAGES to the left', () => {
    const { SWAP_FOOTER_PAGES } = reducers
    const idx = mockStore.viewSettings.footerPages.findIndex(cur => cur.type === 'PAGE')
    const {i} = mockStore.viewSettings.footerPages[idx]

    const { footerPages } = SWAP_FOOTER_PAGES(mockStore.viewSettings, {
      payload: { srcIdx: idx, offset: -1 },
    })
    const newIdx = footerPages.findIndex(cur => cur.i === i)
    const explastFocusedFooterButtonIdx = mockStore.viewSettings.footerPages.length - 1

    expect(newIdx).toEqual(
      explastFocusedFooterButtonIdx
    )
  })
  
  // SET_AVAILABLE_DRIVERS
  // availableDrivers
})
