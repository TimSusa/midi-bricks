import WebMIDI from 'webmidi'
import { debounce } from 'debounce'
import { Actions } from './slider-list'
import { merge } from 'lodash'

const {initMidiAccessPending, midiMessageArrived, initFailed, initMidiAccessOk} = Actions

export function initApp (mode) {
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
        const { sliders: { sliderList  } } = getState()
        const allCcListenersFound = findCcListeners(sliderList)
        const allNoteListenersFound = findNoteListeners(sliderList)

        inputs && Array.isArray(inputs) && WebMIDI.removeListener()
        inputs.forEach((input) => {
          const { name } = input
          input.removeListener()
          input.removeListener('controlchange')
          Object.keys(allCcListenersFound).forEach((driverNameIn) => {
            const enty = allCcListenersFound[driverNameIn]
            if (driverNameIn !== 'None') {
              if (driverNameIn === name) {
                const midiChIn = Object.keys(enty)
                // const cCs = enty[midiChIn]
                input.addListener(
                  'controlchange',
                  midiChIn,
                  debounce(({ value, channel, controller: { number } }) => {
                    const obj = {
                      isNoteOn: undefined,
                      val: value,
                      cC: number,
                      channel,
                      driver: name
                    }
                    const myAction = (payload) => ({
                      type: 'MIDI_MESSAGE_ARRIVED',
                      payload,
                      meta: {
                        raf: true
                      }
                    })
                    dispatch(myAction(obj))
                  }, 2)
                )
              }
            }
          })

          input.removeListener('noteon')
          input.removeListener('noteoff')

          Object.keys(allNoteListenersFound).forEach((driverNameIn) => {
            const enty = allNoteListenersFound[driverNameIn]
            if (driverNameIn !== 'None') {
              if (driverNameIn === name) {
                const midiChIn = Object.keys(enty)
                // const cCs = enty[midiChIn]
                input.addListener(
                  'noteon',
                  midiChIn,
                  debounce((event) => {
                    const {rawVelocity, channel, note: { number }} = event
                    const obj = {
                      isNoteOn: true,
                      val: rawVelocity,
                      cC: number,
                      channel,
                      driver: name
                    }
                    dispatch(midiMessageArrived(obj))
                  }, 5)
                )
                input.addListener(
                  'noteoff',
                  midiChIn,
                  debounce((event) => {
                    const {rawVelocity, channel, note: { number }} = event
                    const obj = {
                      isNoteOn: false,
                      val: rawVelocity,
                      cC: number,
                      channel,
                      driver: name
                    }
                    dispatch(midiMessageArrived(obj))
                  }, 5)
                )
              }
            }
          })
        })
        if (hasContent(outputs) || hasContent(inputs)) {
          const midiAccess = {
            inputs: inputs.map((e) => e.name),
            outputs: outputs.map((e) => e.name)
          }
          dispatch(initMidiAccessOk({ midiAccess}))
          resolve(midiAccess)
        } else {
          resolve(dispatch(initFailed('No Midi Output available.')))
        }
      })
    })
  }
}

function findCcListeners (sliderList) {
  return findByElementType(['LABEL', 'SLIDER_HORZ', 'SLIDER', 'BUTTON_CC'], sliderList)
}

function findNoteListeners (sliderList) {
  return findByElementType(['BUTTON', 'BUTTON_TOGGLE'], sliderList)
}

function findByElementType (arrayOfTypes, array) {
  return array.reduce((acc, cur) => {
    const { driverNameInput, midiChannelInput, listenToCc, type } = cur
    if (arrayOfTypes.includes(type)) {
      const cc = ((acc[driverNameInput] || [])[midiChannelInput] || [])
      return merge(acc, {
        [driverNameInput]: {
          [midiChannelInput || 'None']: Array.from(new Set([...cc, ...listenToCc]))
        }
      })
    }else {
      return acc
    }
  }, {})
}
function hasContent (arr) {
  return arr.length > 0
}
