import createReducer from './createReducer'
import { ActionTypeSliderList } from '../actions/slider-list'
import { midi, Note } from 'tonal'

export const STRIP_TYPE = {
  SLIDER: 'SLIDER',
  BUTTON: 'BUTTON',
  BUTTON_TOGGLE: 'BUTTON_TOGGLE'
}

export const sliderList = createReducer([], {
  [ActionTypeSliderList.INIT_MIDI_ACCESS] (state, action) {
    const midi = {
      midiAccess: action.payload.midiAccess,
      midiDrivers: getAvailableDrivers(action.payload.midiAccess)
    }
    let arrToSend = state.map((item) => {
      return Object.assign({}, {
        ...item,
        midi
      })
    })
    if (arrToSend.length < 1) {
      const entry = {
        type: STRIP_TYPE.SLIDER,
        label: 'label 1',
        val: 80,
        midiCC: [60], // count up last entry,
        outputId: midi.midiDrivers[0].outputId,
        midiChannel: 1,
        midi,
        chord: 'none'
      }
      arrToSend = [entry]
    }
    return arrToSend
  },
  [ActionTypeSliderList.ADD_SLIDER] (state, action) {
    const newState = transformAddState(state, action, STRIP_TYPE.SLIDER)
    return newState
  },
  [ActionTypeSliderList.ADD_BUTTON] (state, action) {
    const newState = transformAddState(state, action, STRIP_TYPE.BUTTON)
    return newState
  },
  [ActionTypeSliderList.CLONE] (state, action) {
    const idx = action.payload
    const newArr = Object.values(Object.assign({}, state))
    let newEntry = Object.assign({}, state[idx])
    newEntry.label = 'CPY: ' + state[idx].label
    newArr.splice(idx + 1, 0, newEntry)
    return newArr
  },
  [ActionTypeSliderList.CHANGE_BUTTON_TYPE] (state, action) {
    const newState = transformState(state, action, 'type')
    return newState
  },
  [ActionTypeSliderList.DELETE] (state, action) {
    const newState = state.filter((t, idx) => idx !== action.payload)
    return [...newState]
  },
  [ActionTypeSliderList.DELETE_ALL] (state, action) {
    return [state[0]]
  },
  [ActionTypeSliderList.TOGGLE_NOTE] (state, action) {
    const idx = action.payload
    const tmp = state[idx]

    if (Array.isArray(tmp.midiCC) === true) {
      tmp.midiCC.forEach((item) => {
        const midiCC = midi(item)
        const {
          output,
          noteOn,
          noteOff
        } = getMidiOutputNoteOnOff({
          ...tmp,
          midiCC
        })

        if (!tmp.isNoteOn) {
          output.send(noteOn)
        } else {
          output.send(noteOff)
        }
      })
    }

    const newState = state.map((item, i) => {
      if (idx === i) {
        const tmp = {
          ...item,
          isNoteOn: !item.isNoteOn
        }
        return Object.assign({}, tmp)
      } else {
        return item
      }
    })
    return newState
  },
  [ActionTypeSliderList.CHANGE_LABEL] (state, action) {
    const newState = transformState(state, action, 'label')
    return newState
  },
  [ActionTypeSliderList.SELECT_SLIDER_MIDI_DRIVER] (state, action) {
    const newState = transformState(state, action, 'outputId')
    return newState
  },
  [ActionTypeSliderList.SELECT_CC] (state, action) {
    const newState = transformState(state, action, 'midiCC')
    return newState
  },
  [ActionTypeSliderList.SELECT_MIDI_CHANNEL] (state, action) {
    const {val} = action.payload

    // Limit to allowed number of midi channels
    // and prevent crash
    let newAction = null
    if ((val <= 16) && (val >= 1)) {
      newAction = action
    } else if (val > 16) {
      newAction = {payload: {val: 16}}
    } else {
      newAction = {payload: {val: 1}}
    }
    const newState = transformState(state, newAction, 'midiChannel')
    return newState
  },
  [ActionTypeSliderList.HANDLE_SLIDER_CHANGE] (state, action) {
    const { idx, val } = action.payload
    const tmp = state[idx]
    const outputId = tmp.outputId
    const output = tmp.midi.midiAccess.outputs.get(outputId)

    if (Array.isArray(tmp.midiCC) === true) {
      tmp.midiCC.forEach((item) => {
        const midiCC = midi(item)
        const ccMessage = [0xaf + parseInt(tmp.midiChannel, 10), midiCC, parseInt(val, 10)]
        // omitting the timestamp means send immediately.
        output.send(ccMessage, (window.performance.now() + 10.0))
      })
    }

    const newState = transformState(state, action, 'val')
    return newState
  },
  [ActionTypeSliderList.SAVE_FILE] (state, action) {
    const content = JSON.stringify(state)
    const fileName = 'json.txt'
    const contentType = 'text/plain'
    let a = document.createElement('a')
    const file = new window.Blob([content], { type: contentType })
    a.href = URL.createObjectURL(file)
    a.download = fileName
    a.click()
    return [...state]
  },
  [ActionTypeSliderList.LOAD_FILE] (state, action) {
    const files = action.payload[0]
    if (!files.length) {
      window.alert('No file selected')
    }
    const content = files[0].target.result
    const parsedJson = JSON.parse(content)
    // Restore midi-access
    const newState = parsedJson.map((item) => {
      const tmp = {
        ...item,
        midi: {
          midiAccess: state[0].midi.midiAccess,
          midiDrivers: item.midi.midiDrivers
        }
      }
      return Object.assign({}, tmp)
    })
    return newState
  },
  [ActionTypeSliderList.CHANGE_LIST_ORDER] (state, action) {
    return action.payload
  }
})

const getMidiOutputNoteOnOff = (sliderEntry) => {
  const val = sliderEntry.val
  const midiCC = sliderEntry.midiCC
  const outputId = sliderEntry.outputId
  const midiChannel = parseInt(sliderEntry.midiChannel, 10)
  const valInt = parseInt(val, 10)
  const noteOn = [0x8f + midiChannel, midiCC + 0x0c, valInt]
  const noteOff = [0x7f + midiChannel, midiCC + 0x0c, valInt]
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

const transformState = (state, action, field) => {
  const { idx, val } = action.payload || action
  const newState = state.map((item, i) => {
    if (idx === i) {
      const tmp = {
        ...item,
        [field]: val
      }
      return Object.assign({}, tmp)
    } else {
      return item
    }
  })
  return newState
}

const transformAddState = (state, action, type) => {
  // Either use last selected driver or take the first available one
  const midi = state[0].midi
  const availDriver = midi.midiDrivers[0].outputId
  const lastSelectedDriver = (state.length > 0) && state[state.length - 1].outputId
  const newDriver = lastSelectedDriver || availDriver

  const addStateLength = () => (state.length + 1)
  const addMidiCCVal = () => 59 + addStateLength()

  // either note or cc
  let midiCC = null
  if (type === STRIP_TYPE.BUTTON) {
    midiCC = [Note.fromMidi(addMidiCCVal())]
  } else {
    midiCC = [addMidiCCVal()]
  }

  const entry = {
    type,
    label: 'label ' + addStateLength(),
    val: 50,
    midiCC,
    outputId: newDriver,
    midiChannel: 1,
    isNoteOn: false,
    midi
  }
  return [...state, entry]
}
