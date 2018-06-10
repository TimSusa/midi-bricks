
export const ActionTypeMidiAccess = {
  INIT_MIDI_ACCESS: 'INIT_MIDI_ACCESS'
}

export function initMidiAccess (midiAccess) {
  return {
    type: ActionTypeMidiAccess.INIT_MIDI_ACCESS,
    payload: midiAccess
  }
}
