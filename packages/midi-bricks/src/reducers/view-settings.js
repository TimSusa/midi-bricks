import { ActionTypeViewSettings } from '../actions/view-settings'

import { viewSettingsInitState } from '.'
import { createNextState } from 'redux-starter-kit'

export const viewSettings = {
  [ActionTypeViewSettings.TOGGLE_PAGE](state, action) {
    const { pageType } = action.payload
    return Object.assign({}, state, {
      pageType
    })
  },

  [ActionTypeViewSettings.TOGGLE_LIVE_MODE](state, action) {
    let castedVal = !!state.isLiveMode
    if (action.payload && action.payload.isLiveMode !== undefined) {
      castedVal = action.payload.isLiveMode
    } else {
      castedVal = !castedVal
    }
    return Object.assign({}, state, {
      isLiveMode: castedVal,
      isLayoutMode: false,
      isSettingsMode: false,
      isMidiLearnMode: false
    })
  },

  [ActionTypeViewSettings.TOGGLE_MIDI_LEARN_MODE](state, action) {
    const castedVal = !!state.isMidiLearnMode
    const { isMidiLearnMode } = action.payload || {}
    return Object.assign({}, state, {
      isMidiLearnMode: isMidiLearnMode || !castedVal,
      isLayoutMode: false,
      isSettingsMode: false
    })
  },

  [ActionTypeViewSettings.TOGGLE_LAYOUT_MODE](state, action) {
    const { isLayoutMode: isStateLayoutMode } = state || {}
    const { isLayoutMode } = action.payload || {}
    return Object.assign({}, state, {
      isLayoutMode: isLayoutMode || !isStateLayoutMode,
      isMidiLearnMode: false
    })
  },

  [ActionTypeViewSettings.TOGGLE_COMPACT_MODE](state, action) {
    const castedVal = !!state.isCompactHorz
    return Object.assign({}, state, {
      isCompactHorz: !castedVal,
      isMidiLearnMode: false
    })
  },

  [ActionTypeViewSettings.TOGGLE_SETTINGS_MODE](state, action) {
    return createNextState(state, (draftState) => {
      const castedVal = !!state.isSettingsMode
      const { isSettingsMode } = action.payload || {}

      draftState.isSettingsMode = isSettingsMode || !castedVal
      draftState.isMidiLearnMode = false
      draftState.lastFocusedIdxs = []
      draftState.lastFocusedIdxs.length = 0
      return draftState
    })
  },

  [ActionTypeViewSettings.SET_FULLSCREEN_ON_LIVEMODE](state, action) {
    const castedVal = !!state.isFullscreenOnLivemode
    const { isFullscreenOnLivemode } = action.payload || {}
    return Object.assign({}, state, {
      isFullscreenOnLivemode: isFullscreenOnLivemode || !castedVal
    })
  },

  [ActionTypeViewSettings.TOGGLE_AUTO_ARRANGE_MODE](state, action) {
    const castedVal = !!state.isAutoArrangeMode
    return Object.assign({}, state, {
      isAutoArrangeMode: !castedVal,
      isMidiLearnMode: false
    })
  },

  [ActionTypeViewSettings.CHANGE_THEME](state, action) {
    const castedVal = !!state.isChangedTheme
    return Object.assign({}, state, {
      isChangedTheme: !castedVal,
      isMidiLearnMode: false
    })
  },

  [ActionTypeViewSettings.UPDATE_VIEW_SETTINGS](state, action) {
    console.warn('DEPRECATED UPDATE_VIEW_SETTINGS')
    const {
      viewSettings,
      viewSettings: { availableDrivers } = {}
    } = action.payload

    return createNextState(state, (draftState) => {
      draftState = {
        ...state,
        ...viewSettings
      }
      if (availableDrivers) {
        draftState.availableDrivers = availableDrivers
      }

      return draftState
    })
  },

  [ActionTypeViewSettings.DELETE_PAGE_FROM_FOOTER](state, action) {
    const { i } = action.payload
    const pageTargets = state.pageTargets.filter((item) => item.id !== i)

    return createNextState(state, (draftState) => {
      draftState.pageTargets = pageTargets
      return draftState
    })
  },

  [ActionTypeViewSettings.DELETE_FOOTER_PAGES](state, action) {
    return createNextState(state, (draftState) => {
      draftState.pageTargets = viewSettingsInitState.pageTargets
      draftState.footerPages = undefined
      draftState.lastFocusedIdxs = []
      draftState.lastFocusedIdx = null
      draftState.lastFocusedPage = viewSettingsInitState.lastFocusedPage
      draftState.isLayoutMode = viewSettingsInitState.isLayoutMode
      return draftState
    })
  },

  [ActionTypeViewSettings.SET_LAST_FOCUSED_INDEX](state, action) {
    return createNextState(state, (draftState) => {
      const { i = '' } = action.payload || {}

      // Multiselection
      if (i !== 'none' && !i.startsWith('page')) {
        draftState.lastFocusedIdx = i
        draftState.lastFocusedIdxs.push(i)
        // Remove duplicates
        draftState.lastFocusedIdxs = [...new Set(draftState.lastFocusedIdxs)]

        // clear all
      } else if (i === 'none') {
        draftState.lastFocusedIdxs = []
        draftState.lastFocusedIdxs.length = 0
        draftState.lastFocusedIdx = i
      } else {
        draftState.lastFocusedIdx = i
        draftState.lastFocusedIdxs = []
      }

      return draftState
    })
  },

  [ActionTypeViewSettings.SWAP_FOOTER_PAGES](state, action) {
    const { srcIdx: srcI, offset } = action.payload
    const srcItem = state.pageTargets.find((item) => item.id === srcI)
    const srcIdx = state.pageTargets.findIndex((item) => item.id === srcI)
    const newIdx =
      srcIdx === 0 && offset === -1 ? state.pageTargets.length : srcIdx
    const targetIdx =
      newIdx === state.pageTargets.length - 1 && offset === 1
        ? 0
        : offset + newIdx
    const otherItem = state.pageTargets[targetIdx]

    let newArray = []
    state.pageTargets.forEach((item, idx) => {
      if (idx === srcIdx) {
        newArray.push(otherItem)
      } else if (idx === targetIdx) {
        newArray.push(srcItem)
      } else {
        newArray.push(item)
      }
    })

    return Object.assign({}, state, {
      pageTargets: newArray
    })
  },
  [ActionTypeViewSettings.TOGGLE_SETTINGS_DIALOG_MODE](state, action) {
    const { isSettingsDialogMode, i, lastFocusedPage } = action.payload
    return createNextState(state, (draftState) => {
      draftState.isSettingsDialogMode = isSettingsDialogMode
      draftState.lastFocusedPage = lastFocusedPage
      draftState.lastFocusedIdx = i
      return draftState
    })
    // return Object.assign({}, state, {
    //   isSettingsDialogMode
    // })
  },

  [ActionTypeViewSettings.SET_AVAILABLE_DRIVERS](state, action) {
    const {
      availableDrivers: { inputs: oldIn, outputs: oldOut }
    } = state || viewSettingsInitState
    const { input, output } = action.payload

    let availableDrivers = { ...state.availableDrivers }
    if (input) {
      const { name, noteChannel, ccChannel, isChecked } = input
      const {
        noteChannels: oldNoteChannels,
        ccChannels: oldCcChannels
      } = oldIn[name] || { noteChannels: [], ccChannels: [] }
      let inputs = getChannels(
        noteChannel,
        ccChannel,
        isChecked,
        oldCcChannels,
        oldNoteChannels,
        oldIn,
        name
      )

      availableDrivers = {
        ...availableDrivers,
        inputs
      }
    }

    if (output) {
      const { name, noteChannel, ccChannel, isChecked } = output
      const {
        noteChannels: oldNoteChannels,
        ccChannels: oldCcChannels
      } = oldOut[name] || { noteChannels: [], ccChannels: [] }
      let outputs = getChannels(
        noteChannel,
        ccChannel,
        isChecked,
        oldCcChannels,
        oldNoteChannels,
        oldOut,
        name
      )

      availableDrivers = {
        ...availableDrivers,
        outputs
      }
    }

    return createNextState(state, (draftState) => {
      draftState.availableDrivers = availableDrivers
      return draftState
    })
  },

  [ActionTypeViewSettings.SET_PAGE_TARGET_SETTINGS](state, action) {
    const { color, colorFont, label } = action.payload

    return createNextState(state, (draftState) => {
      const idx = state.pageTargets.findIndex(
        (item) => item.id === state.lastFocusedPage
      )
      if (idx < 0) return draftState
      if (color) {
        draftState.pageTargets[idx].colors.color = color
      }
      if (colorFont) {
        draftState.pageTargets[idx].colors.colorFont = colorFont
      }
      if (label) {
        draftState.pageTargets[idx].label = label
      }
      return draftState
    })
  },

  [ActionTypeViewSettings.SET_ROW_HEIGHT](state, action) {
    const { rowHeight } = action.payload
    return Object.assign({}, state, {
      rowHeight
    })
  },
  [ActionTypeViewSettings.SET_COLUMNS](state, action) {
    const { columns } = action.payload
    return Object.assign({}, state, {
      columns
    })
  },

  [ActionTypeViewSettings.TOGGLE_AUTOSIZE](state, action) {
    const castedVal = !!state.isAutoSize
    return Object.assign({}, state, {
      isAutoSize: !castedVal
    })
  },
  [ActionTypeViewSettings.SET_X_MARGIN](state, action) {
    const { marginX } = action.payload
    return Object.assign({}, state, {
      marginX
    })
  },
  [ActionTypeViewSettings.SET_Y_MARGIN](state, action) {
    const { marginY } = action.payload
    return Object.assign({}, state, {
      marginY
    })
  },
  [ActionTypeViewSettings.SET_X_PADDING](state, action) {
    const { paddingX } = action.payload
    return Object.assign({}, state, {
      paddingX
    })
  },
  [ActionTypeViewSettings.SET_Y_PADDING](state, action) {
    const { paddingY } = action.payload
    return Object.assign({}, state, {
      paddingY
    })
  },

  [ActionTypeViewSettings.SET_ELECTRON_APP_SETTINGS](state, action) {
    const {
      isDevConsoleEnabled,
      isAllowedToUpdate,
      isAutoDownload,
      isAllowedPrerelease,
      isAllowedDowngrade,
      isWindowSizeLocked,
      windowCoords
    } = action.payload
    const electronAppSettings = {
      isDevConsoleEnabled:
        isDevConsoleEnabled !== undefined
          ? isDevConsoleEnabled
          : state.electronAppSettings.isDevConsoleEnabled,
      isAllowedToUpdate:
        isAllowedToUpdate !== undefined
          ? isAllowedToUpdate
          : state.electronAppSettings.isAllowedToUpdate,
      isAutoDownload:
        isAutoDownload !== undefined
          ? isAutoDownload
          : state.electronAppSettings.isAutoDownload,
      isAllowedPrerelease:
        isAllowedPrerelease !== undefined
          ? isAllowedPrerelease
          : state.electronAppSettings.isAllowedPrerelease,
      isAllowedDowngrade:
        isAllowedDowngrade !== undefined
          ? isAllowedDowngrade
          : state.electronAppSettings.isAllowedDowngrade,
      isWindowSizeLocked:
        isWindowSizeLocked !== undefined
          ? isWindowSizeLocked
          : state.electronAppSettings.isWindowSizeLoisAllwedcked,
      windowCoords: Array.isArray(windowCoords)
        ? windowCoords
        : state.electronAppSettings.windowCoords
    }
    return createNextState(state, (draftState) => {
      draftState.electronAppSettings = electronAppSettings
      return draftState
    })
    //return { ...state, electronAppSettings }
  },
  [ActionTypeViewSettings.SET_LAST_FOCUSED_PAGE](state, action) {
    return createNextState(state, (draftState) => {
      const {
        payload: { lastFocusedPage = '' }
      } = action

      draftState.lastFocusedPage = lastFocusedPage
      return draftState
    })
  },

  [ActionTypeViewSettings.ADD_PAGE_TARGET](state, action) {
    return createNextState(state, (draftState) => {
      const {
        payload: { pageTarget }
      } = action
      //let pageTargets = [...(state.pageTargets || []), pageTarget]

      draftState.pageTargets = state.pageTargets || []
      draftState.pageTargets.push(pageTarget)
      draftState.lastFocusedPage = pageTarget.id
      draftState.lastFocusedIdxs = []
      return draftState
    })
  }
}

