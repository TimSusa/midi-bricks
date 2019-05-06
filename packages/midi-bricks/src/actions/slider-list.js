import { generateActions, createActionTypes } from 'redux-generate'

const typeSliderList = [
  'INIT_MIDI_ACCESS',
  'RESET_VALUES',
  'INIT_PENDING',
  'INIT_FAILED',
  'SELECT_MIDI_DRIVER',
  'SELECT_MIDI_DRIVER_INPUT',
  'ADD_MIDI_ELEMENT',
  // 'ADD_SLIDER',
  // 'ADD_SLIDER_HORZ',
  // 'ADD_BUTTON',
  // 'ADD_LABEL',
  'ADD_PAGE',
  // 'ADD_XYPAD',
  'CHANGE_XYPAD_SETTINGS',
  'CHANGE_COLORS',
  'CHANGE_FONT_SIZE',
  'CHANGE_FONT_WEIGHT',
  'CHANGE_BUTTON_TYPE',
  'DELETE',
  'DELETE_ALL',
  'CLONE',
  'CHANGE_LABEL',
  'SELECT_CC',
  'SELECT_MIDI_CHANNEL',
  'SELECT_MIDI_CHANNEL_INPUT',
  'HANDLE_SLIDER_CHANGE',
  'SEND_MIDI_CC_Y',
  'TOGGLE_NOTE',
  'SEND_PROGRAM_CHANGE',
  'SET_MIN_VAL',
  'SET_MAX_VAL',
  'SET_ON_VAL',
  'SET_OFF_VAL',
  'SAVE_FILE',
  'LOAD_FILE',
  'CHANGE_LIST_ORDER',
  'MIDI_MESSAGE_ARRIVED',
  'ADD_MIDI_CC_LISTENER',
  'TOGGLE_HIDE_VALUE',
  'GO_BACK',
  'UPDATE_SLIDER_LIST_BACKUP',
  'TRIGGER_ALL_MIDI_ELEMENTS',
  'EXTRACT_PAGE',
  'SET_MIDI_PAGE'
]

export const ActionTypeSliderList = createActionTypes(typeSliderList)

export const Actions = { ...generateActions(ActionTypeSliderList) }
