import { combineReducers } from 'redux'
import { generateReducers } from 'redux-generate'

import { sliders, initId } from './slider-list'
import { viewSettings } from './view-settings'
import { undoRedo } from './undo-redo'

import { pages } from './pages'

export const PAGE_TYPES = {
  HOME_MODE: 'HOME_MODE',
  GLOBAL_MODE: 'GLOBAL_MODE',
  MIDI_DRIVER_MODE: 'MIDI_DRIVER_MODE',
  // VIEW_SETTINGS_MODE: 'VIEW_SETTINGS_MODE'
}

const initState = {
  columns: 18,
  rowHeight: 40,
  isAutoSize: false,
  marginX: 8,
  marginY: 8,
  paddingX: 8,
  paddingY: 8,
  isLiveMode: false,
  isSettingsDialogMode: false,
  isLayoutMode: false,
  isCompactHorz: false,
  isSettingsMode: false,
  isMidiLearnMode: false,
  isAutoArrangeMode: false,
  isChangedTheme: false,
  isFullscreenOnLivemode: false,
  pageType: PAGE_TYPES.HOME_MODE,
  availableDrivers: {
    inputs: {
      None: {
        ccChannels: [],
        noteChannels: []
      }
    },
    outputs: {
      None: {
        ccChannels: [],
        noteChannels: []
      }
    }
  },
  electronAppSettings: {
    isDevConsoleEnabled: true,
    isAllowedToUpdate: false,
    isAutoDownload: false,
    isAllowedPrerelease: false,
    isAllowedDowngrade: false,
    isWindowSizeLocked: true,
    windowCoords: [0, 0, 600, 800]
  }
}

export const pagesInit = {
  [initId]: {
    sliderList: [],
    id: initId,
    label: 'Page 1'
  }
}

const slidersInitState = {
  isMidiFailed: false,
  midi: null,
  sliderList: []
}

export const viewSettingsInitState = {
  ...initState,
  lastFocusedPage: initId,
  lastFocusedIdx: '',
  lastFocusedIdxs: [],
  pageTargets: [
    {
      colors: {
        color: '#123456',
        colorFont: '#dddddd'
      },
      id: initId,
      label: pagesInit[initId].label
    }
  ]
}

export default combineReducers({
  sliders: generateReducers(slidersInitState, sliders),
  viewSettings: generateReducers(viewSettingsInitState, viewSettings),
  pages: generateReducers(pagesInit, pages),
  undoRedo: generateReducers({}, undoRedo)
})
