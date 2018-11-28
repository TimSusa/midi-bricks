import WebMIDI from 'webmidi'
import createReducer from './createReducer'
import { store } from './../providers/ReduxWrappedMuiApp'
import { ActionTypeSliderList } from '../actions/slider-list'
import { midi } from 'tonal'
import { fromMidi } from '../utils/fromMidi'
import { uniqueId } from 'lodash'

export const STRIP_TYPE = {
  BUTTON: 'BUTTON',
  BUTTON_TOGGLE: 'BUTTON_TOGGLE',
  BUTTON_CC: 'BUTTON_CC',
  BUTTON_TOGGLE_CC: 'BUTTON_TOGGLE_CC',
  BUTTON_PROGRAM_CHANGE: 'BUTTON_PROGRAM_CHANGE',
  SLIDER: 'SLIDER',
  SLIDER_HORZ: 'SLIDER_HORZ',
  LABEL: 'LABEL',
  PAGE: 'PAGE'
}

const {
  BUTTON,
  BUTTON_CC,
  BUTTON_TOGGLE,
  BUTTON_TOGGLE_CC,
  BUTTON_PROGRAM_CHANGE,
  SLIDER,
  SLIDER_HORZ,
  LABEL,
  PAGE
} = STRIP_TYPE

export const sliders = createReducer([], {

  [ActionTypeSliderList.INIT_PENDING] (state, action) {
    console.log('reducer init pending', action)
    return state
  },

  [ActionTypeSliderList.INIT_FAILED] (state, action) {
    console.warn('reducer init failed', action)
    return {
      ...state,
      isMidiFailed: true
    }
  },

  [ActionTypeSliderList.INIT_MIDI_ACCESS] (state, action) {
    const { midiAccess } = action.payload
    const midi = {
      midiAccess,
      midiDrivers: getAvailableDrivers(midiAccess)
    }

    const sliderList = state.sliderList && state.sliderList.length && state.sliderList.map((item) => {
      if (item.driverName) {
        midi.midiDrivers.forEach(({ name, outputId }) => {
          if (name === item.driverName) {
            return Object.assign({}, {
              ...item,
              outputId
            })
          }
        })
      }
      return Object.assign({}, {
        ...item
      })
    })
    return { ...state, isMidiFailed: false, midi, sliderList }
  },
  [ActionTypeSliderList.ADD_SLIDER] (state, action) {
    const newState = transformAddState(state, action, SLIDER)
    return newState
  },
  [ActionTypeSliderList.ADD_SLIDER_HORZ] (state, action) {
    const newState = transformAddState(state, action, SLIDER_HORZ)
    return newState
  },
  [ActionTypeSliderList.ADD_BUTTON] (state, action) {
    const { type } = action.payload
    const newState = transformAddState(state, action, type)
    return newState
  },

  [ActionTypeSliderList.ADD_LABEL] (state, action) {
    const newState = transformAddState(state, action, LABEL)
    return newState
  },
  [ActionTypeSliderList.ADD_PAGE] (state, action) {
    const newState = transformAddState(state, action, PAGE)
    return newState
  },
  [ActionTypeSliderList.CLONE] (state, action) {
    // Action can come without payload
    const i = (action.payload && action.payload.i) || ''
    let tmpState = null
    const list = state.sliderList
    let idx = state.sliderList.length - 1
    state.sliderList.forEach((item, id) => {
      if (item.i === i) {
        tmpState = {
          ...item,
          x: (state.length + 1)
        }
        idx = id
      }
    })

    const newArr = Object.values(Object.assign({}, list))
    const calcCC = i && parseInt(tmpState.midiCC && (tmpState.midiCC || tmpState.midiCC[0] || 60), 10) + 1
    const caclCCThresh = calcCC > 127 ? 60 : calcCC
    const newDate = getUniqueId()
    let x = 0
    let y = 0
    let lastItem = { x: 0, y: 0 }
    state.sliderList.forEach(item => {
      if (item.x > lastItem.x) x = item.x
      if (item.y > lastItem.y) y = item.y
      lastItem = item
    })
    let newEntry = i ? {
      ...tmpState,
      label: tmpState.label,
      i: newDate,
      midiCC: ([caclCCThresh]),
      x: x + 1,
      y: y + 1
    } : {
      ...list[idx],
      label: list[idx].label,
      i: newDate,
      midiCC: ([caclCCThresh || 60]),
      x: x + 1,
      y: y + 1
    }

    newArr.splice(idx, 0, newEntry)

    // Check for duplicated ids, or Error
    newArr.forEach((tmpItem, id) => {
      newArr.forEach((item, idx) => {
        if ((tmpItem.i === item.i) && (id !== idx)) {
          throw new Error('Duplicated ID found in store. Look after better creation of unique ids, man!')
        }
      })
    })
    return { ...state, sliderList: newArr }
  },
  [ActionTypeSliderList.CHANGE_BUTTON_TYPE] (state, action) {
    const { idx, val } = action.payload
    const sliderList = state.sliderList.map((item, i) => {
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
    return { ...state, sliderList }
  },
  [ActionTypeSliderList.DELETE] (state, action) {
    const newIdx = action.payload.idx.toString()
    const sliderList = state.sliderList.filter((t, idx) => {
      return newIdx !== t.i
    })
    return { ...state, sliderList, sliderListBackup: state.sliderList }
  },
  [ActionTypeSliderList.DELETE_ALL] (state, action) {
    return { ...state, sliderList: [], sliderListBackup: state.sliderList }
  },

  [ActionTypeSliderList.HANDLE_SLIDER_CHANGE] (state, action) {
    const { idx, val } = action.payload
    let newStateTmp = state.sliderList

    // Set noteOn/noteOff stemming from CC VAl
    const { type, onVal, offVal } = newStateTmp[idx]
    if ([BUTTON_CC, BUTTON_TOGGLE_CC].includes(type)) {
      if ((val === onVal) || (val === offVal)) {
        newStateTmp = toggleNote(newStateTmp, idx)
      }
    }

    // Handle multi CC
    const tmp = newStateTmp[idx]
    // const output = state.midi.midiAccess.outputs.get(outputId)
    const { midiCC, midiChannel, outputId } = tmp
    WebMIDI.octaveOffset = -1
    const output = WebMIDI.getOutputById(outputId)

    if (Array.isArray(midiCC) === true) {
      midiCC.forEach((item) => {
        const cc = midi(item)
        // const ccMessage = [0xaf + parseInt(tmp.midiChannel, 10), midiCC, parseInt(val, 10)]
        // omitting the timestamp means send immediately.
        output.sendControlChange(cc, val, parseInt(midiChannel, 10))
        // output.send(ccMessage, (window.performance.now() + 10.0))
      })
    }
    const sliderList = transformState(newStateTmp, { payload: { idx: parseInt(idx, 10), val } }, 'val')
    return { ...state, sliderList }
  },

  [ActionTypeSliderList.TOGGLE_NOTE] (state, action) {
    const idx = action.payload

    const tmp = state.sliderList[idx]
    const { onVal, offVal, midiCC, midiChannel, outputId, isNoteOn } = tmp
    WebMIDI.octaveOffset = -1
    const output = WebMIDI.getOutputById(outputId)
    const onValInt = (onVal && parseInt(onVal, 10)) || 127
    const offValInt = ((offVal === 0) && 0) || (offVal && parseInt(offVal, 10)) || 0
    if (!isNoteOn) {
      output.playNote(midiCC, midiChannel, { rawVelocity: true, velocity: onValInt })
    } else {
      output.stopNote(midiCC, midiChannel, { rawVelocity: true, velocity: offValInt })
    }
    const sliderList = toggleNote(state.sliderList, idx)
    return { ...state, sliderList }
  },

  [ActionTypeSliderList.SEND_PROGRAM_CHANGE] (state, action) {
    const { idx } = action.payload
    const tmp = state.sliderList[idx]
    const { midiCC, midiChannel, outputId } = tmp

    // WebMIDI.octaveOffset = -1
    const output = WebMIDI.getOutputById(outputId)
    output.sendProgramChange(midiCC[0] - 1, midiChannel)
    return state
  },

  [ActionTypeSliderList.CHANGE_LABEL] (state, action) {
    const newState = transformState(state.sliderList, action, 'label')
    return { ...state, sliderList: newState }
  },
  [ActionTypeSliderList.SELECT_SLIDER_MIDI_DRIVER] (state, action) {
    const { i, driverName } = action.payload
    const sliderList = state.sliderList.map((item) => {
      let retVal = item
      state.midi.midiDrivers.forEach(({ name, outputId }) => {
        if (name === driverName) {
          if (item.i === i) {
            retVal = Object.assign({}, {
              ...item,
              driverName,
              outputId
            })
          }
        }
      })
      return retVal
    })
    return { ...state, sliderList }
  },
  [ActionTypeSliderList.SELECT_CC] (state, action) {
    const sliderList = transformState(state.sliderList, action, 'midiCC')
    return { ...state, sliderList }
  },
  [ActionTypeSliderList.ADD_MIDI_CC_LISTENER] (state, action) {
    const sliderList = transformState(state.sliderList, action, 'listenToCc')
    return { ...state, sliderList }
  },
  [ActionTypeSliderList.SET_MAX_VAL] (state, action) {
    const { val, idx } = action.payload

    // Limit to allow number
    // and prevent crash
    const maxVal = parseInt(val, 10)
    let newAction = null
    if ((maxVal <= 127) && (maxVal >= 1)) {
      newAction = { payload: { val, idx } }
    } else if (maxVal > 127) {
      newAction = { payload: { val: 127, idx } }
    } else {
      newAction = { payload: { val: 1, idx } }
    }
    const sliderList = transformState(state.sliderList, newAction, 'maxVal')
    return { ...state, sliderList }
  },

  [ActionTypeSliderList.SET_MIN_VAL] (state, action) {
    const { val, idx } = action.payload

    // Limit to allow number
    // and prevent crash
    const minVal = parseInt(val, 10)
    let newAction = null
    if ((minVal <= 127) && (minVal >= 0)) {
      newAction = { payload: { val, idx } }
    } else if (minVal > 127) {
      newAction = { payload: { val: 127, idx } }
    } else {
      newAction = { payload: { val: 0, idx } }
    }
    const sliderList = transformState(state.sliderList, newAction, 'minVal')
    return { ...state, sliderList }
  },

  [ActionTypeSliderList.SET_ON_VAL] (state, action) {
    const { val, idx } = action.payload
    const valInt = parseInt(val, 10)
    let newAction = null
    if ((valInt <= 127) && (valInt >= 0)) {
      newAction = { payload: { val: valInt, idx } }
    } else if (valInt > 127) {
      newAction = { payload: { val: 127, idx } }
    } else {
      newAction = { payload: { val: 0, idx } }
    }

    const sliderList = transformState(state.sliderList, newAction, 'onVal')
    return { ...state, sliderList }
  },

  [ActionTypeSliderList.SET_OFF_VAL] (state, action) {
    const { val, idx } = action.payload
    const valInt = parseInt(val, 10)
    let newAction = null
    if ((valInt <= 127) && (valInt >= 0)) {
      newAction = { payload: { val: valInt, idx } }
    } else if (valInt > 127) {
      newAction = { payload: { val: 127, idx } }
    } else {
      newAction = { payload: { val: 0, idx } }
    }
    const sliderList = transformState(state.sliderList, newAction, 'offVal')
    return { ...state, sliderList }
  },

  [ActionTypeSliderList.SELECT_MIDI_CHANNEL] (state, action) {
    const { val, idx } = action.payload

    // Limit to allow number of midi channels
    // and prevent crash
    let newAction = null
    if ((val <= 16) && (val >= 1)) {
      newAction = action
    } else if (val > 16) {
      newAction = { payload: { val: 16, idx } }
    } else {
      newAction = { payload: { val: 1, idx } }
    }
    const sliderList = transformState(state.sliderList, newAction, 'midiChannel')
    return { ...state, sliderList }
  },

  [ActionTypeSliderList.SELECT_MIDI_CHANNEL_INPUT] (state, action) {
    const { val, idx } = action.payload

    // Limit to allow number of midi channels
    // and prevent crash
    let newAction = null

    if (val === 'all') {
      newAction = { payload: { val: 'all', idx } }
    }
    const sliderList = transformState(state.sliderList, newAction || action, 'midiChannelInput')
    return { ...state, sliderList }
  },

  [ActionTypeSliderList.SAVE_FILE] (state, action) {
    const tmpStore = store.getState()
    const { viewSettings, sliders: { sliderList, presetName } } = tmpStore

    // Clean out older preset fields
    const filteredSliderList = sliderList.map(entry => ({ ...entry, midi: undefined }))
    const filteredFooterpageList = viewSettings.footerPages.map(item => ({ ...item, midi: undefined }))
    const tmpFilterStore = {
      viewSettings: {
        ...viewSettings,
        footerPages: filteredFooterpageList
      },
      sliders: {
        sliderList: filteredSliderList,
        presetName,
        sliderListBackup: [],
        midi: undefined
      }
    }
    const content = JSON.stringify(tmpFilterStore)
    const fileName = 'midi-bricks-preset.js'
    const contentType = 'application/json'
    let a = document.createElement('a')
    const file = new window.Blob([content], { type: contentType })
    a.href = URL.createObjectURL(file)
    a.download = fileName
    a.click()
    return { ...state }
  },
  [ActionTypeSliderList.LOAD_FILE] (state, action) {
    const files = action.payload[0]
    if (!files.length) {
      window.alert('No file selected')
    }
    const content = files[0].target.result
    const presetName = files[1].name
    const parsedJson = JSON.parse(content)
    const tmp =
      (parsedJson.sliderList && parsedJson.sliderList) ||
      (parsedJson.sliders.sliderList && parsedJson.sliders.sliderList) ||
      parsedJson

    // Apply self healing ouputId
    const sliderList = tmp.map(item => {
      let tmp = {
        ...item,
        lastSavedVal: item.val || 0,
        onVal: item.onVal || 127,
        offVal: item.offVal || 0,
        minVal: item.minVal || 0,
        maxVal: item.maxVal || 127,
        midi: undefined
      }
      state.midi.midiDrivers.forEach(driver => {
        if (driver.name === item.driverName) {
          if (driver.outputId !== item.outputId) {
            tmp = {
              ...tmp,
              outputId: driver.outputId
            }
          }
        }
      })
      return tmp
    })
    return { ...state, sliderList, presetName, sliderListBackup: sliderList }
  },
  [ActionTypeSliderList.CHANGE_LIST_ORDER] (state, action) {
    let newArray = []
    if (!action.payload.listOrder) return { ...state, sliderList: newArray }
    const len = action.payload.listOrder.length
    for (let i = 0; i < len; i++) {
      newArray.push(Object.assign({}, {
        ...state.sliderList[i],
        ...action.payload.listOrder[i.toString()]
      }))
    }
    return { ...state, sliderList: newArray, sliderListBackup: state.sliderList }
  },

  [ActionTypeSliderList.MIDI_MESSAGE_ARRIVED] (state, action) {
    const sliderList = state.sliderList.map(item => {
      const { listenToCc, midiChannelInput, driverName } = item
      if (listenToCc && listenToCc.length > 0) {
        const { val, cC, channel, driver, isNoteOn } = action.payload
        // let tmpCc = cC
        // if (!Number.isInteger(cC)) {
        //   tmpCc = cC.number
        // } else {
        //   tmpCc = cC
        // }
        const haveChannelsMatched = (midiChannelInput === 'all') || channel.toString() === midiChannelInput
        const hasCc = listenToCc.includes(cC && cC.toString())
        if (hasCc && haveChannelsMatched && (driverName === driver)) {
          return { ...item, val, isNoteOn }
        } else {
          return { ...item }
        }
      }
      return { ...item }
    })
    return { ...state, sliderList }
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
    const sliderList = state.sliderList.map((item, idx) => {
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
    return { ...state, sliderList }
  },

  [ActionTypeSliderList.CHANGE_FONT_SIZE] (state, action) {
    const { i, fontSize } = action.payload
    const sliderList = state.sliderList.map((item, idx) => {
      let tmp = item
      if (i === item.i) {
        tmp = Object.assign({}, {
          ...item,
          fontSize
        })
      }
      return tmp
    })
    return { ...state, sliderList }
  },

  [ActionTypeSliderList.CHANGE_FONT_WEIGHT] (state, action) {
    const { i, fontWeight } = action.payload
    const sliderList = state.sliderList.map((item, idx) => {
      let tmp = item
      if (i === item.i) {
        tmp = Object.assign({}, {
          ...item,
          fontWeight
        })
      }
      return tmp
    })
    return { ...state, sliderList }
  },

  [ActionTypeSliderList.TOGGLE_HIDE_VALUE] (state, action) {
    const { i } = action.payload
    const sliderList = state.sliderList.map((item, idx) => {
      let tmp = item
      if (i === item.i) {
        tmp = Object.assign({}, {
          ...item,
          isValueHidden: !item.isValueHidden
        })
      }
      return tmp
    })
    return { ...state, sliderList }
  },

  [ActionTypeSliderList.RESET_VALUES] (state, action) {
    const sliderList = state.sliderList.map((item, idx) => {
      const tmp = state.sliderListBackup[idx]
      let retVal = {
        ...item,
        val: (tmp && tmp.val) || 0,
        isNoteOn: (tmp && tmp.isNoteOn) || false
      }
      return retVal
    })
    return { ...state, sliderList, sliderListBackup: state.sliderList }
  },

  [ActionTypeSliderList.GO_BACK] (state, action) {
    return { ...state, sliderList: state.sliderListBackup }
  }
})

const getAvailableDrivers = (midiAccess) => {
  for (var input of midiAccess.inputs) {
    console.log("Input port [type:'" + input.type + "'] id:'" + input.id +
      "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
      "' version:'" + input.version + "'")
  }
  let availableDrivers = []
  for (var output of midiAccess.outputs) {
    console.log("Output port [type:'" + output.type + "'] id:'" + output.id +
      "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
      "' version:'" + output.version + "'")

    availableDrivers.push({ outputId: output.id, name: output.name })
  }
  return availableDrivers
}

const transformState = (sliderList, action, field) => {
  const { idx, val } = action.payload || action
  const newState = sliderList.map((item, i) => {
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
  // Either use last selected driver id or take the first available one
  const midi = state.midi
  const list = state.sliderList || []

  // Driver Name
  const availDriverName = midi.midiDrivers[0].name
  const lastSelectedDriverName = ((list.length > 0) && list[list.length - 1].driverName) || 'None'
  const newDriverName = ((lastSelectedDriverName !== 'None') && lastSelectedDriverName) || availDriverName

  // Output Id / Driver Id
  const availDriverId = midi.midiDrivers[0].outputId
  const lastSelectedDriverId = (list.length > 0) && list[list.length - 1].outputId
  const newDriverId = ((lastSelectedDriverId !== 'None') && lastSelectedDriverId) || availDriverId

  const addStateLength = () => (list.length + 1)
  const addMidiCCVal = () => 59 + addStateLength()

  let midiCC = null
  let label = ''

  if ([BUTTON, BUTTON_TOGGLE].includes(type)) {
    label = 'Button '
    midiCC = [fromMidi(addMidiCCVal())]
  }
  if ([BUTTON_CC, BUTTON_TOGGLE_CC, BUTTON_PROGRAM_CHANGE].includes(type)) {
    label = 'CC Button '
    midiCC = [addMidiCCVal()]
  }
  if ([SLIDER, SLIDER_HORZ].includes(type)) {
    label = 'Slider '
    midiCC = [addMidiCCVal()]
  }
  if ([BUTTON_PROGRAM_CHANGE].includes(type)) {
    label = 'Program Change'
    midiCC = [addMidiCCVal()]
  }
  if (type === LABEL) {
    label = 'Label '
  }
  if (type === PAGE) {
    label = 'Page '
  }
  const entry = {
    type,
    label: label + addStateLength(),
    val: 50,
    lastSavedVal: 0,
    minVal: 0,
    maxVal: 127,
    onVal: 127,
    offVal: 0,
    midiCC,
    listenToCc: [],
    outputId: [PAGE, LABEL].includes(type) ? 'None' : newDriverId,
    driverName: newDriverName,
    midiChannel: 1,
    midiChannelInput: 'all',
    isNoteOn: false,
    isDraggable: true,
    i: getUniqueId(),
    x: addStateLength(),
    y: addStateLength(),
    w: 2,
    h: 3,
    static: false,
    colors: {
      color: 'rgba(240, 255, 0, 1)',
      colorActive: 'rgba(240, 255, 0, 1)'
    },
    fontSize: 16,
    fontWeight: 500,
    isValueHidden: false
  }
  return { ...state, sliderList: [...list, entry] }
}

const toggleNote = (list, idx) => {
  return list.map((item, i) => {
    if (idx === i) {
      const tmp = {
        ...item,
        isNoteOn: !item.isNoteOn,
        val: !item.isNoteOn ? item.onVal : item.offVal
      }
      return Object.assign({}, tmp)
    } else {
      return item
    }
  })
}

const getUniqueId = () => uniqueId((new Date()).getTime() + Math.random().toString(16))
