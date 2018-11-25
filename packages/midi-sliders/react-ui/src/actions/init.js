import WebMIDI from 'webmidi'
import {initPending, midiMessageArrived, initFailed, initMidiAccess} from './slider-list'
import { STRIP_TYPE } from '../reducers/slider-list'

const {
  BUTTON,
  BUTTON_TOGGLE,
  LABEL,
  PAGE
} = STRIP_TYPE

export function initApp () {
  return function (dispatch, getState) {
    dispatch(initPending('start'))

    WebMIDI.enable((err) => {
      if (err) {
        window.alert('Midi could not be enabled.', err)
        dispatch(initFailed('bad'))
      }
      const { inputs, outputs } = WebMIDI

      const midiAccess = {
        inputs,
        outputs
      }
      dispatch(initMidiAccess({ midiAccess }))

      const {sliderList} = getState().sliders
      let driverNames = []
      sliderList && sliderList.forEach((entry) => {
        if (entry.listenToCc && entry.listenToCc.length > 0) {
          if (!driverNames.includes(entry.driverName)) {
            driverNames.push(entry.driverName)
          }
        }
      })

      inputs.forEach(input => {
        input.removeListener()
        if (driverNames.includes(input.name)) {
          let ccChannels = []
          let noteChannels = []
          sliderList && sliderList.forEach((entry) => {
            if (![BUTTON, BUTTON_TOGGLE, PAGE, LABEL].includes(entry.type)) {
              if (entry.midiChannelInput === 'all') {
                ccChannels = 'all'
              }
              if (Array.isArray(ccChannels) && !ccChannels.includes(entry.midiChannelInput)) {
                entry.midiChannelInput && ccChannels.push(parseInt(entry.midiChannelInput, 10))
              }
            } else if ([BUTTON, BUTTON_TOGGLE].includes(entry.type)) {
              if (entry.midiChannelInput === 'all') {
                noteChannels = 'all'
              }
              if (Array.isArray(noteChannels) && !noteChannels.includes(entry.midiChannelInput)) {
                entry.midiChannelInput && noteChannels.push(entry.midiChannelInput)
              }
            }
          })
          input.addListener('controlchange', ccChannels, ({ value, channel, controller: { number } }) => {
            const obj = { isNoteOn: undefined, val: value, cC: number, channel, driver: input.name }
            dispatch(midiMessageArrived(obj))
          })
          input.addListener('noteon', noteChannels, (event) => {
            const { rawVelocity, channel, note: { number } } = event
            const obj = { isNoteOn: true, val: rawVelocity, cC: number, channel, driver: input.name }
            dispatch(midiMessageArrived(obj))
          })
          input.addListener('noteoff', noteChannels, ({ rawVelocity, channel, note: { number } }) => {
            const obj = { isNoteOn: false, val: rawVelocity, cC: number, channel, driver: input.name }
            dispatch(midiMessageArrived(obj))
          })
        }
      })
    })
  }
}
