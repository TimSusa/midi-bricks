import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import withRoot from './withRoot'

import ChannelStripList from './channel-strip-list/ChannelStripList'
import './App.css'

class App extends Component {
  state = {
    midiAccess: {},
    availableDrivers: [{ outputId: '', name: '' }]
  }

  constructor (props) {
    super(props)
    this.detectChromeBrowser()

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: true })
        .then(this.onMIDISuccess, this.onMIDIFailure)
    } else {
      console.log('WebMIDI is not supported in this browser.')
    }
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Typography
          className={classes.heading}
          variant='display2'
          gutterBottom>
          MIDI Sliders
        </Typography>
        <ChannelStripList
          availableDrivers={this.state.availableDrivers}
          midiAccess={this.state.midiAccess}
        />
      </div>
    )
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
    var isChromium = window.chrome
    var winNav = window.navigator
    var vendorName = winNav.vendor
    var isOpera = typeof window.opr !== 'undefined'
    var isIEedge = winNav.userAgent.indexOf('Edge') > -1
    var isIOSChrome = winNav.userAgent.match('CriOS')

    if (isIOSChrome) {
      console.log('is Google Chrome on IOS')
      alert('sry, is Google Chrome on IOS')
    } else if (
      isChromium !== null &&
      typeof isChromium !== 'undefined' &&
      vendorName === 'Google Inc.' &&
      isOpera === false &&
      isIEedge === false
    ) {
      console.log('is Google Chrome :-)')
    } else {
      console.log('not Google Chrome')
      alert('Sry. This App will only work with Google Chrome Browser.')
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
    margin: theme.spacing.unit
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
})

export default withRoot(withStyles(styles)(App))
