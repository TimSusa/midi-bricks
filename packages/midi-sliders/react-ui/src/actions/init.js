import WebMIDI from 'webmidi'
import {
  initPending,
  midiMessageArrived,
  initFailed,
  initMidiAccess,
} from './slider-list'
import { debounce } from 'lodash'

export function initApp() {
  return function(dispatch, getState) {
    dispatch(initPending('start'))
    WebMIDI.disable()
    WebMIDI.enable(err => {
      if (err) {
        window.alert('Midi could not be enabled.', err)
        dispatch(initFailed('bad'))
      }
      const { inputs = [], outputs = [] } = WebMIDI
      if (!hasContent(outputs)) return

      const midiAccess = {
        inputs,
        outputs,
      }
      if (hasContent(outputs)) {
        dispatch(initMidiAccess({ midiAccess }))
      } else {
        dispatch(initFailed('bad'))
      }
      const {
        sliders: { sliderList },
        viewSettings: {
          availableDrivers: { inputs: availableInputs },
        },
      } = getState()

      Array.isArray(inputs) &&
        inputs.forEach(input => {
          const { name } = input
          const { ccChannels, noteChannels } = availableInputs[name] || {
            ccChannels: [],
            noteChannels: [],
          }
          let ccArr = []
          sliderList &&
            sliderList.forEach(entry => {
              const { driverNameInput = '', listenToCc = [] } = entry

              if (name === driverNameInput) {
                listenToCc.forEach(listen => {
                  if (!ccArr.includes(listen)) {
                    ccArr.push(parseInt(listen, 10))
                  }
                })
              }
            })
          input.removeListener()
          if (
            Array.isArray(ccChannels) &&
            hasContent(ccChannels) &&
            hasContent(ccArr)
          ) {
            console.log('add cc listener ', name, ' ', ccArr)
            input.addListener(
              'controlchange',
              ccChannels,
              debounce(({ value, channel, controller: { number } }) => {
                if (ccArr.includes(number)) {
                  const obj = {
                    isNoteOn: undefined,
                    val: value,
                    cC: number,
                    channel,
                    driver: name,
                  }
                  dispatch(midiMessageArrived(obj))
                }
              }, 5)
            )
          }
          if (
            Array.isArray(noteChannels) &&
            hasContent(noteChannels) &&
            hasContent(ccArr)
          ) {
            console.log('add note listener ', name, ' ', ccArr)
            input.addListener(
              'noteon',
              noteChannels,
              debounce(event => {
                const {
                  rawVelocity,
                  channel,
                  note: { number },
                } = event
                if (ccArr.includes(number)) {
                  const obj = {
                    isNoteOn: true,
                    val: rawVelocity,
                    cC: number,
                    channel,
                    driver: name,
                  }
                  dispatch(midiMessageArrived(obj))
                }
              })
            )
            input.addListener(
              'noteoff',
              noteChannels,
              ({ rawVelocity, channel, note: { number } }) => {
                if (ccArr.includes(number)) {
                  const obj = {
                    isNoteOn: false,
                    val: rawVelocity,
                    cC: number,
                    channel,
                    driver: name,
                  }
                  dispatch(midiMessageArrived(obj))
                }
              },
              5
            )
          }
        })
    })
  }
}

const hasContent = arr => arr.length > 0
