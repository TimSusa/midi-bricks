import createReducer from './createReducer'
import { ActionTypeViewSettings } from '../actions/view-settings'
import {difference} from 'lodash'

export const viewSettings = createReducer({}, {
  [ActionTypeViewSettings.TOGGLE_LIVE_MODE] (state = {isLiveMode: false}, action) {
    const castedVal = !!state.isLiveMode
    return Object.assign({}, state, {
      isLiveMode: !castedVal, isLayoutMode: false, isSettingsMode: false
    })
  },

  [ActionTypeViewSettings.TOGGLE_LAYOUT_MODE] (state = {isLayoutMode: false}, action) {
    const castedVal = !!state.isLayoutMode
    return Object.assign({}, state, {
      isLayoutMode: !castedVal
    })
  },

  [ActionTypeViewSettings.TOGGLE_COMPACT_MODE] (state = {isCompactHorz: true}, action) {
    const castedVal = !!state.isCompactHorz
    return Object.assign({}, state, {
      isCompactHorz: !castedVal
    })
  },

  [ActionTypeViewSettings.TOGGLE_SETTINGS_MODE] (state = {isSettingsMode: false}, action) {
    const castedVal = !!state.isSettingsMode
    return Object.assign({}, state, {
      isSettingsMode: !castedVal
    })
  },

  [ActionTypeViewSettings.TOGGLE_AUTO_ARRANGE_MODE] (state = {isAutoArrangeMode: false}, action) {
    const castedVal = !!state.isAutoArrangeMode
    return Object.assign({}, state, {
      isAutoArrangeMode: !castedVal
    })
  },

  [ActionTypeViewSettings.CHANGE_THEME] (state = {isChangedTheme: false}, action) {
    const castedVal = !!state.isChangedTheme
    return Object.assign({}, state, {
      isChangedTheme: !castedVal
    })
  },

  [ActionTypeViewSettings.ADD_PAGE_TO_FOOTER] (state = {footerPages: []}, action) {
    const {sliderList} = action.payload

    const extractPages = (list) => {
      let tmp = []
      list.forEach((item) => {
        if (item.type === 'PAGE') {
          tmp.push(item)
        }
      })
      return tmp
    }

    const extractedPages = extractPages(sliderList)
    const oldPages = state.footerPages && Object.values(state.footerPages)
    let newItemToTake = null

    oldPages && oldPages.forEach((oldItem) => {
      if (!oldItem) return
      console.log('oldPages')
      extractedPages && extractedPages.forEach((newItem) => {
        if (!newItem) return
        console.log('extractedPages')
        if (oldItem.i !== newItem.i) {
          newItemToTake = newItem
        }
      })
    })
    console.log('newItemToTake ', newItemToTake, 'oldPages ', oldPages, 'extractedPages', extractedPages)
    const newPages = oldPages || extractedPages
    return Object.assign({}, state, {
      footerPages: [...newPages, newItemToTake]
    })
  },
  [ActionTypeViewSettings.TOGGLE_SETTINGS_DIALOG_MODE] (state = {isSettingsDialogMode: false}, action) {
    const {idx, isSettingsDialogMode} = action.payload

    if (isSettingsDialogMode) {
      return Object.assign({}, state, {
        isSettingsDialogMode,
        lastFocusedIdx: idx
      })
    }

    return Object.assign({}, state, {
      isSettingsDialogMode: false,
      lastFocusedIdx: idx
    })
  }
})
