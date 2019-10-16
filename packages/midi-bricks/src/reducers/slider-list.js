import WebMIDI from 'webmidi'

import { ActionTypeSliderList } from '../actions/slider-list'
import { midi } from 'tonal'
import { fromMidi } from '../utils/fromMidi'
import { map } from 'lodash'
import { getUniqueId } from '../utils/get-unique-id'
import { createNextState } from 'redux-starter-kit'

export const initId = `page-${getUniqueId()}`

export const STRIP_TYPE = {
  BUTTON: 'BUTTON',
  BUTTON_TOGGLE: 'BUTTON_TOGGLE',
  BUTTON_CC: 'BUTTON_CC',
  BUTTON_TOGGLE_CC: 'BUTTON_TOGGLE_CC',
  BUTTON_PROGRAM_CHANGE: 'BUTTON_PROGRAM_CHANGE',
  SLIDER: 'SLIDER',
  SLIDER_HORZ: 'SLIDER_HORZ',
  LABEL: 'LABEL',
  PAGE: 'PAGE',
  XYPAD: 'XYPAD'
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
  PAGE,
  XYPAD
} = STRIP_TYPE

export const sliders = {
  [ActionTypeSliderList.INIT_MIDI_ACCESS_PENDING](state, action) {
    return createNextState(state, (draftState) => {
      return state
    })
  },

  [ActionTypeSliderList.INIT_FAILED](state, action) {
    const midi = {
      midiAccess: {
        inputs: {},
        outputs: {}
      }
    }

    return createNextState(state, (draftState) => {
      draftState.midi = midi
      draftState.isMidiFailed = true
      return draftState
    })
  },

  [ActionTypeSliderList.INIT_MIDI_ACCESS_OK](state, action) {
    return createNextState(state, (draftState) => {
      const midi = action.payload
      draftState.midi = midi
      draftState.isMidiFailed = false
      return draftState
    })
  },

  [ActionTypeSliderList.ADD_MIDI_ELEMENT](state, action) {
    const { isMidiFailed, sliderList, midi } = transformAddState(state, action)
    return createNextState(state, (draftState) => {
      draftState.sliderList = sliderList
      draftState.isMidiFailed = isMidiFailed
      draftState.midi = midi
      return draftState
    })
  },

  [ActionTypeSliderList.CLONE](state, action) {
    const i = (action.payload && action.payload.i) || ''
    let tmpState = null
    const list = state.sliderList
    let idx = state.sliderList.length - 1
    state.sliderList.forEach((item, id) => {
      if (item.i === i) {
        tmpState = {
          ...item,
          x: state.length + 1
        }
        idx = id
      }
    })

    const newArr = Object.values(Object.assign({}, list))
    const calcCC =
      i &&
      parseInt(
        tmpState.midiCC && (tmpState.midiCC || tmpState.midiCC[0] || 60),
        10
      ) + 1
    const caclCCThresh = calcCC > 127 ? 60 : calcCC
    const newDate = getUniqueId()
    let x = 0
    let y = 0
    let lastItem = { x: 0, y: 0 }
    state.sliderList.forEach((item) => {
      if (item.x > lastItem.x) x = item.x
      if (item.y > lastItem.y) y = item.y
      lastItem = item
    })
    let newEntry = i
      ? {
        ...tmpState,
        label: tmpState.label,
        i: newDate,
        midiCC: [caclCCThresh],
        x: x + 1,
        y: y + 1
      }
      : {
        ...list[idx],
        label: list[idx].label,
        i: newDate,
        midiCC: [caclCCThresh || 60],
        x: x + 1,
        y: y + 1
      }

    newArr.splice(idx, 0, newEntry)

    // Check for duplicated ids, or Error
    newArr.forEach((tmpItem, id) => {
      newArr.forEach((item, idx) => {
        if (tmpItem.i === item.i && id !== idx) {
          throw new Error(
            'Duplicated ID found in store. Look after better creation of unique ids, man!'
          )
        }
      })
    })
    return updatePagesWithSliderlist(
      state,
      newArr,
      action.payload.lastFocusedPage
    )
  },
  [ActionTypeSliderList.CHANGE_BUTTON_TYPE]({ sliderList }, action) {
    const { i, val } = action.payload
    return createNextState({ sliderList }, (draftState) => {
      const idx = sliderList.findIndex((item) => item.i === i)
      draftState.sliderList[idx].type = val
      return draftState
    })
  },
  [ActionTypeSliderList.DELETE](state, action) {
    const { i: sentIdx } = action.payload
    const isPage = sentIdx.toString().startsWith('page')

    if (isPage) {
      return createNextState(state, (draftState) => {
        let sliderList = []

        draftState.sliderList = sliderList
        return draftState
      })
    } else {
      return createNextState(state, (draftState) => {
        const sliderList = state.sliderList.filter(
          ({ i }) => sentIdx && sentIdx.toString() !== i
        )

        draftState.sliderList = sliderList
        return draftState
      })
    }
  },
  [ActionTypeSliderList.DELETE_ALL](state, action) {
    return createNextState(state, (draftState) => {
      draftState.sliderList = []
      draftState.presetName = ''
      return draftState
    })
  },

  [ActionTypeSliderList.HANDLE_SLIDER_CHANGE]({ sliderList }, action) {
    // At first send MIDI
    const { i, val } = action.payload
    const idx = sliderList.findIndex((item) => item.i === i)
    const { midiCC, midiChannel, driverName, label, isNoteOn, type } =
      sliderList[idx] || {}
    sendControlChanges({ midiCC, midiChannel, driverName, val, label })

    // Now, do view state changes
    return createNextState({ sliderList }, (draftState) => {
      // For CC Buttons we toggle the NoteOn state at each trigger
      // Keep in mind, that the component button will take care of sending the right values for itself.
      if ([BUTTON_CC, BUTTON_TOGGLE_CC].includes(type)) {
        draftState.sliderList[idx].isNoteOn = !isNoteOn
      }
      draftState.sliderList[idx].val = val
      return draftState
    })
  },

  [ActionTypeSliderList.SEND_MIDI_CC_Y](state, action) {
    const { idx, yVal, lastFocusedPage } = action.payload
    let newStateTmp = state.sliderList

    // Handle multi CC
    const tmp = newStateTmp[idx]
    const { yMidiCc, yMidiChannel, yDriverName, label } = tmp
    sendControlChanges({
      midiCC: yMidiCc,
      midiChannel: yMidiChannel,
      driverName: yDriverName,
      val: yVal,
      label
    })
    const sliderList = transformState(
      newStateTmp,
      { payload: { idx: parseInt(idx, 10), val: yVal } },
      'yVal'
    )
    return updatePagesWithSliderlist(state, sliderList, lastFocusedPage)
  },

  [ActionTypeSliderList.TOGGLE_NOTE](state, action) {
    const { i, lastFocusedPage } = action.payload

    const {
      onVal = 127,
      offVal = 0,
      midiCC,
      midiChannel,
      driverName,
      isNoteOn,
      label
    } = state.sliderList.find((e) => e.i === i) || {}

    toggleNotes({
      onVal,
      offVal,
      midiCC,
      midiChannel,
      driverName,
      isNoteOn,
      label
    })
    const sliderList = toggleNotesInState(state.sliderList, i)
    return updatePagesWithSliderlist(state, sliderList, lastFocusedPage)
  },

  [ActionTypeSliderList.SEND_PROGRAM_CHANGE](state, action) {
    const { i } = action.payload
    const tmp = state.sliderList.find((item) => item.i === i)
    const { midiCC, midiChannel, driverName } = tmp

    const output = getCheckedMidiOut(driverName)
    output && output.sendProgramChange(midiCC[0] - 1, midiChannel)
    return state
  },

  [ActionTypeSliderList.CHANGE_LABEL](state, action) {
    const { i, val } = action.payload
    //const sliderList = transformState(state.sliderList, { i, val }, 'label')
    return createNextState(state, (draftState) => {
      const idx = state.sliderList.findIndex((er) => er.i === i)
      const entry = state.sliderList.find((er) => er.i === i)
      if (entry) {
        draftState.sliderList[idx] = { ...entry, label: val }
      }
      return draftState
    })
    // return updatePagesWithSliderlist(state, sliderList, lastFocusedPage)
  },
  [ActionTypeSliderList.SELECT_MIDI_DRIVER](state, action) {
    const { i, driverName, lastFocusedPage } = action.payload
    const sliderList = transformState(
      state.sliderList,
      { i, val: driverName },
      'driverName'
    )
    return updatePagesWithSliderlist(state, sliderList, lastFocusedPage)
  },

  [ActionTypeSliderList.SELECT_MIDI_DRIVER_INPUT](state, action) {
    const { i, driverNameInput, lastFocusedPage } = action.payload
    const sliderList = transformState(
      state.sliderList,
      { i, val: driverNameInput },
      'driverNameInput'
    )
    return updatePagesWithSliderlist(state, sliderList, lastFocusedPage)
  },

  [ActionTypeSliderList.SELECT_CC](state, action) {
    const { i, val, lastFocusedPage } = action.payload
    const sliderList = transformState(state.sliderList, { i, val }, 'midiCC')
    return updatePagesWithSliderlist(state, sliderList, lastFocusedPage)
  },
  [ActionTypeSliderList.ADD_MIDI_CC_LISTENER](state, action) {
    const { i, val, lastFocusedPage } = action.payload
    const sliderList = transformState(
      state.sliderList,
      { i, val },
      'listenToCc'
    )
    return updatePagesWithSliderlist(state, sliderList, lastFocusedPage)
  },
  [ActionTypeSliderList.SET_MAX_VAL](state, action) {
    const { val, i, lastFocusedPage } = action.payload

    // Limit to allow number
    // and prevent crash
    const maxVal = parseInt(val, 10)
    let newAction = {}
    if (maxVal <= 127 && maxVal >= 1) {
      newAction = { val, i }
    } else if (maxVal > 127) {
      newAction = { val: 127, i }
    } else {
      newAction = { val: 1, i }
    }
    const { i: ii, val: vall } = newAction
    const sliderList = transformState(
      state.sliderList,
      { i: ii, val: vall },
      'maxVal'
    )
    return updatePagesWithSliderlist(state, sliderList, lastFocusedPage)
  },

  [ActionTypeSliderList.SET_MIN_VAL](state, action) {
    const { val, i, lastFocusedPage } = action.payload

    // Limit to allow number
    // and prevent crash
    const minVal = parseInt(val, 10)
    let newAction = {}
    if (minVal <= 127 && minVal >= 0) {
      newAction = { val, i }
    } else if (minVal > 127) {
      newAction = { val: 127, i }
    } else {
      newAction = { val: 0, i }
    }
    const { i: ii, val: vall } = newAction
    const sliderList = transformState(
      state.sliderList,
      { i: ii, val: vall },
      'minVal'
    )
    return updatePagesWithSliderlist(state, sliderList, lastFocusedPage)
  },

  [ActionTypeSliderList.SET_ON_VAL](state, action) {
    const { val, i, lastFocusedPage } = action.payload
    const valInt = parseInt(val, 10)
    let newAction = null
    if (valInt <= 127 && valInt >= 0) {
      newAction = { val: valInt, i }
    } else if (valInt > 127) {
      newAction = { val: 127, i }
    } else {
      newAction = { val: 0, i }
    }

    const { i: ii, val: vall } = newAction
    const sliderList = transformState(
      state.sliderList,
      { i: ii, val: vall },
      'onVal'
    )
    return updatePagesWithSliderlist(state, sliderList, lastFocusedPage)
  },

  [ActionTypeSliderList.SET_OFF_VAL](state, action) {
    const { val, i, lastFocusedPage } = action.payload
    const valInt = parseInt(val, 10)
    let newAction = null
    if (valInt <= 127 && valInt >= 0) {
      newAction = { val: valInt, i }
    } else if (valInt > 127) {
      newAction = { val: 127, i }
    } else {
      newAction = { val: 0, i }
    }

    const { i: ii, val: vall } = newAction
    const sliderList = transformState(
      state.sliderList,
      { i: ii, val: vall },
      'offVal'
    )
    return updatePagesWithSliderlist(state, sliderList, lastFocusedPage)
  },

  [ActionTypeSliderList.SELECT_MIDI_CHANNEL](state, action) {
    const { val, i } = action.payload

    return createNextState(state, (draftState) => {
      const idx = state.sliderList.findIndex((item) => item.i === i)
      draftState.sliderList[idx].midiChannel = val
      return draftState
    })
  },

  [ActionTypeSliderList.SELECT_MIDI_CHANNEL_INPUT](state, action) {
    const { val, i } = action.payload
    return createNextState(state, (draftState) => {
      const idx = state.sliderList.findIndex((item) => item.i === i)
      draftState.sliderList[idx].midiChannelInput = val
      return draftState
    })
  },

  [ActionTypeSliderList.SAVE_FILE](state, action) {
    // This is actuall only envolved in web app mode, not in electron mode
    const { viewSettings, sliders, version, pages: pgs } = action.payload

    // Clean out older preset fields
    let pages = Object.values(pgs).reduce(
      (acc, item) => {
        return {
          ...acc,
          [item.id]: {
            ...item,
            midi: undefined
          }
        }
      },
      { ...pgs }
    )

    const tmpFilterStore = {
      version,
      pages,
      viewSettings,
      sliders
    }
    const content = JSON.stringify(tmpFilterStore)
    const fileName = 'midi-bricks-preset.json'
    const contentType = 'application/json'
    let a = document.createElement('a')
    const file = new window.Blob([content], { type: contentType })
    a.href = URL.createObjectURL(file)
    a.download = fileName
    a.click()
    return state
  },
  [ActionTypeSliderList.LOAD_FILE](state, action) {
    return createNextState(state, (draftState) => {
      const {
        payload: { content: { sliders: { sliderList } } = {} } = {}
      } = action

      draftState.sliderList = sliderList
      return draftState
    })
  },
  [ActionTypeSliderList.CHANGE_LIST_ORDER](state, action) {
    return createNextState(state, (draftState) => {
      const { listOrder } = action.payload

      const sliderList =
        state.sliderList.map((item, idx) => ({
          ...item,
          ...listOrder[idx.toString()]
        })) || []

      draftState.sliderList = sliderList
      return draftState
    })
  },

  [ActionTypeSliderList.MIDI_MESSAGE_ARRIVED](state, action) {
    const { val, cC, channel, driver, isNoteOn } = action.payload

    const sliderList = map(state.sliderList, (item) => {
      const { listenToCc, midiChannelInput, driverNameInput } = item
      if (listenToCc && listenToCc.length > 0) {
        const haveChannelsMatched =
          midiChannelInput === 'all' ||
          channel.toString() === midiChannelInput.toString()
        const hasCc = cC && listenToCc.includes(cC.toString())
        if (hasCc && haveChannelsMatched && driverNameInput === driver) {
          return { ...item, val, isNoteOn }
        } else {
          return { ...item }
        }
      }
      return { ...item }
    })

    return createNextState(state, (draftState) => {
      draftState.sliderList = sliderList
      draftState.monitorVal = { val, cC, channel, driver, isNoteOn }
      return draftState
    })
  },

  [ActionTypeSliderList.CHANGE_COLORS](state, action) {
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
    const sliderList = state.sliderList.map((item) => {
      if (action.payload.i === item.i) {
        return {
          ...item,
          colors: {
            ...item.colors,
            ...fields
          }
        }
      }
      return item
    })

    return { ...state, sliderList }
  },

  [ActionTypeSliderList.CHANGE_FONT_SIZE](state, action) {
    const { i, fontSize } = action.payload
    const sliderList = transformState(
      state.sliderList,
      { i, val: fontSize },
      'fontSize'
    )

    return { ...state, sliderList }
  },

  [ActionTypeSliderList.CHANGE_FONT_WEIGHT](state, action) {
    const { i, fontWeight } = action.payload

    const sliderList = transformState(
      state.sliderList,
      { i, val: fontWeight },
      'fontWeight'
    )

    return { ...state, sliderList }
  },

  [ActionTypeSliderList.CHANGE_XYPAD_SETTINGS](state, action) {
    const {
      i,
      yDriverName,
      yMidiChannel,
      yMaxVal,
      yMinVal,
      yMidiCc
    } = action.payload

    let sliderList = []

    if (yMidiChannel) {
      const listWithChannels = transformState(
        state.sliderList,
        { i, val: yMidiChannel },
        'yMidiChannel'
      )
      sliderList = [...sliderList, ...listWithChannels]
    }

    if (yDriverName) {
      sliderList = transformState(
        state.sliderList,
        { i, val: yDriverName },
        'yDriverName'
      )
    }

    if (yMidiCc && yMidiCc.length > 0) {
      const listWithMidiCc = transformState(
        state.sliderList,
        { i, val: yMidiCc },
        'yMidiCc'
      )
      sliderList = [...sliderList, ...listWithMidiCc]
    }

    if (yMaxVal) {
      const listWithyMaxVal = transformState(
        state.sliderList,
        { i, val: yMaxVal },
        'yMaxVal'
      )
      sliderList = [...sliderList, ...listWithyMaxVal]
    }
    if (yMinVal) {
      const listWithyMinVal = transformState(
        state.sliderList,
        { i, val: yMinVal },
        'yMinVal'
      )
      sliderList = [...sliderList, ...listWithyMinVal]
    }

    return { ...state, sliderList }
  },

  [ActionTypeSliderList.TOGGLE_HIDE_VALUE](state, action) {
    const { i } = action.payload
    const sliderList = state.sliderList.map((item, idx) => {
      if (i === item.i) {
        return {
          ...item,
          isValueHidden: !item.isValueHidden
        }
      }
      return item
    })
    return { ...state, sliderList }
  },

  [ActionTypeSliderList.TRIGGER_ALL_MIDI_ELEMENTS](state, action) {
    state.sliderList.forEach((item, idx) => {
      const {
        type,
        midiCC,
        midiChannel,
        driverName,
        val,
        onVal,
        offVal,
        isNoteOn,
        label
      } = item
      if ([SLIDER].includes(type)) {
        sendControlChanges({ midiCC, midiChannel, driverName, val, label })
      }
      switch (type) {
        case BUTTON:
          toggleNotes({
            onVal,
            offVal,
            midiCC,
            midiChannel,
            driverName,
            isNoteOn: false,
            label
          })
          toggleNotes({
            onVal,
            offVal,
            midiCC,
            midiChannel,
            driverName,
            isNoteOn: true,
            label
          })
          break

        case BUTTON_CC:
          sendControlChanges({
            midiCC,
            midiChannel,
            driverName,
            val: onVal,
            label
          })
          sendControlChanges({
            midiCC,
            midiChannel,
            driverName,
            val: offVal,
            label
          })
          break

        case BUTTON_TOGGLE:
          toggleNotes({
            onVal,
            offVal,
            midiCC,
            midiChannel,
            driverName,
            isNoteOn: isNoteOn,
            label
          })
          toggleNotes({
            onVal,
            offVal,
            midiCC,
            midiChannel,
            driverName,
            isNoteOn: !isNoteOn,
            label
          })
          break

        case BUTTON_TOGGLE_CC:
          if (isNoteOn) {
            sendControlChanges({
              midiCC,
              midiChannel,
              driverName,
              val: offVal,
              label
            })
            sendControlChanges({
              midiCC,
              midiChannel,
              driverName,
              val: onVal,
              label
            })
          } else {
            sendControlChanges({
              midiCC,
              midiChannel,
              driverName,
              val: onVal,
              label
            })
            sendControlChanges({
              midiCC,
              midiChannel,
              driverName,
              val: offVal,
              label
            })
          }
          break
        default:
      }
    })
    return state
  },

  [ActionTypeSliderList.RESET_VALUES](state, action) {
    // const sliderList = state.sliderList.map((item, idx) => {
    //   const tmp = state.sliderListBackup[idx]
    //   let retVal = {
    //     ...item,
    //     val: (tmp && tmp.val) || 0,
    //     isNoteOn: (tmp && tmp.isNoteOn) || false
    //   }
    //   return retVal
    // })
    return createNextState(state, (draftState) => {
      //draftState.sliderList = sliderList
      return draftState
    })
    // return { ...state, sliderList }
  },

  // [ActionTypeSliderList.GO_BACK](state, action) {
  //   return { ...state, sliderList: state.sliderListBackup }
  // },

  // [ActionTypeSliderList.UPDATE_SLIDER_LIST_BACKUP](state, action) {
  //   const sliderList = sortSliderList(state.sliderList)
  //   return { ...state, sliderList, sliderListBackup: sliderList }
  // },

  [ActionTypeSliderList.SET_MIDI_PAGE](state, action) {
    return createNextState(state, (draftState) => {
      const { sliderList } = action.payload
      draftState.sliderList = sliderList
      return draftState
    })
  }
}

