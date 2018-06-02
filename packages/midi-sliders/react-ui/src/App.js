import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';

import ChannelStripList from './channel-strip-list/ChannelStripList'
import './App.css'

const CC_MIDI_START_VAL = 60

class App extends Component {
  state = {
    sliderEntries: [{
      label: 'label',
      val: 50,
      midiCC: CC_MIDI_START_VAL,
      outputId: '',
      isNoteOn: false,
      midiChannel: 1
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

  componentDidMount() {
    const tmp = window.localStorage.getItem('slider-entries')
    if (!tmp) {
      console.warn('Could not load from local storage. Settings not found.')
      return
    }
    console.log(tmp);
    const me = JSON.parse(tmp)
    this.setState({ sliderEntries: me })

    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );

    // saves if component has a chance to unmount
    this.saveStateToLocalStorage();
}

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Typography
          className={classes.heading}
          variant="display2"
          gutterBottom>
          MIDI Sliders
        </Typography>
        <Button
          variant='raised'
          className={this.props.classes.button}
          onClick={this.addSlider}>
          <Typography
            variant="caption">
            add slider
          </Typography>
        </Button>
        <ChannelStripList
          entries={this.state.sliderEntries}
          availableDrivers={this.state.availableDrivers}
          handleInputLabel={this.handleInputLabel}
          handleSliderChange={this.handleSliderChange}
          handleNoteTrigger={this.handleNoteTrigger}
          handleNoteToggle={this.handleNoteToggle}
          handleCcChange={this.handleCcChange}
          handleDriverSelectionChange={this.handleDriverSelectionChange}
          handleMidiChannelChange={this.handleMidiChannelChange}
          handleRemoveClick={this.handleRemoveClick}
        />
      </div>
    )
  }



  handleNoteToggle = (idx, e) => {
    let { sliderEntries } = this.state
    sliderEntries[idx].isNoteOn = !sliderEntries[idx].isNoteOn

    const {
      output,
      noteOn, 
      noteOff
    } = this.getMidiOutputNoteOnOf(idx)

    if (sliderEntries[idx].isNoteOn) {
      output.send(noteOn);
    } else {
      output.send(noteOff);
    }
    this.setState({ sliderEntries })
  }

  handleNoteTrigger = (idx, e) => {
    const {
      output,
      noteOn, 
      noteOff
    } = this.getMidiOutputNoteOnOf(idx)

    output.send(noteOn);
    setTimeout(
      function () {
        output.send(noteOff);
      },
      100
    );
  }

  getMidiOutputNoteOnOf = (idx) => {
    const {sliderEntries} = this.state
    const val = sliderEntries[idx].val
    const midiCC = sliderEntries[idx].midiCC
    const outputId = sliderEntries[idx].outputId
    const noteOn = [0x8f + parseInt(sliderEntries[idx].midiChannel, 10), midiCC, parseInt(val, 10)];
    const noteOff = [0x7f + parseInt(sliderEntries[idx].midiChannel, 10), midiCC, parseInt(val, 10)];
    const output = this.state.midiAccess.outputs.get(outputId);

    return {
      output,
      noteOn, 
      noteOff
    }
  }

  handleInputLabel = (idx, e) => {
    let tmp = this.state.sliderEntries
    tmp[idx].label = e.target.value
    this.setState({ sliderEntries: tmp })
  }

  handleDriverSelectionChange = (idx, e) => {
    let tmp = this.state.sliderEntries
    tmp[idx].outputId = e.target.value
    this.setState({ sliderEntries: tmp })
  }

  handleRemoveClick = (idx) => {
    let sliderEntries = this.state.sliderEntries
    if (idx > -1) {
      sliderEntries.splice(idx, 1)
    }
    this.setState({
      sliderEntries
    })
  }

  handleCcChange = (e) => {
    let sliderEntries = this.state.sliderEntries
    const tmp = e.target.name.split('-')
    const idx = tmp[tmp.length - 1]
    sliderEntries[idx].midiCC = e.target.value
    this.setState({ sliderEntries })
  }

  handleMidiChannelChange = (idx, e) => {
    let {sliderEntries} = this.state
    sliderEntries[idx].midiChannel = e.target.value
    this.setState({
      sliderEntries
    })
  }

  addSlider = () => {
    const sliderEntries = this.state.sliderEntries || []
    const entry = {
      label: 'label' + (sliderEntries.length + 1),
      val: 80,
      midiCC: parseInt(sliderEntries.length > 0 ? sliderEntries[sliderEntries.length - 1].midiCC : 59, 10) + 1, //count up last entry,
      outputId: this.state.availableDrivers[0].outputId,
      midiChannel: 1
    }

    const newEntries = [...sliderEntries, entry]
    this.setState({
      sliderEntries: newEntries
    })
  }

  handleSliderChange = (val, idx) => {
    let sliderEntries = this.state.sliderEntries
    sliderEntries[idx].val = val
    const midiCC = sliderEntries[idx].midiCC
    const outputId = this.state.sliderEntries[idx].outputId
    var ccMessage = [0xaf + parseInt(sliderEntries[idx].midiChannel, 10), midiCC, parseInt(val, 10)];
    var output = this.state.midiAccess.outputs.get(outputId);
    output.send(ccMessage);  //omitting the timestamp means send immediately.
    this.setState({
      sliderEntries
    })
  }

  saveStateToLocalStorage = () => {
    window.localStorage.setItem('slider-entries', JSON.stringify(this.state.sliderEntries))
  }

  onMIDISuccess = (midiAccess) => {
    this.setState({ midiAccess })
    this.listInputsAndOutputs()

    var inputs = midiAccess.inputs
    // var outputs = midiAccess.outputs

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
    // var note = message.data[1]
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
      default: 
        
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
    for (var outputEntry of midiAccess.outputs) {
      var output = outputEntry[1]
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

const styles = theme => ({
  root: {
    textAlign: 'center'
  },
  heading: {
    marginTop: theme.spacing.unit * 2
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    width: 100,
    margin: theme.spacing.unit,
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fonWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  },
  caption: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fonWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  }
});

// export default App
export default withRoot(withStyles(styles)(App));