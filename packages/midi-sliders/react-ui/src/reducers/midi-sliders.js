import createReducer from './createReducer'
import {ActionTypeSlider} from '../actions/midi-sliders'

export const sliderList = createReducer([], {
  [ActionTypeSlider.INIT_MIDI_ACCESS] (state, action) {
    const midi = {
      midiAccess: action.payload.midiAccess,
      midiDrivers: getAvailableDrivers(action.payload.midiAccess)
    }
    let arrToSend = Object.values(state).map((item) => {
      return {
        ...item,
        midi
      }
    })
    if (arrToSend.length < 1) {
      const entry = {
        label: 'label0',
        val: 80,
        midiCC: parseInt(59, 10) + 1, // count up last entry,
        outputId: midi.midiDrivers[0].outputId,
        midiChannel: 1,
        isExpanded: true,
        midi

      }
      arrToSend = [entry]
    }
    return arrToSend
  },
  [ActionTypeSlider.ADD_SLIDER] (state, action) {
    // Either use last selected driver or take the first available one
    const midi = state[0] && state[0].midi
    const availDriver = midi.midiDrivers[0].outputId
    const lastSelectedDriver = (state.length > 0) && state[state.length - 1].outputId
    const newDriver = lastSelectedDriver || availDriver

    const entry = {
      label: 'label' + (state.length + 1),
      val: 80,
      midiCC: parseInt(state.length > 0 ? state[state.length - 1].midiCC : 59, 10) + 1, // count up last entry,
      outputId: newDriver,
      midiChannel: 1,
      isExpanded: true,
      isNoteOn: false,
      midi
    }
    return [...state, entry]
  },
  [ActionTypeSlider.DELETE_SLIDER] (state, action) {
    return state.filter((t, idx) => idx !== action.payload)
  },
  [ActionTypeSlider.DELETE_ALL_SLIDERS] (state, action) {
    return [state[0]]
  },
  [ActionTypeSlider.TOGGLE_NOTE] (state, action) {
    const idx = action.payload
    let newState = Object.assign({}, state)

    const {
      output,
      noteOn,
      noteOff
    } = getMidiOutputNoteOnOf(state[idx], idx)

    const tmp = newState[idx]
    newState[idx] = {
      ...tmp,
      isNoteOn: !tmp.isNoteOn
    }
    if (tmp.isNoteOn) {
      output.send(noteOn)
    } else {
      output.send(noteOff)
    }
    return Object.values(newState)
  },
  [ActionTypeSlider.TRIGGER_NOTE] (state, action) {
    const idx = action.payload
    const {
      output,
      noteOn,
      noteOff
    } = getMidiOutputNoteOnOf(state[idx], idx)

    output.send(noteOn)
    setTimeout(
      function () {
        output.send(noteOff)
      },
      100
    )

    return state
  },
  [ActionTypeSlider.CHANGE_SLIDER_LABEL] (state, action) {
    const {idx, val} = action.payload
    let newState = Object.assign({}, state)
    newState[idx] = {
      ...newState[idx],
      label: val
    }
    return Object.values(newState)
  },
  [ActionTypeSlider.EXPAND_SLIDER] (state, action) {
    const idx = action.payload
    let newState = Object.assign({}, state)
    newState[idx] = {
      ...newState[idx],
      isExpanded: !newState[idx].isExpanded
    }
    return Object.values(newState)
  },
  [ActionTypeSlider.EXPAND_SLIDERS] (state, action) {
    let newState = Object.assign({}, state)
    const list = Object.values(newState).map(item => {
      return {
        ...item,
        isExpanded: true
      }
    })
    return list
  },
  [ActionTypeSlider.COLLAPSE_SLIDERS] (state, action) {
    let newState = Object.assign({}, state)
    const list = Object.values(newState).map(item => {
      return {
        ...item,
        isExpanded: false
      }
    })
    return list
  },
  [ActionTypeSlider.SELECT_SLIDER_MIDI_DRIVER] (state, action) {
    const {idx, val} = action.payload
    let newState = Object.assign({}, state)
    newState[idx] = {
      ...newState[idx],
      outputId: val
    }
    return Object.values(newState)
  },
  [ActionTypeSlider.SELECT_CC] (state, action) {
    const {idx, val} = action.payload
    let newState = Object.assign({}, state)
    newState[idx] = {
      ...newState[idx],
      midiCC: val
    }
    return Object.values(newState)
  },
  [ActionTypeSlider.SELECT_MIDI_CHANNEL] (state, action) {
    const {idx, val} = action.payload
    let newState = Object.assign({}, state)
    newState[idx] = {
      ...newState[idx],
      midiChannel: val
    }
    return Object.values(newState)
  },
  [ActionTypeSlider.HANDLE_SLIDER_CHANGE] (state, action) {
    const {idx, val} = action.payload
    let list = Object.assign({}, state)
    list[idx] = {
      ...list[idx],
      val
    }

    const midiCC = list[idx].midiCC
    const outputId = list[idx].outputId
    var ccMessage = [0xaf + parseInt(list[idx].midiChannel, 10), midiCC, parseInt(val, 10)]
    var output = list[idx].midi.midiAccess.outputs.get(outputId)
    // omitting the timestamp means send immediately.
    output.send(ccMessage, (window.performance.now() + 10.0))
    // Promise.resolve().then(cb)

    return Object.values(list)
  },
  [ActionTypeSlider.SAVE_FILE] (state, action) {
    let list = state

    const content = JSON.stringify(list)
    const fileName = 'json.txt'
    const contentType = 'text/plain'

    var a = document.createElement('a')
    var file = new window.Blob([content], { type: contentType })
    a.href = URL.createObjectURL(file)
    a.download = fileName
    a.click()

    return [...list]
  },
  [ActionTypeSlider.LOAD_FILE] (state, action) {
    const files = action.payload[0]

    if (!files.length) {
      window.alert('No file selected')
    }
    const content = files[0].target.result
    const parsedJson = JSON.parse(content)

    // Restore midi-access
    const list = parsedJson.map((item) => {
      const tmp = {
        ...item,
        midi: {
          midiAccess: state[0].midi.midiAccess,
          midiDrivers: item.midi.midiDrivers
        }
      }
      return Object.assign({}, tmp)
    })
    return list
  }
})

const getMidiOutputNoteOnOf = (sliderEntry) => {
  const val = sliderEntry.val
  const midiCC = sliderEntry.midiCC
  const outputId = sliderEntry.outputId
  const midiChannel = parseInt(sliderEntry.midiChannel, 10)
  const valInt = parseInt(val, 10)
  const noteOn = [0x8f + midiChannel, midiCC, valInt]
  const noteOff = [0x7f + midiChannel, midiCC, valInt]
  const output = sliderEntry.midi.midiAccess.outputs.get(outputId)

  return {
    output,
    noteOn,
    noteOff
  }
}

const getAvailableDrivers = (midiAccess) => {
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
