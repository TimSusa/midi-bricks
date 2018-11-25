const createActions = require('./create-actions.js').createActions

const ActionTypeSliderList = {
  INIT_MIDI_ACCESS: 'INIT_MIDI_ACCESS',
  RESET_VALUES: 'RESET_VALUES',
  INIT_PENDING: 'INIT_PENDING',
  INIT_FAILED: 'INIT_FAILED',
  SELECT_SLIDER_MIDI_DRIVER: 'SELECT_SLIDER_MIDI_DRIVER',
  ADD_SLIDER: 'ADD_SLIDER',
  ADD_SLIDER_HORZ: 'ADD_SLIDER_HORZ',
  ADD_BUTTON: 'ADD_BUTTON',
  ADD_LABEL: 'ADD_LABEL',
  ADD_PAGE: 'ADD_PAGE',
  CHANGE_COLORS: 'CHANGE_COLORS',
  CHANGE_FONT_SIZE: 'CHANGE_FONT_SIZE',
  CHANGE_FONT_WEIGHT: 'CHANGE_FONT_WEIGHT',
  CHANGE_BUTTON_TYPE: 'CHANGE_BUTTON_TYPE',
  DELETE: 'DELETE',
  DELETE_ALL: 'DELETE_ALL',
  CLONE: 'CLONE',
  CHANGE_LABEL: 'CHANGE_LABEL',
  SELECT_CC: 'SELECT_CC',
  SELECT_MIDI_CHANNEL: 'SELECT_MIDI_CHANNEL',
  SELECT_MIDI_CHANNEL_INPUT: 'SELECT_MIDI_CHANNEL_INPUT',
  HANDLE_SLIDER_CHANGE: 'HANDLE_SLIDER_CHANGE',
  TOGGLE_NOTE: 'TOGGLE_NOTE',
  SEND_PROGRAM_CHANGE: 'SEND_PROGRAM_CHANGE',
  SET_MIN_VAL: 'SET_MIN_VAL',
  SET_MAX_VAL: 'SET_MAX_VAL',
  SET_ON_VAL: 'SET_ON_VAL',
  SET_OFF_VAL: 'SET_OFF_VAL',
  SAVE_FILE: 'SAVE_FILE',
  LOAD_FILE: 'LOAD_FILE',
  CHANGE_LIST_ORDER: 'CHANGE_LIST_ORDER',
  MIDI_MESSAGE_ARRIVED: 'MIDI_MESSAGE_ARRIVED',
  ADD_MIDI_CC_LISTENER: 'ADD_MIDI_CC_LISTENER',
  TOGGLE_HIDE_VALUE: 'TOGGLE_HIDE_VALUE'
}

module.exports = {
  ...createActions(ActionTypeSliderList),
  ActionTypeSliderList
}
