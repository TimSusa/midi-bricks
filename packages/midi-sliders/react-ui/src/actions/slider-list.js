
export const ActionTypeSliderList = {
  INIT_MIDI_ACCESS: 'INIT_MIDI_ACCESS',
  SELECT_SLIDER_MIDI_DRIVER: 'SELECT_SLIDER_MIDI_DRIVER',
  ADD_SLIDER: 'ADD_SLIDER',
  ADD_BUTTON: 'ADD_BUTTON',
  CHANGE_BUTTON_TYPE: 'CHANGE_BUTTON_TYPE',
  DELETE_SLIDER: 'DELETE_SLIDER',
  DELETE_ALL_SLIDERS: 'DELETE_ALL_SLIDERS',
  TOGGLE_NOTE: 'TOGGLE_NOTE',
  CHANGE_SLIDER_LABEL: 'CHANGE_SLIDER_LABEL',
  SELECT_CC: 'SELECT_CC',
  SELECT_MIDI_CHANNEL: 'SELECT_MIDI_CHANNEL',
  HANDLE_SLIDER_CHANGE: 'HANDLE_SLIDER_CHANGE',
  SAVE_FILE: 'SAVE_FILE',
  LOAD_FILE: 'LOAD_FILE',
  CHANGE_LIST_ORDER: 'CHANGE_LIST_ORDER'
}

export function initMidiAccess (midiAccess) {
  return {
    type: ActionTypeSliderList.INIT_MIDI_ACCESS,
    payload: midiAccess
  }
}

export function selectSliderMidiDriver (payload) {
  return {
    type: ActionTypeSliderList.SELECT_SLIDER_MIDI_DRIVER,
    payload
  }
}

export function addSlider (item) {
  return {
    type: ActionTypeSliderList.ADD_SLIDER,
    payload: item
  }
}

export function addButton (item) {
  return {
    type: ActionTypeSliderList.ADD_BUTTON,
    payload: item
  }
}

export function changeButtonType (payload) {
  return {
    type: ActionTypeSliderList.CHANGE_BUTTON_TYPE,
    payload
  }
}

export function deleteSlider (idx) {
  return {
    type: ActionTypeSliderList.DELETE_SLIDER,
    payload: idx
  }
}

export function deleteAllSliders () {
  return {
    type: ActionTypeSliderList.DELETE_ALL_SLIDERS
  }
}

export function toggleNote (idx) {
  return {
    type: ActionTypeSliderList.TOGGLE_NOTE,
    payload: idx
  }
}

export function changeSliderLabel (payload) {
  return {
    type: ActionTypeSliderList.CHANGE_SLIDER_LABEL,
    payload
  }
}

export function selectCC (payload) {
  return {
    type: ActionTypeSliderList.SELECT_CC,
    payload
  }
}

export function selectMidiChannel (payload) {
  return {
    type: ActionTypeSliderList.SELECT_MIDI_CHANNEL,
    payload
  }
}

export function handleSliderChange (payload) {
  return {
    type: ActionTypeSliderList.HANDLE_SLIDER_CHANGE,
    payload
  }
}

export function saveFile () {
  return {
    type: ActionTypeSliderList.SAVE_FILE
  }
}

export function loadFile (results) {
  return {
    type: ActionTypeSliderList.LOAD_FILE,
    payload: results
  }
}

export function changeListOrder (payload) {
  return {
    type: ActionTypeSliderList.CHANGE_LIST_ORDER,
    payload
  }
}
