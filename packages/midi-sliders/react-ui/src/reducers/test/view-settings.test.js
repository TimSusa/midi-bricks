import { reducers } from '../view-settings'
import { mockStore } from './mock-store'

describe('Test Reducers for slider-list', () => {
  test('TOGGLE_PAGE', () => {
    const expected = 'HOME'
    const { TOGGLE_PAGE } = reducers
    const state = TOGGLE_PAGE(mockStore.viewSettings, { payload: { pageType: expected } })
    expect(state.pageType).toBe(expected)
  })

  test('TOGGLE_LIVE_MODE with payload', () => {
    const val = mockStore.viewSettings.isLiveMode
    const expected = !val
    const { TOGGLE_LIVE_MODE } = reducers
    const { isLiveMode } = TOGGLE_LIVE_MODE(mockStore.viewSettings, {
      payload: { isLiveMode: true },
    })
    expect(isLiveMode).toBe(expected)
  })

  test('TOGGLE_LIVE_MODE without payload', () => {
    const val = mockStore.viewSettings.isLiveMode
    const expected = !val
    const { TOGGLE_LIVE_MODE } = reducers
    const {isLiveMode} = TOGGLE_LIVE_MODE(mockStore.viewSettings, { payload: {} })
    expect(isLiveMode).toBe(expected)
  })

  test('TOGGLE_COMPACT_MODE without payload', () => {
    const val = mockStore.viewSettings.isCompactHorz
    const expected = !val
    const { TOGGLE_COMPACT_MODE } = reducers
    const {isCompactHorz} = TOGGLE_COMPACT_MODE(mockStore.viewSettings, { payload: {} })
    expect(isCompactHorz).toBe(expected)
  })

  test('TOGGLE_SETTINGS_MODE without payload', () => {
    const val = mockStore.viewSettings.isSettingsMode
    const expected = !val
    const { TOGGLE_SETTINGS_MODE } = reducers
    const {isSettingsMode} = TOGGLE_SETTINGS_MODE(mockStore.viewSettings, { payload: {} })
    expect(isSettingsMode).toBe(expected)
  })


  test('TOGGLE_AUTO_ARRANGE_MODE without payload', () => {
    const val = mockStore.viewSettings.isAutoArrangeMode
    const expected = !val
    const { TOGGLE_AUTO_ARRANGE_MODE } = reducers
    const {isAutoArrangeMode} = TOGGLE_AUTO_ARRANGE_MODE(mockStore.viewSettings, { payload: {} })
    expect(isAutoArrangeMode).toBe(expected)
  })

  test('CHANGE_THEME without payload', () => {
    const val = mockStore.viewSettings.isChangedTheme
    const expected = !val
    const { CHANGE_THEME } = reducers
    const {isChangedTheme} = CHANGE_THEME(mockStore.viewSettings, { payload: {} })
    expect(isChangedTheme).toBe(expected)
  })

  // TODO: test for   // lastFocusedIdx
  test('TOGGLE_SETTINGS_DIALOG_MODE without payload', () => {
    const val = mockStore.viewSettings.isSettingsDialogMode
    const expected = !val
    const { TOGGLE_SETTINGS_DIALOG_MODE } = reducers
    const {isSettingsDialogMode} = TOGGLE_SETTINGS_DIALOG_MODE(mockStore.viewSettings, { payload: {} })
    expect(isSettingsDialogMode).toBe(expected)
  })


  // UPDATE_VIEW_SETTINGS
  // footerPages

  // DELETE_PAGE_FROM_FOOTER
  // footerPages

  // DELETE_FOOTER_PAGES

  // CHANGE_FOOTER_PAGE

  // SET_FOOTER_BUTTON_FOCUS
  // lastFocusedFooterButtonIdx

  // SWAP_FOOTER_PAGES

  // SET_AVAILABLE_DRIVERS
  // availableDrivers
})