function transformState(sliderList, { i, val }, field) {
  return sliderList.map((item) => {
    if (item.i === i) {
      return {
        ...item,
        [field]: val
      }
    } else {
      return item
    }
  })
}

//TODO: mybe better to go outside with it
function transformAddState(state, action) {
  const { id, type } = action.payload
  const oldSliderList = state.sliderList || []

  const lastSelectedDriverName =
    (oldSliderList.length > 0 &&
      oldSliderList[oldSliderList.length - 1].driverName) ||
    'None'
  const newDriverName =
    lastSelectedDriverName !== 'None' && lastSelectedDriverName

  const addStateLength = () => oldSliderList.length + 1
  const addMidiCCVal = () => 59 + addStateLength() > 119 && 119

  let midiCC = null
  let label = ''
  let yVal = undefined
  let yDriverName = undefined
  let yMidiCc = undefined
  //let yDriverNameInput = undefined
  let yMidiChannel = undefined
  //let yMidiChannelInput = undefined
  let yMinVal = undefined
  let yMaxVal = undefined

  if ([BUTTON, BUTTON_TOGGLE].includes(type)) {
    label = 'Button ' + addStateLength()
    midiCC = [fromMidi(addMidiCCVal() + 1)]
  }
  if ([BUTTON_CC, BUTTON_TOGGLE_CC, BUTTON_PROGRAM_CHANGE].includes(type)) {
    label = 'CC Button ' + addStateLength()
    midiCC = [addMidiCCVal()]
  }
  if ([SLIDER, SLIDER_HORZ].includes(type)) {
    label = 'Slider ' + addStateLength()
    midiCC = [addMidiCCVal()]
  }
  if ([BUTTON_PROGRAM_CHANGE].includes(type)) {
    label = 'Program Change' + addStateLength()
    midiCC = [addMidiCCVal()]
  }
  if (type === LABEL) {
    label = 'Label ' + addStateLength()
  }
  if (type === PAGE) {
    label = 'Page ' + addStateLength()
  }
  if (type === XYPAD) {
    label = 'X / Y Pad ' + addStateLength()
    yVal = 50
    midiCC = [addMidiCCVal()]
    yDriverName = 'None'
    yMidiCc = [addMidiCCVal()]
    //yDriverNameInput = 'None'
    yMidiChannel = 1
    //yMidiChannelInput = 1
    yMinVal = 0
    yMaxVal = 127
  }
  const entry = {
    type,
    label,
    val: 50,
    lastSavedVal: 0,
    minVal: 0,
    maxVal: 127,
    onVal: 127,
    offVal: 0,
    midiCC,
    listenToCc: [],
    driverName: newDriverName,
    driverNameInput: 'None',
    yDriverName,
    yVal,
    yMidiCc,
    //yDriverNameInput,
    yMidiChannel,
    //yMidiChannelInput,
    yMinVal,
    yMaxVal,
    midiChannel: 1,
    midiChannelInput: 1,
    isNoteOn: false,
    isDraggable: true,
    i: id,
    x: addStateLength(),
    y: addStateLength(),
    w: type === PAGE ? 18 : 2,
    h: type === SLIDER ? 6 : 3,
    static: false,
    colors: {
      color: 'rgba(126, 211, 33, 1)',
      colorActive: 'rgba(184, 233, 134, 1)',
      colorFont: 'rgba(244, 166, 34, 1)',
      colorFontActive: 'rgba(248, 233, 28, 1)'
    },
    fontSize: 16,
    fontWeight: 500,
    isValueHidden: false
  }

  return type === PAGE
    ? {
      ...state,
      sliderList: []
    }
    : {
      ...state,
      sliderList: [...oldSliderList, entry]
    }
}

