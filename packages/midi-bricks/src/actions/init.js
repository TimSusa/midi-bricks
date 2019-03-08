import WebMIDI from 'webmidi'
import { Actions } from './slider-list'

const { initPending, midiMessageArrived, initFailed, initMidiAccess } = Actions

export function initApp(mode) {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      WebMIDI.disable()

      dispatch(initPending('start'))

      WebMIDI.enable(err => {
        if (err) {
          window.alert('Midi could not be enabled.', err)
          reject(dispatch(initFailed('Midi could not be enabled.')))
        }
        const { inputs = [], outputs = [] } = WebMIDI

        const midiAccess = {
          inputs,
          outputs,
        }

        const {
          sliders: { sliderList },
          viewSettings: {
            availableDrivers: { inputs: availableInputs } = {
              inputs: {
                None: {
                  ccChannels: [],
                  noteChannels: [],
                },
              },
            },
          },
        } = getState()
        inputs &&
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
              hasContent(ccArr) &&
              mode !== 'all'
            ) {
              console.log('Add cc listener ', name, ' ', ccArr)
              input.removeListener('controlchange')
              input.addListener(
                'controlchange',
                ccChannels,
                ({ value, channel, controller: { number } }) => {
                  const obj = {
                    isNoteOn: undefined,
                    val: value,
                    cC: number,
                    channel,
                    driver: name,
                  }
                  if (ccArr.includes(number)) {
                    dispatch(midiMessageArrived(obj))
                  }
                }
              )
            } else {
              input.removeListener('controlchange')
              input.addListener(
                'controlchange',
                ccChannels,
                ({ value, channel, controller: { number } }) => {
                  const obj = {
                    isNoteOn: undefined,
                    val: value,
                    cC: number,
                    channel,
                    driver: name,
                  }
                  console.log('cc all')
                  dispatch(midiMessageArrived(obj))
                }
              )
            }
            if (
              Array.isArray(noteChannels) &&
              hasContent(noteChannels) &&
              hasContent(ccArr) &&
              mode !== 'all'
            ) {
              console.log('Add note listener ', name, ' ', ccArr)
              input.removeListener('noteon')
              input.addListener('noteon', noteChannels, event => {
                const {
                  rawVelocity,
                  channel,
                  note: { number },
                } = event
                const obj = {
                  isNoteOn: true,
                  val: rawVelocity,
                  cC: number,
                  channel,
                  driver: name,
                }
                if (ccArr.includes(number)) {
                  dispatch(midiMessageArrived(obj))
                }
              })
              input.removeListener('noteoff')
              input.addListener('noteoff', noteChannels, event => {
                const {
                  rawVelocity,
                  channel,
                  note: { number },
                } = event
                const obj = {
                  isNoteOn: false,
                  val: rawVelocity,
                  cC: number,
                  channel,
                  driver: name,
                }
                if (ccArr.includes(number)) {
                  dispatch(midiMessageArrived(obj))
                }
              })
            } else {
              input.removeListener('noteon')
              input.addListener('noteon', noteChannels, event => {
                const {
                  rawVelocity,
                  channel,
                  note: { number },
                } = event
                const obj = {
                  isNoteOn: true,
                  val: rawVelocity,
                  cC: number,
                  channel,
                  driver: name,
                }
                console.log('noteon all')
                dispatch(midiMessageArrived(obj))
              })
              input.removeListener('noteoff')
              input.addListener('noteoff', noteChannels, event => {
                const {
                  rawVelocity,
                  channel,
                  note: { number },
                } = event
                const obj = {
                  isNoteOn: false,
                  val: rawVelocity,
                  cC: number,
                  channel,
                  driver: name,
                }
                console.log('noteoff all')
                dispatch(midiMessageArrived(obj))
              })
            }
          })
        if (hasContent(outputs)) {
          resolve(dispatch(initMidiAccess({ midiAccess })))
        } else {
          reject(dispatch(initFailed('No Midi Output available.')))
        }
      })
    })
  }
}

const hasContent = arr => arr.length > 0
