import { combineReducers } from 'redux'
import { generateReducers } from 'redux-generate'
import { sliders } from './slider-list'
import { viewSettings } from './view-settings'
import { getUniqueId } from '../utils/get-unique-id'

export const PAGE_TYPES = {
  HOME_MODE: 'HOME_MODE',
  GLOBAL_MODE: 'GLOBAL_MODE',
  MIDI_DRIVER_MODE: 'MIDI_DRIVER_MODE',
  VIEW_SETTINGS_MODE: 'VIEW_SETTINGS_MODE'
}

const id = `page-${getUniqueId()}`

const initState = {
  columns: 18,
  rowHeight: 40,
  isAutoSize: false,
  marginX: 8,
  marginY: 8,
  paddingX: 8,
  paddingY: 8,
  // deprecated in favor of pageTargets
  footerPages: [],

  // deprecated in favor of lastFocusedPage
  lastFocusedFooterButtonIdx: '',
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
    isAllowedToUpdate: true,
    isAutoDownload: false,
    isAllowedPrerelease: false,
    isAllowedDowngrade: false,
    isWindowSizeLocked: true,
    windowCoords: [0, 0, 600, 800]
  }
}

const pages = {
  [id]: {
    sliderList: [],
    id,
    label: 'Page 1'
  }
}

const slidersInitState = {
  pages,
  sliderList: []
}

export const viewSettingsInitState = {
  ...initState,
  lastFocusedPage: id,
  pageTargets: [
    {
      colors: {
        color: '#123456',
        colorFont: '#dddddd'
      },
      id: id,
      label: pages[id].label
    }
  ]
}

export default combineReducers({
  sliders: generateReducers(slidersInitState, sliders),
  viewSettings: generateReducers(viewSettingsInitState, viewSettings)
})
