import React, { Component } from 'react'
import VolumeSlider from './VolumeSlider'
import './App.css'

const CC_MIDI_START_VAL = 60
const LABEL_START_VAL = 'label 0'

class App extends Component {
  state = {
    sliderEntries: [{
      label: 'label',
      val: 50,
      midiCC: CC_MIDI_START_VAL,
      outputId: '',
      isNoteOn: false
    }],
    midiAccess: {},
    availableDrivers: [{ outputId: '', name: '' }]
  }

  constructor(props) {
    super(props)
    this.detectChromeBrowser()

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: true })
        .then(this.onMIDISuccess, this.onMIDIFailure)
    } else {
      console.log('WebMIDI is not supported in this browser.')
    }
  }

  componentWillMount() {
    const tmp = window.localStorage.getItem('slider-entries')
    if (!tmp) {
      console.warn('Could not load from local storage. Settings not found.')
      return
    }
    console.log(tmp);
    const me = JSON.parse(tmp)
    this.setState({ sliderEntries: me })
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
    if (!entries) return
    return entries.map((sliderEntry, idx) => {
      return (
        <div key={`slider-${idx}`}>
          <input
            type='text'
            onChange={this.handleInputLabel.bind(this, idx)}
            value={this.state.sliderEntries[idx].label} />
          <VolumeSlider
            value={entries[idx].val}
            onChange={val => this.handleSliderChange(val, idx)} />
          <p>{entries[idx].val}</p>
          <button
            onClick={this.handleNoteTrigger.bind(this, idx)}>
            trigger Note On / Off
          </button>
          <button
            onClick={this.handleNoteToggle.bind(this, idx)}>
              toggle Note {entries[idx].isNoteOn ? 'Off ' : 'On'}
          </button>
          <input id="number" type="number" name={`slider-name-${idx}`} value={entries[idx].midiCC} onChange={this.handleCcChange} />

          <br />
          <select onChange={this.handleDriverSelectionChange.bind(this, idx)} value={this.state.sliderEntries[idx].outputId}>
            {this.renderDriverSelection()}
          </select>
          <br />
          <button onClick={this.handleRemoveClick.bind(this, idx)}>remove</button>
        </div>
      )
    })
  }

  handleNoteToggle = (idx, e) => {
    let { sliderEntries } = this.state
    sliderEntries[idx].isNoteOn = !sliderEntries[idx].isNoteOn

    const val = sliderEntries[idx].val
    const midiCC = sliderEntries[idx].midiCC
    const outputId = this.state.sliderEntries[idx].outputId
    const noteOn = [0x92, midiCC, parseInt(val)];
    const noteOff = [0x82, midiCC, parseInt(val)];
    const output = this.state.midiAccess.outputs.get(outputId);

    if (sliderEntries[idx].isNoteOn) {
      output.send(noteOn);
    } else {
      output.send(noteOff);
    }
    this.setState({ sliderEntries })
  }

  handleNoteTrigger = (idx, e) => {
    const sliderEntries = this.state.sliderEntries
    const val = sliderEntries[idx].val
    const midiCC = sliderEntries[idx].midiCC
    const outputId = this.state.sliderEntries[idx].outputId
    const noteOn = [0x92, midiCC, parseInt(val)];
    const noteOff = [0x82, midiCC, parseInt(val)];
    const output = this.state.midiAccess.outputs.get(outputId);

    output.send(noteOn);
    setTimeout(
      function () {
        output.send(noteOff);
      },
      100
    );
  }

  handleInputLabel = (idx, e) => {
    let tmp = this.state.sliderEntries
    tmp[idx].label = e.target.value
    this.setState({ sliderEntries: tmp }, () => this.saveToLocalStorage())
  }

  renderDriverSelection = () => {
    return this.state.availableDrivers.map((item, idx) => {
      return (
        <option key={`driver-${idx}`} value={item.outputId}>{item.name}</option>
      )
    })
  }

  handleDriverSelectionChange = (idx, e) => {
    console.log('handledriverselectionchange ', idx, e.target.value);
    let tmp = this.state.sliderEntries
    tmp[idx].outputId = e.target.value
    this.setState({ sliderEntries: tmp }, () => this.saveToLocalStorage())
  }

  handleRemoveClick = (idx) => {
    let sliderEntries = this.state.sliderEntries
    if (idx > -1) {
      sliderEntries.splice(idx, 1)
    }
    this.setState({
      sliderEntries
    }, this.saveToLocalStorage())
  }

  handleCcChange = (e) => {
    let sliderEntries = this.state.sliderEntries
    const tmp = e.target.name.split('-')
    const idx = tmp[tmp.length - 1]
    sliderEntries[idx].midiCC = e.target.value
    this.setState({ sliderEntries }, this.saveToLocalStorage())
  }

  addSlider = () => {
    const sliderEntries = this.state.sliderEntries || []
    const entry = {
      label: 'label' + (sliderEntries.length + 1),
      val: 80,
      midiCC: parseInt(sliderEntries.length > 0 ? sliderEntries[sliderEntries.length - 1].midiCC : 59) + 1, //count up last entry,
      outputId: this.state.availableDrivers[0].outputId
    }

    const newEntries = [...sliderEntries, entry]
    this.setState({
      sliderEntries: newEntries
    }, () => this.saveToLocalStorage())
  }

  handleSliderChange = (val, idx) => {
    let sliderEntries = this.state.sliderEntries
    sliderEntries[idx].val = val
    const midiCC = sliderEntries[idx].midiCC
    const outputId = this.state.sliderEntries[idx].outputId
    var ccMessage = [0xb0, midiCC, parseInt(val)];
    var output = this.state.midiAccess.outputs.get(outputId);
    output.send(ccMessage);  //omitting the timestamp means send immediately.
    this.setState({
      sliderEntries
    }, this.saveToLocalStorage())
  }

  saveToLocalStorage = () => {
    window.localStorage.setItem('slider-entries', JSON.stringify(this.state.sliderEntries))
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
    let availableDrivers = []
    for (var entry of midiAccess.outputs) {
      var output = entry[1]
      console.log("Output port [type:'" + output.type + "'] id:'" + output.id +
        "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
        "' version:'" + output.version + "'")

      availableDrivers.push({ outputId: output.id, name: output.name })
    }
    this.setState({ availableDrivers })
  }

  detectChromeBrowser = () => {
    // please note, 
    // that IE11 now returns undefined again for window.chrome
    // and new Opera 30 outputs true for window.chrome
    // and new IE Edge outputs to true now for window.chrome
    // and if not iOS Chrome check
    // so use the below updated condition
    var isChromium = window.chrome;
    var winNav = window.navigator;
    var vendorName = winNav.vendor;
    var isOpera = typeof window.opr !== "undefined";
    var isIEedge = winNav.userAgent.indexOf("Edge") > -1;
    var isIOSChrome = winNav.userAgent.match("CriOS");

    if (isIOSChrome) {
      console.log('is Google Chrome on IOS');
      alert('sry, is Google Chrome on IOS');
    } else if (
      isChromium !== null &&
      typeof isChromium !== "undefined" &&
      vendorName === "Google Inc." &&
      isOpera === false &&
      isIEedge === false
    ) {
      console.log('is Google Chrome :-)');
    } else {
      console.log('not Google Chrome');
      alert('Sry. This App will only work with Google Chrome Browser.');
    }
  }
}

export default App
