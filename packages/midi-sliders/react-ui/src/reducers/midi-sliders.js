import createReducer from './createReducer'
import {ActionTypeSlider} from '../actions/midi-sliders'

import {store} from '../ReduxRoot.jsx'

export const sliderList = createReducer([], {
  [ActionTypeSlider.ADD_SLIDER] (state, action) {
    const storeCopy = store.getState()
    const newState = get(storeCopy)
    return [...state, newState]
  },
  [ActionTypeSlider.DELETE_SLIDER] (state, action) {
    return state.filter((t, idx) => idx !== action.payload)
  },
  [ActionTypeSlider.DELETE_ALL_SLIDERS] (state, action) {
    return []
  },
  [ActionTypeSlider.TOGGLE_NOTE] (state, action) {
    const idx = action.payload
    let newState = state
    newState[idx].isNoteOn = !newState[idx].isNoteOn

    const storeCopy = store.getState()
    const {
      output,
      noteOn,
      noteOff
    } = getMidiOutputNoteOnOf(storeCopy, idx)

    if (newState[idx].isNoteOn) {
      output.send(noteOn)
    } else {
      output.send(noteOff)
    }

    return [...newState]
  },
  [ActionTypeSlider.TRIGGER_NOTE] (state, action) {
    const idx = action.payload
    const storeCopy = store.getState()
    const {
      output,
      noteOn,
      noteOff
    } = getMidiOutputNoteOnOf(storeCopy, idx)

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
    console.log('change slider label ', action.payload.idx, action.payload.val)
    const idx = action.payload.idx
    const val = action.payload.val
    const storeCopy = store.getState()
    let list = storeCopy.sliderList
    list[idx].label = val
    return [...list]
  },
  [ActionTypeSlider.EXPAND_SLIDER] (state, action) {
    console.log('EXPAND_SLIDER slider ', action.payload)
    const idx = action.payload
    const storeCopy = store.getState()
    let list = storeCopy.sliderList
    list[idx].isExpanded = !list[idx].isExpanded
    return [...list]
  },
  [ActionTypeSlider.EXPAND_SLIDERS] (state, action) {
    console.log('EXPAND_SLIDERS slider ', action.payload)
    const storeCopy = store.getState()
    let list = storeCopy.sliderList
    const me = list.map(item => {
      return {
        ...item,
        isExpanded: true
      }
    })
    return [...me]
  },
  [ActionTypeSlider.COLLAPSE_SLIDERS] (state, action) {
    console.log('COLLAPSE_SLIDERS slider ', action.payload)
    const storeCopy = store.getState()
    let list = storeCopy.sliderList
    const me = list.map(item => {
      return {
        ...item,
        isExpanded: false
      }
    })
    return [...me]
  },
  [ActionTypeSlider.SELECT_SLIDER_MIDI_DRIVER] (state, action) {
    console.log('SELECT_SLIDER_MIDI_DRIVER slider ', action.payload)
    const idx = action.payload.idx
    const val = action.payload.val
    const storeCopy = store.getState()
    let list = storeCopy.sliderList
    list[idx].outputId = val
    return [...list]
  },
  [ActionTypeSlider.SELECT_CC] (state, action) {
    console.log('SELECT_CC slider ', action.payload)
    const idx = action.payload.idx
    const val = action.payload.val
    const storeCopy = store.getState()
    let list = storeCopy.sliderList
    list[idx].midiCC = val
    return [...list]
  },
  [ActionTypeSlider.SELECT_MIDI_CHANNEL] (state, action) {
    console.log('SELECT_MIDI_CHANNEL  ', action.payload)
    const idx = action.payload.idx
    const val = action.payload.val
    const storeCopy = store.getState()
    let list = storeCopy.sliderList
    list[idx].midiChannel = val
    return [...list]
  },
  [ActionTypeSlider.HANDLE_SLIDER_CHANGE] (state, action) {
    console.log('HANDLE_SLIDER_CHANGE  ', action.payload)
    const idx = action.payload.idx
    const val = action.payload.val
    const storeCopy = store.getState()
    let list = storeCopy.sliderList
    list[idx].val = val

    const midiCC = list[idx].midiCC
    const outputId = list[idx].outputId
    var ccMessage = [0xaf + parseInt(list[idx].midiChannel, 10), midiCC, parseInt(val, 10)]
    var output = storeCopy.midi.midiAccess.outputs.get(outputId)
    output.send(ccMessage) // omitting the timestamp means send immediately.

    return [...list]
  },
  [ActionTypeSlider.SAVE_FILE] (state, action) {
    console.log('SAVE_FILE  ')
    const storeCopy = store.getState()
    let list = storeCopy.sliderList

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
      window.alert('No file select')
    }
    const content = files[0].target.result
    const parsedJson = JSON.parse(content)
    return [...parsedJson]
  }
})

function get (store) {
  const sliderEntries = store.sliderList || []

  // Either use last selected driver or take the first available one
  const availDriver = store.midi.midiDrivers[0].outputId
  const lastSelectedDriver = (sliderEntries.length > 0) && sliderEntries[sliderEntries.length - 1].outputId
  const newDriver = lastSelectedDriver || availDriver

  const entry = {
    label: 'label' + (sliderEntries.length + 1),
    val: 80,
    midiCC: parseInt(sliderEntries.length > 0 ? sliderEntries[sliderEntries.length - 1].midiCC : 59, 10) + 1, // count up last entry,
    outputId: newDriver,
    midiChannel: 1,
    isExpanded: true
  }

  return entry
}

const getMidiOutputNoteOnOf = (store, idx) => {
  const sliderEntries = store.sliderList // this.state
  const val = sliderEntries[idx].val
  const midiCC = sliderEntries[idx].midiCC
  const outputId = sliderEntries[idx].outputId
  const midiChannel = parseInt(sliderEntries[idx].midiChannel, 10)
  const valInt = parseInt(val, 10)
  const noteOn = [0x8f + midiChannel, midiCC, valInt]
  const noteOff = [0x7f + midiChannel, midiCC, valInt]
  const output = store.midi.midiAccess.outputs.get(outputId)

  return {
    output,
    noteOn,
    noteOff
  }
}
