import createReducer from './createReducer'
import { ActionTypeViewSettings } from '../actions/view-settings'

export const PAGE_TYPES = {
  HOME_MODE: 'HOME_MODE',
  GLOBAL_MODE: 'GLOBAL_MODE',
  MIDI_DRIVER_MODE: 'MIDI_DRIVER_MODE'
}

const initState = {
  footerPages: [],
  isLiveMode: false,
  isSettingsDialogMode: false,
  isLayoutMode: false,
  isCompactHorz: true,
  isSettingsMode: false,
  isAutoArrangeMode: false,
  isChangedTheme: false,
  pageType: PAGE_TYPES.HOME_MODE,
  availableDrivers: {
    inputs: {},
    outputs: {}
  }
}
export const viewSettings = createReducer(initState, {

  [ActionTypeViewSettings.TOGGLE_PAGE] (state = initState, action) {
    const { pageType } = action.payload
    return Object.assign({}, state, {
      pageType
    })
  },

  [ActionTypeViewSettings.TOGGLE_LIVE_MODE] (state = initState, action) {
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

  [ActionTypeViewSettings.TOGGLE_LAYOUT_MODE] (state = initState, action) {
    const castedVal = !!state.isLayoutMode
    return Object.assign({}, state, {
      isLayoutMode: !castedVal
    })
  },

  [ActionTypeViewSettings.TOGGLE_COMPACT_MODE] (state = initState, action) {
    const castedVal = !!state.isCompactHorz
    return Object.assign({}, state, {
      isCompactHorz: !castedVal
    })
  },

  [ActionTypeViewSettings.TOGGLE_SETTINGS_MODE] (state = initState, action) {
    const castedVal = !!state.isSettingsMode
    return Object.assign({}, state, {
      isSettingsMode: !castedVal
    })
  },

  [ActionTypeViewSettings.TOGGLE_AUTO_ARRANGE_MODE] (state = initState, action) {
    const castedVal = !!state.isAutoArrangeMode
    return Object.assign({}, state, {
      isAutoArrangeMode: !castedVal
    })
  },

  [ActionTypeViewSettings.CHANGE_THEME] (state = initState, action) {
    const castedVal = !!state.isChangedTheme
    return Object.assign({}, state, {
      isChangedTheme: !castedVal
    })
  },

  [ActionTypeViewSettings.ADD_PAGE_TO_FOOTER] (state = initState, action) {
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

  [ActionTypeViewSettings.DELETE_PAGE_FROM_FOOTER] (state = initState, action) {
    const { idx } = action.payload
    const footerPages = state.footerPages.filter(item => item.i !== idx)
    return Object.assign({}, state, {
      footerPages
    })
  },

  [ActionTypeViewSettings.DELETE_FOOTER_PAGES] (state = initState, action) {
    return Object.assign({}, state, {
      footerPages: []
    })
  },

  [ActionTypeViewSettings.CHANGE_FOOTER_PAGE_LABEL] (state = initState, action) {
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

  [ActionTypeViewSettings.SWAP_FOOTER_PAGES] (state = initState, action) {
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
  [ActionTypeViewSettings.TOGGLE_SETTINGS_DIALOG_MODE] (state = initState, action) {
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
  },

  [ActionTypeViewSettings.SET_AVAILABLE_DRIVERS] (state = initState, action) {
    const { availableDrivers: { inputs: oldIn, outputs: oldOut } } = state
    const { input, output } = action.payload

    let availableDrivers = { ...state.availableDrivers }
    if (input) {
      const { name, noteChannel, ccChannel, isChecked } = input
      const { noteChannels: oldNoteChannels, ccChannels: oldCcChannels } = oldIn[name] || { noteChannels: [], ccChannels: [] }
      let inputs = getChannels(noteChannel, ccChannel, isChecked, oldCcChannels, oldNoteChannels, oldIn, name)

      availableDrivers = {
        ...availableDrivers,
        inputs
      }
    }

    if (output) {
      const { name, noteChannel, ccChannel, isChecked } = output
      const { noteChannels: oldNoteChannels, ccChannels: oldCcChannels } = oldOut[name] || { noteChannels: [], ccChannels: [] }
      let outputs = getChannels(noteChannel, ccChannel, isChecked, oldCcChannels, oldNoteChannels, oldOut, name)

      availableDrivers = {
        ...availableDrivers,
        outputs
      }
    }

    return {
      ...state,
      availableDrivers
    }
  }
})

const chDummy = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']
const hasAll = arr => arr.length === chDummy.length
function getObjFromNoteChannels (obj, name, noteChannels) {
  return {
    ...obj,
    [name]: {
      ...obj[name],
      noteChannels
    }
  }
}
function getObjFromCcChannels (obj, name, ccChannels) {
  return {
    ...obj,
    [name]: {
      ...obj[name],
      ccChannels
    }
  }
}

function getChannels (noteChannel, ccChannel, isChecked, oldCcChannels = [], oldNoteChannels = [], old, name) {
  let channels
  let noteChannels = null
  let ccChannels = null
  if (isChecked) {
    if (noteChannel) {
      noteChannels = (noteChannel === 'all' ? chDummy : !oldNoteChannels.includes(noteChannel) ? [...oldNoteChannels, noteChannel] : oldNoteChannels)
      channels = getObjFromNoteChannels(old, name, noteChannels)
    }
    if (ccChannel) {
      ccChannels = (ccChannel === 'all' ? chDummy : !oldCcChannels.includes(ccChannel) ? [...oldCcChannels, ccChannel] : oldCcChannels)
      channels = getObjFromCcChannels(old, name, ccChannels)
    }
  } else {
    if (noteChannel) {
      noteChannels = (hasAll(oldNoteChannels) ? [] : oldNoteChannels.filter(item => item !== noteChannel))
      channels = getObjFromNoteChannels(old, name, noteChannels)
    }
    if (ccChannel) {
      ccChannels = (hasAll(oldCcChannels) ? [] : oldCcChannels.filter(item => item !== ccChannel))
      channels = getObjFromCcChannels(old, name, ccChannels)
    }
  }
  return channels
}