function toggleNotesInState(list, i) {
  return list.map((item) => {
    if (item.i === i) {
      const res = {
        ...item,
        isNoteOn: !item.isNoteOn,
        val: !item.isNoteOn ? item.onVal : item.offVal
      }
      return res
    } else {
      return item
    }
  })
}

function sendControlChanges({ midiCC, midiChannel, driverName, val, label }) {
  WebMIDI.octaveOffset = -1
  const output = getCheckedMidiOut(driverName)
  if (Array.isArray(midiCC) === true) {
    midiCC.forEach((item) => {
      const cc = midi(item)
      output && output.sendControlChange(cc, val, parseInt(midiChannel, 10))
    })
  }
}

function toggleNotes({
  label,
  onVal,
  offVal,
  midiCC,
  midiChannel,
  driverName,
  isNoteOn
}) {
  WebMIDI.octaveOffset = -1
  const output = getCheckedMidiOut(driverName)
  const onValInt = (onVal && parseInt(onVal, 10)) || 127
  const offValInt = (offVal === 0 && 0) || (offVal && parseInt(offVal, 10)) || 0
  if (!isNoteOn) {
    output &&
      output.playNote(midiCC, midiChannel, {
        rawVelocity: true,
        velocity: onValInt
      })
  } else {
    output &&
      output.stopNote(midiCC, midiChannel, {
        rawVelocity: true,
        velocity: offValInt
      })
  }
}

function getCheckedMidiOut(driverName) {
  const output = driverName !== 'None' && WebMIDI.getOutputByName(driverName)
  return output
}

function updatePagesWithSliderlist(state, refreshedSliderList = []) {
  return createNextState(state, (draftState) => {
    draftState.sliderList = refreshedSliderList
    return draftState
  })
}
