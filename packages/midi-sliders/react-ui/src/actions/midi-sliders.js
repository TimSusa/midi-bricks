
export const ActionTypeSlider = {
  INIT_MIDI_ACCESS: 'INIT_MIDI_ACCESS',
  SELECT_SLIDER_MIDI_DRIVER: 'SELECT_SLIDER_MIDI_DRIVER',
  ADD_SLIDER: 'ADD_SLIDER',
  ADD_BUTTON: 'ADD_BUTTON',
  DELETE_SLIDER: 'DELETE_SLIDER',
  DELETE_ALL_SLIDERS: 'DELETE_ALL_SLIDERS',
  TOGGLE_NOTE: 'TOGGLE_NOTE',
  TRIGGER_NOTE: 'TRIGGER_NOTE',
  CHANGE_SLIDER_LABEL: 'CHANGE_SLIDER_LABEL',
  EXPAND_SLIDER: 'EXPAND_SLIDER',
  EXPAND_SLIDERS: 'EXPAND_SLIDERS',
  COLLAPSE_SLIDERS: 'COLLAPSE_SLIDERS',
  SELECT_CC: 'SELECT_CC',
  SELECT_MIDI_CHANNEL: 'SELECT_MIDI_CHANNEL',
  HANDLE_SLIDER_CHANGE: 'HANDLE_SLIDER_CHANGE',
  SAVE_FILE: 'SAVE_FILE',
  LOAD_FILE: 'LOAD_FILE'
}

export function initMidiAccess (midiAccess) {
  return {
    type: ActionTypeSlider.INIT_MIDI_ACCESS,
    payload: midiAccess
  }
}

export function selectSliderMidiDriver (payload) {
  return {
    type: ActionTypeSlider.SELECT_SLIDER_MIDI_DRIVER,
    payload
  }
}

export function addSlider (item) {
  return {
    type: ActionTypeSlider.ADD_SLIDER,
    payload: item
  }
}

export function addButton (item) {
  return {
    type: ActionTypeSlider.ADD_BUTTON,
    payload: item
  }
}

export function deleteSlider (idx) {
  return {
    type: ActionTypeSlider.DELETE_SLIDER,
    payload: idx
  }
}

export function deleteAllSliders () {
  return {
    type: ActionTypeSlider.DELETE_ALL_SLIDERS
  }
}

export function toggleNote (idx) {
  return {
    type: ActionTypeSlider.TOGGLE_NOTE,
    payload: idx
  }
}

export function triggerNote (idx) {
  return {
    type: ActionTypeSlider.TRIGGER_NOTE,
    payload: idx
  }
}

export function changeSliderLabel (payload) {
  return {
    type: ActionTypeSlider.CHANGE_SLIDER_LABEL,
    payload
  }
}

export function expandSlider (idx) {
  return {
    type: ActionTypeSlider.EXPAND_SLIDER,
    payload: idx
  }
}

export function expandSliders () {
  return {
    type: ActionTypeSlider.EXPAND_SLIDERS
  }
}

export function collapseSliders () {
  return {
    type: ActionTypeSlider.COLLAPSE_SLIDERS
  }
}

export function selectCC (payload) {
  return {
    type: ActionTypeSlider.SELECT_CC,
    payload
  }
}

export function selectMidiChannel (payload) {
  return {
    type: ActionTypeSlider.SELECT_MIDI_CHANNEL,
    payload
  }
}

export function handleSliderChange (payload) {
  return {
    type: ActionTypeSlider.HANDLE_SLIDER_CHANGE,
    payload
  }
}

export function saveFile () {
  return {
    type: ActionTypeSlider.SAVE_FILE
  }
}

export function loadFile (results) {
  return {
    type: ActionTypeSlider.LOAD_FILE,
    payload: results
  }
}
