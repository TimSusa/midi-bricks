import React, { Component } from 'react'
import VolumeSlider from './VolumeSlider'
import './App.css'

const CC_MIDI_START_VAL = 60

class App extends Component {
  state = {
    sliderEntries: [{
      val: 50,
      midiCC: CC_MIDI_START_VAL
    }],
    midiAccess: {},
    outputId: ''
  }
  constructor(props) {
    super(props)
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: true })
        .then(this.onMIDISuccess, this.onMIDIFailure)
    } else {
      console.log('WebMIDI is not supported in this browser.')
    }
  }

  render() {
    return (
      <div className='App'>
        <h2>MIDI Sliders</h2>
        <button onClick={this.addSlider}>Add Slider</button>
        <div className='sliders'>
          {this.renderSliders()}
        </div>
      </div>
    )
  }

  renderSliders = () => {
    const entries = this.state.sliderEntries
    return entries.map((sliderEntry, idx) => {
      return (
        <div key={`slider-${idx}`}  >
        <VolumeSlider value={entries[idx].val} onChange={val => this.handleSliderChange(val, idx)} />
        CC: 
        <input id="number" type="number" name={`slider-name-${idx}`} value={entries[idx].midiCC} onChange={this.handleCcChange} />
      </div>
      )
    })
  }

  handleCcChange = (e) => {
    let newSliderEntries = this.state.sliderEntries
    const tmp = e.target.name.split('-')
    const idx = tmp[tmp.length - 1]
    newSliderEntries[idx].midiCC = e.target.value
    this.setState({ sliderEntries: newSliderEntries })
  }
  addSlider = () => {
    const oldEntries = this.state.sliderEntries
    
    const entry = {
      val: 50,
      midiCC: parseInt(oldEntries[oldEntries.length-1].midiCC) + 1 //count up last entry
    }

    const newEntries = [...oldEntries, entry]
    this.setState({
      sliderEntries: newEntries
    })

  }
  handleSliderChange = (val, idx) => {
    let newSliderEntries = this.state.sliderEntries
    newSliderEntries[idx].val = val

    this.setState({
      sliderEntries: newSliderEntries
    })
    const midiCC = this.state.sliderEntries[idx].midiCC
    var ccMessage = [0xb0, midiCC, parseInt(val)];
    var output = this.state.midiAccess.outputs.get(this.state.outputId);
    output.send(ccMessage);  //omitting the timestamp means send immediately.
  }

  onMIDISuccess = (midiAccess) => {
    this.setState({ midiAccess })

    this.listInputsAndOutputs()

    var inputs = midiAccess.inputs
    var outputs = midiAccess.outputs

    var inputIterators = inputs.values()
    var firstInput = inputIterators.next().value
    if (firstInput) {
      firstInput.onmidimessage = this.handleMidiMessage
    }

  }

  onMIDIFailure = () => {
    console.log('Could not access your MIDI devices.')
  }

  handleMidiMessage = (message) => {
    var command = message.data[0]
    var note = message.data[1]
    var velocity = (message.data.length > 2) ? message.data[2] : 0 // a velocity value might not be included with a noteOff command

    switch (command) {
      case 144: // noteOn
        if (velocity > 0) {
          // noteOn(note, velocity);
        } else {
          // noteOff(note);
        }
        break
      case 128: // noteOff
        // noteOff(note);
        break
      // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
    }
  }

  listInputsAndOutputs = () => {
    const midiAccess = this.state.midiAccess
    for (var entry of midiAccess.inputs) {
      var input = entry[1]
      console.log("Input port [type:'" + input.type + "'] id:'" + input.id +
        "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
        "' version:'" + input.version + "'")
    }

    for (var entry of midiAccess.outputs) {
      var output = entry[1]
      this.setState({ outputId: output.id })
      console.log("Output port [type:'" + output.type + "'] id:'" + output.id +
        "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
        "' version:'" + output.version + "'")
    }
  }


  // unused, but useful
  // midiMessageReceived = (ev) => {
  //   var cmd = ev.data[0] >> 4
  //   var channel = ev.data[0] & 0xf
  //   var noteNumber = ev.data[1]
  //   var velocity = 0
  //   if (ev.data.length > 2) { velocity = ev.data[2] }

  //   // MIDI noteon with velocity=0 is the same as noteoff
  //   if (cmd == 8 || ((cmd == 9) && (velocity == 0))) { // noteoff
  //     // noteOff(noteNumber);
  //   } else if (cmd == 9) { // note on
  //     // noteOn(noteNumber, velocity);
  //   } else if (cmd == 11) { // controller message
  //     // controller(noteNumber, velocity);
  //   } else {
  //     // probably sysex!
  //   }
  // }

}

export default App
