import WebMIDI from 'webmidi'
// import { debounce } from 'debounce'
import { Actions } from './slider-list'
import merge from 'lodash/merge'
import debounce from 'lodash/debounce'

const { initMidiAccessPending, midiMessageArrived, initFailed, initMidiAccessOk } = Actions

export function initApp(opts) {

  const { listenToAllChannels = false } = opts || {}
  if (listenToAllChannels) {
    console.log('INIT AP and listen to all channels')
  } else {
    console.log('normal inti')
  }
  return function (dispatch, getState) {
    return new Promise((resolve, reject) => {
      WebMIDI.disable()
      dispatch(initMidiAccessPending('start'))

      WebMIDI.enable((err) => {
        if (err) {
          // eslint-disable-next-line no-alert
          reject(dispatch(initFailed('Midi could not be enabled.')))
        }
        const { inputs = [], outputs = [] } = WebMIDI
        const { sliders: { sliderList }, viewSettings: { globalMidiInputDelay } } = getState()
        const allCcListenersFound = findCcListeners(sliderList)
        const allNoteListenersFound = findNoteListeners(sliderList)
        inputs.forEach((input) => {
          const { name } = input
          input.removeListener()

          const tmpIn = input.removeListener('controlchange')
          registerCcListeners(allCcListenersFound, name, tmpIn, dispatch, globalMidiInputDelay, listenToAllChannels)
          const tmpInNoteOn = tmpIn.removeListener('noteon')
          const tmpInNoteOff = tmpInNoteOn.removeListener('noteoff')
          registerNoteListeners(allNoteListenersFound, name, tmpInNoteOff, dispatch, globalMidiInputDelay, listenToAllChannels)
        })
        if (hasContent(outputs) || hasContent(inputs)) {
          const midiAccess = {
            inputs: inputs.map((e) => e.name),
            outputs: outputs.map((e) => e.name)
          }
          dispatch(initMidiAccessOk({ midiAccess }))
          resolve(midiAccess)
        } else {
          resolve(dispatch(initFailed('No Midi Output available.')))
        }
      })
    })
  }
}

function findCcListeners(sliderList) {
  return findByElementType(['LABEL', 'SLIDER_HORZ', 'SLIDER', 'BUTTON_CC', 'ROTARY_KNOB'], sliderList)
}

function findNoteListeners(sliderList) {
  return findByElementType(['BUTTON', 'BUTTON_TOGGLE'], sliderList)
}

function findByElementType(arrayOfTypes, array) {
  return array.reduce((acc, cur) => {
    const { driverNameInput, midiChannelInput, listenToCc, type } = cur
    if (arrayOfTypes.includes(type)) {
      const cc = ((acc[driverNameInput] || [])[midiChannelInput] || [])
      return merge(acc, {
        [driverNameInput]: {
          [midiChannelInput || 'None']: [...new Set([...cc, ...listenToCc])]
        }
      })
    } else {
      return acc
    }
  }, {})
}
function hasContent(arr) {
  return arr.length > 0
}

function registerCcListeners(listenersObj, name, input, dispatch, globalMidiInputDelay, listenToAllChannels) {
  Object.keys(listenersObj).forEach((driverNameIn) => {
    const enty = listenersObj[driverNameIn]
    if (driverNameIn !== 'None') {
      if (driverNameIn === name) {
        const midiChIn = Object.keys(enty)
        // const cCs = enty[midiChIn]

        const midiEventMapper = ({ value, channel, controller: { number } }) => {
          const obj = {
            isNoteOn: undefined,
            val: value,
            cC: number,
            channel,
            driver: name
          }
          // const myAction = (payload) => ({
          //   type: 'sliders/MIDI_MESSAGE_ARRIVED',
          //   payload,
          //   meta: {
          //     raf: true,
          //     delay: globalMidiInputDelay
          //   }
          // })
          dispatch(midiMessageArrived(obj))
        }
        if (!input.hasListener('controlchange', midiChIn, debounce(midiEventMapper, globalMidiInputDelay))) {
          input.addListener(
            'controlchange',
            (!listenToAllChannels ? midiChIn : 'all'),
            debounce(midiEventMapper, globalMidiInputDelay)
          )
        }
      }
    }
  })
}

function registerNoteListeners(notesObj, name, input, dispatch, globalMidiInputDelay, listenToAllChannels) {
  Object.keys(notesObj).forEach((driverNameIn) => {
    const enty = notesObj[driverNameIn]
    if (driverNameIn !== 'None') {
      if (driverNameIn === name) {
        const midiChIn = Object.keys(enty)
        // const cCs = enty[midiChIn]

        const midiEventNoteOnMapper = (event) => {
          const { rawVelocity, channel, note: { number } } = event
          const obj = {
            isNoteOn: true,
            val: rawVelocity,
            cC: number,
            channel,
            driver: name
          }
          dispatch(midiMessageArrived(obj))
        }
        if (!input.hasListener('noteon', midiChIn, debounce(midiEventNoteOnMapper, globalMidiInputDelay))) {
          // console.log('ADDD LISTENERS NOTE ON', midiChIn, driverNameIn)
          input.addListener(
            'noteon',
            (!listenToAllChannels ? midiChIn : 'all'),
            debounce(midiEventNoteOnMapper, globalMidiInputDelay)
          )
        }

        const midiEventNoteOffMapper = (event) => {
          const { rawVelocity, channel, note: { number } } = event
          const obj = {
            isNoteOn: false,
            val: rawVelocity,
            cC: number,
            channel,
            driver: name
          }
          dispatch(midiMessageArrived(obj))
        }

        if (!input.hasListener('noteoff', midiChIn, debounce(midiEventNoteOffMapper, globalMidiInputDelay))) {
          // console.log('ADDD LISTENERS NOTE OFF', midiChIn, driverNameIn)
          input.addListener(
            'noteoff',
            (!listenToAllChannels ? midiChIn : 'all'),
            debounce(midiEventNoteOffMapper, globalMidiInputDelay)
          )
        }
      }
    }
  })
}
