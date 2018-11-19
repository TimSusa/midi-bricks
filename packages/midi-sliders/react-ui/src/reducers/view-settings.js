import createReducer from './createReducer'
import { ActionTypeViewSettings } from '../actions/view-settings'

export const viewSettings = createReducer({}, {

  [ActionTypeViewSettings.TOGGLE_GLOBAL_SETTINGS_MODE] (state = { isGlobalSettingsMode: false }, action) {
    const { isGlobalSettingsMode } = action.payload
    return Object.assign({}, state, {
      isGlobalSettingsMode, isLayoutMode: false, isSettingsMode: false, isLiveMode: false
    })
  },
  [ActionTypeViewSettings.TOGGLE_LIVE_MODE] (state = { isLiveMode: false }, action) {
    let castedVal = !!state.isLiveMode
    if (action.payload && action.payload.isLiveMode !== undefined) {
      castedVal = action.payload.isLiveMode
    } else {
      castedVal = !castedVal
    }
    return Object.assign({}, state, {
      isLiveMode: castedVal, isLayoutMode: false, isSettingsMode: false
    })
  },

  [ActionTypeViewSettings.TOGGLE_LAYOUT_MODE] (state = { isLayoutMode: false }, action) {
    const castedVal = !!state.isLayoutMode
    return Object.assign({}, state, {
      isLayoutMode: !castedVal
    })
  },

  [ActionTypeViewSettings.TOGGLE_COMPACT_MODE] (state = { isCompactHorz: true }, action) {
    const castedVal = !!state.isCompactHorz
    return Object.assign({}, state, {
      isCompactHorz: !castedVal
    })
  },

  [ActionTypeViewSettings.TOGGLE_SETTINGS_MODE] (state = { isSettingsMode: false }, action) {
    const castedVal = !!state.isSettingsMode
    return Object.assign({}, state, {
      isSettingsMode: !castedVal
    })
  },

  [ActionTypeViewSettings.TOGGLE_AUTO_ARRANGE_MODE] (state = { isAutoArrangeMode: false }, action) {
    const castedVal = !!state.isAutoArrangeMode
    return Object.assign({}, state, {
      isAutoArrangeMode: !castedVal
    })
  },

  [ActionTypeViewSettings.CHANGE_THEME] (state = { isChangedTheme: false }, action) {
    const castedVal = !!state.isChangedTheme
    return Object.assign({}, state, {
      isChangedTheme: !castedVal
    })
  },

  [ActionTypeViewSettings.ADD_PAGE_TO_FOOTER] (state = { footerPages: [] }, action) {
    const { sliderList } = action.payload

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
      extractedPages && extractedPages.forEach((newItem) => {
        if (!newItem) return
        if (oldItem.i !== newItem.i) {
          newItemToTake = newItem
        }
      })
    })
    const newPages = (oldPages && oldPages.length > 0) ? oldPages : extractedPages
    if (newItemToTake) {
      return Object.assign({}, state, {
        footerPages: [...newPages, newItemToTake]
      })
    } else {
      return Object.assign({}, state, {
        footerPages: newPages
      })
    }
  },

  [ActionTypeViewSettings.DELETE_PAGE_FROM_FOOTER] (state = { footerPages: [] }, action) {
    const { idx } = action.payload
    const footerPages = state.footerPages.filter(item => item.i !== idx)
    return Object.assign({}, state, {
      footerPages
    })
  },

  [ActionTypeViewSettings.DELETE_FOOTER_PAGES] (state = { footerPages: [] }, action) {
    return Object.assign({}, state, {
      footerPages: []
    })
  },

  [ActionTypeViewSettings.CHANGE_FOOTER_PAGE_LABEL] (state = { footerPages: [] }, action) {
    const { i, val } = action.payload

    const tmpArr = state.footerPages.map(item => {
      if (item.i === i) {
        return Object.assign({}, item, { label: val })
      }
      return Object.assign({}, item)
    })
    return Object.assign({}, state, {
      footerPages: tmpArr
    })
  },

  [ActionTypeViewSettings.SWAP_FOOTER_PAGES] (state = { footerPages: [] }, action) {
    const { srcIdx, offset } = action.payload
    const srcItem = state.footerPages[srcIdx]
    const newIdx = (srcIdx === 0 && offset === -1) ? (state.footerPages.length) : srcIdx
    const targetIdx = (newIdx === state.footerPages.length - 1 && offset === 1) ? 0 : offset + newIdx
    const otherItem = state.footerPages[targetIdx]

    let newArray = []
    state.footerPages.forEach((item, idx) => {
      if (idx === srcIdx) {
        newArray.push(otherItem)
      } else if (idx === targetIdx) {
        newArray.push(srcItem)
      } else {
        newArray.push(item)
      }
    })

    return Object.assign({}, state, {
      footerPages: newArray
    })
  },
  [ActionTypeViewSettings.TOGGLE_SETTINGS_DIALOG_MODE] (state = { isSettingsDialogMode: false }, action) {
    const { idx, isSettingsDialogMode } = action.payload

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
