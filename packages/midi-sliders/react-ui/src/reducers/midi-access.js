import createReducer from './createReducer'
import {ActionTypeMidiAccess} from '../actions/midi-access'

export const midi = createReducer([], {
  [ActionTypeMidiAccess.INIT_MIDI_ACCESS] (state, action) {
    console.log('midiaccess reducer ', action.payload.midiAccess)
    return {
      midiAccess: action.payload.midiAccess,
      midiDrivers: getAvailableDrivers(action.payload.midiAccess)
    }
  }
})

const getAvailableDrivers = (midiAccess) => {
  // const midiAccess = this.props.midiAccess// this.state.midiAccess
  for (var entry of midiAccess.inputs) {
    var input = entry[1]
    console.log("Input port [type:'" + input.type + "'] id:'" + input.id +
      "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
      "' version:'" + input.version + "'")
  }
  let availableDrivers = []
  for (var outputEntry of midiAccess.outputs) {
    var output = outputEntry[1]
    console.log("Output port [type:'" + output.type + "'] id:'" + output.id +
      "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
      "' version:'" + output.version + "'")

    availableDrivers.push({ outputId: output.id, name: output.name })
  }
  return availableDrivers
}
