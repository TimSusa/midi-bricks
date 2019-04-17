import WebMIDI from 'webmidi'
import { debounce } from 'lodash'
import { Actions } from './slider-list'

const { initPending, midiMessageArrived, initFailed, initMidiAccess } = Actions

export function initApp(mode) {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      WebMIDI.disable()
      dispatch(initPending('start'))

      WebMIDI.enable((err) => {
        if (err) {
          // eslint-disable-next-line no-alert
          window.alert('Midi could not be enabled.', err)
          reject(dispatch(initFailed('Midi could not be enabled.')))
        }
        const { inputs = [], outputs = [] } = WebMIDI
        const {
          sliders: { sliderList },
          viewSettings: {
            availableDrivers: { inputs: availableInputs } = {
              inputs: {
                None: {
                  ccChannels: [],
                  noteChannels: []
                }
              }
            }
          }
        } = getState()
        inputs && Array.isArray(inputs) && WebMIDI.removeListener()
        inputs.forEach((input) => {
          const { name } = input
          const { ccChannels, noteChannels } = availableInputs[name] || {
            ccChannels: [],
            noteChannels: []
          }
          let ccArr = []
          sliderList &&
            sliderList.forEach((entry) => {
              const { driverNameInput = '', listenToCc = [] } = entry

              if (name === driverNameInput) {
                listenToCc.forEach((listen) => {
                  if (!ccArr.includes(listen)) {
                    ccArr.push(parseInt(listen, 10))
                  }
                })
              }
            })
          input.removeListener()
          if (
            // eslint-disable-next-line no-constant-condition
            false &&
            Array.isArray(ccChannels) &&
            hasContent(ccChannels) &&
            hasContent(ccArr) &&
            mode !== 'all'
          ) {
            input.removeListener('controlchange')
            input.addListener(
              'controlchange',
              ccChannels,
              debounce(({ value, channel, controller: { number } }) => {
                const obj = {
                  isNoteOn: undefined,
                  val: value,
                  cC: number,
                  channel,
                  driver: name
                }
                if (ccArr.includes(number)) {
                  dispatch(midiMessageArrived(obj))
                }
              }, 5)
            )
          } else {
            input.removeListener('controlchange')
            //console.log('cc all')
            input.addListener(
              'controlchange',
              'all',
              debounce(({ value, channel, controller: { number } }) => {
                const obj = {
                  isNoteOn: undefined,
                  val: value,
                  cC: number,
                  channel,
                  driver: name
                }
                dispatch(midiMessageArrived(obj))
              }, 5)
            )
          }
          if (
            // eslint-disable-next-line no-constant-condition
            false &&
            Array.isArray(noteChannels) &&
            hasContent(noteChannels) &&
            hasContent(ccArr) &&
            mode !== 'all'
          ) {
            // eslint-disable-next-line no-console
            console.log('Add note listener', name, ' ', ccArr)
            input.removeListener('noteon')
            input.addListener(
              'noteon',
              noteChannels,
              debounce((event) => {
                const {
                  rawVelocity,
                  channel,
                  note: { number }
                } = event
                const obj = {
                  isNoteOn: true,
                  val: rawVelocity,
                  cC: number,
                  channel,
                  driver: name
                }
                if (ccArr.includes(number)) {
                  dispatch(midiMessageArrived(obj))
                }
              }, 5)
            )
            input.removeListener('noteoff')
            input.addListener(
              'noteoff',
              noteChannels,
              debounce((event) => {
                const {
                  rawVelocity,
                  channel,
                  note: { number }
                } = event
                const obj = {
                  isNoteOn: false,
                  val: rawVelocity,
                  cC: number,
                  channel,
                  driver: name
                }
                if (ccArr.includes(number)) {
                  dispatch(midiMessageArrived(obj))
                }
              }, 5)
            )
          } else {
            input.removeListener('noteon')
            //console.log('Add note listener ALL', name, ' ', ccArr)
            input.addListener(
              'noteon',
              'all',
              debounce((event) => {
                const {
                  rawVelocity,
                  channel,
                  note: { number }
                } = event
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
            input.removeListener('noteoff')
            //console.log('Add note off listener ALL', name, ' ', ccArr)
            input.addListener(
              'noteoff',
              'all',
              debounce((event) => {
                const {
                  rawVelocity,
                  channel,
                  note: { number }
                } = event
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
        })
        if (hasContent(outputs) || hasContent(inputs)) {
          const midiAccess = {
            inputs,
            outputs
          }
          resolve(dispatch(initMidiAccess({ midiAccess })))
        } else {
          reject(dispatch(initFailed('No Midi Output available.')))
        }
      })
    })
  }
}

function hasContent(arr) {
  return arr.length > 0
}