const chDummy = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16'
]

function hasAll(arr = []) {
  return arr.length === chDummy.length
}

// function extractPages(list = []) {
//   let tmp = []
//   list.forEach((item) => {
//     if (item.type === 'PAGE') {
//       tmp.push(item)
//     }
//   })
//   if (tmp.length === 0) {
//     console.warn('list was empty!')
//   }
//   return tmp
// }

function getObjFromNoteChannels(obj, name, noteChannels) {
  return {
    ...obj,
    [name]: {
      ...obj[name],
      noteChannels
    }
  }
}
function getObjFromCcChannels(obj, name, ccChannels) {
  return {
    ...obj,
    [name]: {
      ...obj[name],
      ccChannels
    }
  }
}

function getChannels(
  noteChannel,
  ccChannel,
  isChecked,
  oldCcChannels = [],
  oldNoteChannels = [],
  old,
  name
) {
  let channels
  let noteChannels = null
  let ccChannels = null
  if (isChecked) {
    if (noteChannel) {
      noteChannels =
        noteChannel === 'all'
          ? chDummy
          : !oldNoteChannels.includes(noteChannel)
            ? [...oldNoteChannels, noteChannel]
            : oldNoteChannels
      channels = getObjFromNoteChannels(old, name, noteChannels)
    }
    if (ccChannel) {
      ccChannels =
        ccChannel === 'all'
          ? chDummy
          : !oldCcChannels.includes(ccChannel)
            ? [...oldCcChannels, ccChannel]
            : oldCcChannels
      channels = getObjFromCcChannels(old, name, ccChannels)
    }
  } else {
    if (noteChannel) {
      noteChannels = hasAll(oldNoteChannels)
        ? []
        : oldNoteChannels.filter((item) => item !== noteChannel)
      channels = getObjFromNoteChannels(old, name, noteChannels)
    }
    if (ccChannel) {
      ccChannels = hasAll(oldCcChannels)
        ? []
        : oldCcChannels.filter((item) => item !== ccChannel)
      channels = getObjFromCcChannels(old, name, ccChannels)
    }
  }
  return channels
}
