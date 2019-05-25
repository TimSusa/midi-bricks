import { ActionTypeViewSettings } from '../actions/view-settings'

import { viewSettingsInitState } from '.'

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
    const castedVal = !!state.isSettingsMode
    const { isSettingsMode } = action.payload || {}
    return Object.assign({}, state, {
      isSettingsMode: isSettingsMode || !castedVal,
      isMidiLearnMode: false
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
      // sliderList,
      viewSettings,
      viewSettings: { availableDrivers } = {},
      version
    } = action.payload

    const extractedPages = null //extractPages(sliderList)
    const oldPages = state.footerPages && Object.values(state.footerPages)
    let newItemToTake = null

    oldPages &&
      oldPages.forEach((oldItem) => {
        if (!oldItem) return
        extractedPages &&
          extractedPages.forEach((newItem) => {
            if (!newItem) return
            if (oldItem.i !== newItem.i) {
              newItemToTake = newItem
            }
          })
      })
    const newPages = oldPages && oldPages.length > 0 ? oldPages : extractedPages
    let footerState = null
    if (newItemToTake) {
      footerState = Object.assign({}, state, viewSettings, {
        footerPages: [...newPages, newItemToTake]
      })
    } else {
      footerState = Object.assign({}, state, viewSettings, {
        footerPages: newPages
      })
    }
    if (availableDrivers) {
      return { ...footerState, availableDrivers, version }
    } else {
      return { ...footerState, version }
    }
  },

  [ActionTypeViewSettings.DELETE_PAGE_FROM_FOOTER](state, action) {
    const { i } = action.payload
    const footerPages = state.footerPages.filter((item) => item.i !== i)
    return Object.assign({}, state, {
      footerPages
    })
  },

  [ActionTypeViewSettings.DELETE_FOOTER_PAGES](state, action) {
    return Object.assign(
      {},
      state,
      {
        footerPages: [],
        pageTargets: []
      },
      viewSettingsInitState
    )
  },

  // [ActionTypeViewSettings.CHANGE_FOOTER_PAGE](state , action) {
  //   const { i, label, colorFont, color } = action.payload

  //   const tmpArr = state.footerPages.map((item) => {
  //     if (label) {
  //       if (item.i === i) {
  //         return Object.assign({}, item, { label })
  //       }
  //     }
  //     if (color) {
  //       if (item.i === i) {
  //         return Object.assign({}, item, { colors: { ...item.colors, color } })
  //       }
  //     }
  //     if (colorFont) {
  //       if (item.i === i) {
  //         return Object.assign({}, item, {
  //           colors: { ...item.colors, colorFont }
  //         })
  //       }
  //     }
  //     return Object.assign({}, item)
  //   })

  //   return Object.assign({}, state, {
  //     footerPages: tmpArr
  //   })
  // },

  [ActionTypeViewSettings.SET_FOOTER_BUTTON_FOCUS](state, action) {
    const { i } = action.payload
    return Object.assign({}, state, {
      lastFocusedFooterButtonIdx: i
    })
  },

  [ActionTypeViewSettings.SET_LAST_FOCUSED_INDEX](state, action) {
    const { i } = action.payload
    return Object.assign({}, state, {
      lastFocusedIdx: i
    })
  },

  [ActionTypeViewSettings.SWAP_FOOTER_PAGES](state, action) {
    const { srcIdx, offset } = action.payload
    const srcItem = state.footerPages[srcIdx]
    const newIdx =
      srcIdx === 0 && offset === -1 ? state.footerPages.length : srcIdx
    const targetIdx =
      newIdx === state.footerPages.length - 1 && offset === 1
        ? 0
        : offset + newIdx
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
  [ActionTypeViewSettings.TOGGLE_SETTINGS_DIALOG_MODE](state, action) {
    const { isSettingsDialogMode = false } = action.payload

    return Object.assign({}, state, {
      isSettingsDialogMode
    })
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

    return {
      ...state,
      availableDrivers
    }
  },

  [ActionTypeViewSettings.SET_PAGE_TARGET_SETTINGS](state, action) {
    const { color, colorFont, label } = action.payload
    let newPageTargets = state.pageTargets
    const idx = newPageTargets.findIndex(
      (item) => item.id === state.lastFocusedPage
    )
    if (color) {
      newPageTargets[idx] = {
        ...newPageTargets[idx],
        colors: {
          ...newPageTargets[idx].colors,
          color
        }
      }
    }
    if (colorFont) {
      newPageTargets[idx] = {
        ...newPageTargets[idx],
        colors: {
          ...newPageTargets[idx].colors,
          colorFont
        }
      }
    }
    if (label) {
      newPageTargets[idx] = {
        ...newPageTargets[idx],
        label
      }
    }
    return { ...state, pageTargets: newPageTargets }
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
    return { ...state, electronAppSettings }
  },
  [ActionTypeViewSettings.SET_LAST_FOCUSED_PAGE](state, action) {
    const {
      payload: { lastFocusedPage }
    } = action
    return { ...state, lastFocusedPage }
  },

  [ActionTypeViewSettings.ADD_PAGE_TARGET](state, action) {
    const {
      payload: { pageTarget }
    } = action
    let pageTargets = [...(state.pageTargets || []), pageTarget]
    return { ...state, pageTargets }
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
