import React, {createContext} from 'react'
import { debounce } from 'lodash'

const MidiContext = createContext({})

export class MidiProvider extends React.Component {
  state = {
    hasMidi: true,
    midiAccess: null
  }

  constructor (props) {
    super(props)
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: true })
        .then(this.onMIDISuccess, this.onMIDIFailure)
    } else {
      window.alert('WebMIDI is not supported in this browser.')
    }
  }
  render () {
    const {children} = this.props
    return (
      <MidiContext.Provider value={{...this.state}}>
        {children}
      </MidiContext.Provider>
    )
  }

  onMIDISuccess = (midiAccess) => {
    if (midiAccess.outputs.size > 0) {
      // this.props.actions.initMidiAccess({ midiAccess })
      this.setState({midiAccess})
      // if (this.props.sliderList.some((item) => item.listenToCc.length > 0)) {
      //   for (var input of midiAccess.inputs.values()) {
      //     input.onmidimessage = this.getMIDIMessage
      //   }
      // }
    } else {
      this.setState({ hasMidi: false })
      console.warn('There are no midi-drivers available. Tip: Please create a virtual midi driver at first and then restart the application.')
    }
  }

  getMIDIMessage = (midiMessage) => {
    // only send action, if any cc listener is in list
    if (this.props.sliderList.some((item) => item.listenToCc.length > 0)) {
      const command = midiMessage.data[0]
      const note = (midiMessage.data.length > 1) ? midiMessage.data[1] : midiMessage.data[0]
      // a velocity value might not be included with a noteOff command
      const velocity = (midiMessage.data.length > 2) ? midiMessage.data[2] : 0

      switch (command) {
        case 144: // noteOn
          if (velocity > 0) {
            // console.log('note on ', note)
            this.props.actions.midiMessageArrived({ midiMessage, isNoteOn: true, cC: note })
          } else {
            // console.log('note off ', note)
            this.props.actions.midiMessageArrived({ midiMessage, isNoteOn: false, cC: note })
          }
          break
        case 128: // noteOff
          // console.log('note off ', note)
          this.props.actions.midiMessageArrived({ midiMessage, isNoteOn: false })
          break
        case 176: // CC
          const debounced = debounce(() => this.props.actions.midiMessageArrived({ midiMessage, isNoteOn: undefined, val: velocity, cC: note }), 5)
          debounced()
          break
        // we could easily expand this switch statement to cover other types of
        // commands such as controllers or sysex
        default:
          break
      }
    }
  }

  onMIDIFailure = () => {
    window.alert('Could not access your MIDI devices.')
  }
}

export const MidiConsumer = MidiContext.Consumer
