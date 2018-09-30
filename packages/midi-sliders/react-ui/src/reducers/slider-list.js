import createReducer from './createReducer'
import { ActionTypeSliderList } from '../actions/slider-list'
import { midi, Note } from 'tonal'

export const STRIP_TYPE = {
  SLIDER: 'SLIDER',
  SLIDER_HORZ: 'SLIDER_HORZ',
  BUTTON: 'BUTTON',
  BUTTON_TOGGLE: 'BUTTON_TOGGLE',
  BUTTON_CC: 'BUTTON_CC',
  BUTTON_TOGGLE_CC: 'BUTTON_TOGGLE_CC',
  LABEL: 'LABEL',
  PAGE: 'PAGE'
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
        label: 'slider 1',
        val: 80,
        midiCC: [60],
        listenToCc: [],
        isNoteOn: false,
        outputId: midi.midiDrivers[0].outputId,
        midiChannel: 1,
        midi,
        i: '0',
        x: 0,
        y: 0,
        w: 2,
        h: 2,
        static: false,
        colors: {
          color: {hex: 'white'},
          colorActive: {hex: '#FFFF00'}
        }
      }
      arrToSend = [entry]
    }
    return arrToSend
  },
  [ActionTypeSliderList.ADD_SLIDER] (state, action) {
    const newState = transformAddState(state, action, STRIP_TYPE.SLIDER)
    return newState
  },
  [ActionTypeSliderList.ADD_SLIDER_HORZ] (state, action) {
    const newState = transformAddState(state, action, STRIP_TYPE.SLIDER_HORZ)
    return newState
  },
  [ActionTypeSliderList.ADD_BUTTON] (state, action) {
    const {type} = action.payload
    const newState = transformAddState(state, action, type)
    return newState
  },

  [ActionTypeSliderList.ADD_LABEL] (state, action) {
    const newState = transformAddState(state, action, STRIP_TYPE.LABEL)
    return newState
  },
  [ActionTypeSliderList.ADD_PAGE] (state, action) {
    const newState = transformAddState(state, action, STRIP_TYPE.PAGE)
    return newState
  },
  [ActionTypeSliderList.CLONE] (state, action) {
    const idx = action.payload
    const newArr = Object.values(Object.assign({}, state))
    const tmpState = state[idx]
    const calcCC = parseInt((tmpState.midiCC || tmpState.midiCC[0]), 10) + 1
    const caclCCThresh = calcCC > 127 ? 60 : calcCC
    const newDate = new Date().getUTCMilliseconds().toString() // (newArr.length + 1).toString()
    let newEntry = {
      ...state[idx],
      label: 'CPY: ' + tmpState.label,
      i: newDate,
      midiCC: ([caclCCThresh])
    }
    newArr.splice(idx, 0, newEntry)
    return newArr
  },
  [ActionTypeSliderList.CHANGE_BUTTON_TYPE] (state, action) {
    const {idx, val} = action.payload
    const toggleState = state.map((item, i) => {
      if (idx === i) {
        const tmp = {
          ...item,
          isNoteOn: false,
          type: val
        }
        return Object.assign({}, tmp)
      } else {
        return item
      }
    })
    // const newState = transformState(toggleState, action, 'type')
    return toggleState
  },
  [ActionTypeSliderList.DELETE] (state, action) {
    const newIdx = action.payload.idx.toString()
    const newState = state.filter((t, idx) => {
      return newIdx !== t.i
    })
    return [...newState]
  },
  [ActionTypeSliderList.DELETE_ALL] (state, action) {
    return [state[state.length - 1]]
    // return []
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
    const newState = toggleNote(state, idx)

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
  [ActionTypeSliderList.ADD_MIDI_CC_LISTENER] (state, action) {
    const newState = transformState(state, action, 'listenToCc')
    return newState
  },
  [ActionTypeSliderList.SELECT_MIDI_CHANNEL] (state, action) {
    const { val } = action.payload

    // Limit to allowed number of midi channels
    // and prevent crash
    let newAction = null
    if ((val <= 16) && (val >= 1)) {
      newAction = action
    } else if (val > 16) {
      newAction = { payload: { val: 16 } }
    } else {
      newAction = { payload: { val: 1 } }
    }
    const newState = transformState(state, newAction, 'midiChannel')
    return newState
  },
  [ActionTypeSliderList.HANDLE_SLIDER_CHANGE] (state, action) {
    const { idx, val } = action.payload
    let newStateTmp = state

    // Set noteOn/noteOff stemming from CC VAl
    if ((val === 127) || (val === 0)) {
      newStateTmp = toggleNote(newStateTmp, idx)
    }

    // Handle multi CC
    const tmp = newStateTmp[idx]
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
    const newState = transformState(newStateTmp, { payload: { idx: parseInt(idx, 10), val } }, 'val')
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
    let newArray = []
    if (!action.payload.listOrder) return state
    const len = action.payload.listOrder.length
    for (let i = 0; i < len; i++) {
      newArray.push(Object.assign({}, {
        ...state[i],
        ...action.payload.listOrder[i.toString()]
        // static: false
        // isDraggable: false,
        // isResizable: false
      }))
    }
    return newArray
  },

  [ActionTypeSliderList.MIDI_MESSAGE_ARRIVED] (state, action) {
    const newState = state.map(item => {
      const { listenToCc } = item
      if (listenToCc) {
        const val = action.payload.midiMessage.data[1]
        const hasVal = listenToCc.includes(val.toString())
        if (hasVal) {
          const { colors } = item
          const { colorActive, color } = colors
          const colAct = (colorActive && colorActive.hex) || colorActive
          const col = (color && color.hex) || color
          return { ...item, colors: { color: { hex: colAct }, colorActive: { hex: col } } }
        }
      }
      return { ...item }
    })
    return newState
  },

  [ActionTypeSliderList.CHANGE_COLORS] (state, action) {
    // Extract color fields from payload
    let fields = {}
    Object.keys(action.payload).forEach((e, i) => {
      if (e !== 'i') {
        fields = {
          ...fields,
          [e]: action.payload[e]
        }
      }
    })

    // Add color fields to state
    let newArray = []
    newArray = state.map((item, idx) => {
      let tmp = item
      if (action.payload.i === item.i) {
        tmp = Object.assign({}, {
          ...item,
          colors: {
            ...item.colors,
            ...fields
          }
        })
      }
      return tmp
    })
    return newArray
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
    const input = entry[1]
    console.log("Input port [type:'" + input.type + "'] id:'" + input.id +
      "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
      "' version:'" + input.version + "'")
  }
  let availableDrivers = []
  for (var outputEntry of midiAccess.outputs) {
    const output = outputEntry[1]
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
  let label = ''
  if ([STRIP_TYPE.BUTTON, STRIP_TYPE.BUTTON_TOGGLE].includes(type)) {
    label = 'button '
    midiCC = [Note.fromMidi(addMidiCCVal())]
  }
  if ([STRIP_TYPE.BUTTON_CC, STRIP_TYPE.BUTTON_TOGGLE_CC].includes(type)) {
    label = 'button '
    midiCC = [addMidiCCVal()]
  }
  if ([STRIP_TYPE.SLIDER, STRIP_TYPE.SLIDER_HORZ].includes(type)) {
    label = 'slider '
    midiCC = [addMidiCCVal()]
  }
  if (type === STRIP_TYPE.LABEL) {
    label = 'label '
  }
  if (type === STRIP_TYPE.PAGE) {
    label = 'page '
  }
  const entry = {
    type,
    label: label + addStateLength(),
    val: 50,
    midiCC,
    listenToCc: [],
    outputId: newDriver,
    midiChannel: 1,
    isNoteOn: false,
    midi,
    isDraggable: true,
    i: new Date().getUTCMilliseconds().toString(), // addStateLength().toString() + 'fuv',
    x: addStateLength(),
    y: addStateLength(),
    w: 2,
    h: 2,
    static: false,
    colors: {
      color: {hex: 'white'},
      colorActive: {hex: '#FFFF00'}
    }
  }
  return [...state, entry]
}

const toggleNote = (state, idx) => {
  return state.map((item, i) => {
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
}
