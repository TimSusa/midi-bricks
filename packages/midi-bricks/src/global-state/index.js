import { combineReducers } from 'redux'
import { createSlice } from '@reduxjs/toolkit'
import { sliders, initId } from './reducers/slider-list'
import { viewSettings } from './reducers/view-settings'
import { pages } from './reducers/pages'

//
// PAGES
//
export const pagesInit = {
  [initId]: {
    sliderList: [],
    id: initId,
    label: 'Page 1'
  }
}

const { reducer: reducerPagess, actions: actionsPagess } = createSlice({
  name: 'pages',
  initialState: pagesInit,
  reducers: pages
})

export const actionsPages = actionsPagess
export const reducerPages = reducerPagess

//
// ViewSettings
//
export const PAGE_TYPES = {
  HOME_MODE: 'HOME_MODE',
  GLOBAL_MODE: 'GLOBAL_MODE',
  MIDI_DRIVER_MODE: 'MIDI_DRIVER_MODE'
  // VIEW_SETTINGS_MODE: 'VIEW_SETTINGS_MODE'
}

export const viewSettingsInitState = {
  columns: 18,
  rowHeight: 40,
  isAutoSize: false,
  marginX: 8,
  marginY: 8,
  paddingX: 8,
  paddingY: 8,
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
  },
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
  lastFocusedPage: initId,
  lastFocusedIdx: '',
  lastFocusedIdxs: [],
  globalMidiInputDelay: 15,
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
const {
  reducer: reducerViewSettingss,
  actions: actionsViewSettingss
} = createSlice({
  name: 'viewSettings',
  initialState: viewSettingsInitState,
  reducers: viewSettings
})

export const actionsViewSettings = actionsViewSettingss
export const reducerViewSettings = reducerViewSettingss

//
// SLIDERS
//
const slidersInitState = {
  isMidiFailed: false,
  midi: null,
  sliderList: []
}
const { reducer: reducerSliderss, actions: actionsSliderss } = createSlice({
  name: 'sliders',
  initialState: slidersInitState,
  reducers: sliders
})

export const actionsSliders = actionsSliderss
export const reducerSliders = reducerSliderss

export const reducer = combineReducers({
  sliders: reducerSliders,
  viewSettings: reducerViewSettings,
  pages: reducerPages
})
