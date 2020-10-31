import { viewSettingsInitState } from '../'

export const viewSettings = {
  togglePage(draftState, action) {
    draftState.pageType = action.payload.pageType || 'HOME'
    return draftState
  },

  toggleLiveMode(draftState, action) {
    let castedVal = !!draftState.isLiveMode
    if (action.payload && action.payload.isLiveMode !== undefined) {
      castedVal = action.payload.isLiveMode
    } else {
      castedVal = !castedVal
    }
    draftState.isLiveMode = castedVal
    draftState.isLayoutMode = false
    draftState.isSettingsMode = false
    draftState.isMidiLearnMode = false
    return draftState
  },
  toggleMidiLearnMode(state, action) {
    const castedVal = !!state.isMidiLearnMode
    const { isMidiLearnMode } = action.payload || {}
    return Object.assign({}, state, {
      isMidiLearnMode: isMidiLearnMode || !castedVal,
      isLayoutMode: false,
      isSettingsMode: false
    })
  },

  toggleLayoutMode(state, action) {
    const { isLayoutMode: isStateLayoutMode } = state || {}
    const { isLayoutMode } = action.payload || {}
    return Object.assign({}, state, {
      isLayoutMode: isLayoutMode || !isStateLayoutMode,
      isMidiLearnMode: false
    })
  },

  toggleCompactMode(state) {
    const castedVal = !!state.isCompactHorz
    return Object.assign({}, state, {
      isCompactHorz: !castedVal,
      isMidiLearnMode: false
    })
  },

  toggleSettingsMode(draftState, action) {
    const castedVal = !!draftState.isSettingsMode
    const { isSettingsMode } = action.payload || {}

    draftState.isSettingsMode = isSettingsMode || !castedVal
    draftState.isMidiLearnMode = false
    draftState.lastFocusedIdxs = []
    draftState.lastFocusedIdxs.length = 0
    return draftState
  },

  setFullscreeOnLiveMode(state, action) {
    const castedVal = !!state.isFullscreenOnLivemode
    const { isFullscreenOnLivemode } = action.payload || {}
    return Object.assign({}, state, {
      isFullscreenOnLivemode: isFullscreenOnLivemode || !castedVal
    })
  },

  toggleAutoArrangeMode(state) {
    const castedVal = !!state.isAutoArrangeMode
    return Object.assign({}, state, {
      isAutoArrangeMode: !castedVal,
      isMidiLearnMode: false
    })
  },

  changeTheme(state) {
    const castedVal = !!state.isChangedTheme
    return Object.assign({}, state, {
      isChangedTheme: !castedVal,
      isMidiLearnMode: false
    })
  },

  updateViewSettings(draftState, action) {
    const {
      viewSettings,
      viewSettings: { availableDrivers } = {}
    } = action.payload

    draftState = {
      ...draftState,
      ...viewSettings
    }
    if (availableDrivers) {
      draftState.availableDrivers = availableDrivers
    }

    return draftState
  },

  deletePageFromFooter(draftState, action) {
    const { i } = action.payload
    const pageTargets = draftState.pageTargets.filter((item) => item.id !== i)

    draftState.pageTargets = pageTargets
    return draftState
  },

  deleteFooterPages(draftState) {
    draftState.pageTargets = viewSettingsInitState.pageTargets
    draftState.footerPages = []
    draftState.lastFocusedIdxs = []
    draftState.lastFocusedPage = viewSettingsInitState.lastFocusedPage
    draftState.isLayoutMode = viewSettingsInitState.isLayoutMode
    return draftState
  },

  setLastFocusedIndex(draftState, action) {
    const { i = '' } = action.payload || {}
    const { isMultiSelectionMode } = draftState
    // Multiselection
    if (i !== 'none' && !i.startsWith('page') && isMultiSelectionMode) {
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
      draftState.lastFocusedIdxs = [i]
    }

    return draftState
  },
  toggleMultiSelectionMode(state, action) {
    state.isMultiSelectionMode = action.payload || !state.isMultiSelectionMode
  },
  swapFooterPages(state, action) {
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
    state.pageTargets = newArray
    // return Object.assign({}, state, {
    //   pageTargets: newArray
    // })
  },
  toggleSettingsDialogMode(draftState, action) {
    const { isSettingsDialogMode, i, lastFocusedPage } = action.payload
    draftState.isSettingsDialogMode = isSettingsDialogMode
    draftState.lastFocusedPage = lastFocusedPage
    draftState.lastFocusedIdx = i
    return draftState
    // return Object.assign({}, state, {
    //   isSettingsDialogMode
    // })
  },

  setAvailableDrivers(draftState, action) {
    const {
      availableDrivers: { inputs: oldIn, outputs: oldOut }
    } = draftState || viewSettingsInitState
    const { input, output } = action.payload

    let availableDrivers = { ...draftState.availableDrivers }
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

    draftState.availableDrivers = availableDrivers
    return draftState
  },

  setPageTargetSettings(draftState, action) {
    const { color, colorFont, label } = action.payload

    const idx = draftState.pageTargets.findIndex(
      (item) => item.id === draftState.lastFocusedPage
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
  },

  setRowHeight(state, action) {
    const { rowHeight } = action.payload
    return Object.assign({}, state, {
      rowHeight
    })
  },
  setColumns(state, action) {
    const { columns } = action.payload
    return Object.assign({}, state, {
      columns
    })
  },

  toggleAutosize(state) {
    const castedVal = !!state.isAutoSize
    return Object.assign({}, state, {
      isAutoSize: !castedVal
    })
  },
  setXMargin(state, action) {
    const { marginX } = action.payload
    return Object.assign({}, state, {
      marginX
    })
  },
  setYMargin(state, action) {
    const { marginY } = action.payload
    return Object.assign({}, state, {
      marginY
    })
  },
  setXPadding(state, action) {
    const { paddingX } = action.payload
    return Object.assign({}, state, {
      paddingX
    })
  },
  setYPadding(state, action) {
    const { paddingY } = action.payload
    return Object.assign({}, state, {
      paddingY
    })
  },

  setElectronAppSettings(draftState, action) {
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
          : draftState.electronAppSettings.isDevConsoleEnabled,
      isAllowedToUpdate:
        isAllowedToUpdate !== undefined
          ? isAllowedToUpdate
          : draftState.electronAppSettings.isAllowedToUpdate,
      isAutoDownload:
        isAutoDownload !== undefined
          ? isAutoDownload
          : draftState.electronAppSettings.isAutoDownload,
      isAllowedPrerelease:
        isAllowedPrerelease !== undefined
          ? isAllowedPrerelease
          : draftState.electronAppSettings.isAllowedPrerelease,
      isAllowedDowngrade:
        isAllowedDowngrade !== undefined
          ? isAllowedDowngrade
          : draftState.electronAppSettings.isAllowedDowngrade,
      isWindowSizeLocked:
        isWindowSizeLocked !== undefined
          ? isWindowSizeLocked
          : draftState.electronAppSettings.isWindowSizeLoisAllwedcked,
      windowCoords: Array.isArray(windowCoords)
        ? windowCoords
        : draftState.electronAppSettings.windowCoords
    }
    draftState.electronAppSettings = electronAppSettings
    return draftState
    //return { ...state, electronAppSettings }
  },
  setLastFocusedPage(draftState, action) {
    const {
      payload: { lastFocusedPage = '' }
    } = action

    draftState.lastFocusedPage = lastFocusedPage
    return draftState
  },

  addPageTarget(draftState, action) {
    const {
      payload: { pageTarget }
    } = action
    //let pageTargets = [...(state.pageTargets || []), pageTarget]

    //draftState.pageTargets = draftState.pageTargets || []
    draftState.pageTargets.push(pageTarget)
    draftState.lastFocusedPage = pageTarget.id
    draftState.lastFocusedIdxs = []
    return draftState
  },
  changeGlobalMidiInputDelay(draftState, action) {
    const {
      payload: { globalMidiInputDelay }
    } = action
    draftState.globalMidiInputDelay = globalMidiInputDelay
    return draftState
  },
  changeHistoryMaxLength(draftState, action) {
    const {
      payload: { historyMaxLength }
    } = action
    draftState.historyMaxLength = historyMaxLength
    return draftState
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
