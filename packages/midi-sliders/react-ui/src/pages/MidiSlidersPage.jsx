import { withStyles, Typography } from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../actions/slider-list.js'
import ChannelStripList from '../components/channel-strip-list/ChannelStripList'

class MidiSlidersPage extends React.PureComponent {
  state = {
    open: false,
    hasMidi: true
  };

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
    const { classes, viewSettings: { isLayoutMode, isLiveMode, isSettingsMode } } = this.props

    const preventScrollStyle = isLiveMode ? {
      height: 'calc(100vh - 64px)',
      overflowY: 'hidden'
    } : {
      height: 'calc(100vh - 64px - 64px)',
      overflowY: 'hidden'
    }

    if (this.state.hasMidi) {
      return (
        <div
          className={this.props.classes.root}
          style={(isLayoutMode || isSettingsMode) ? {} : preventScrollStyle}
        >
          <ChannelStripList />
        </div>
      )
    } else {
      return (
        <Typography
          variant='display1'
          className={classes.noMidiTypography}
        >
          Cannot find any available MIDI-Drivers to connect for.
          <br />
          We suggest to create at first a virtual midi driver or
          <br />
          plug in your favourite MIDI Device.
          <br />
          <br />
          After that, please reload the browser page to see the application in action like this:
          <br />
          <br />
          <img width='50%' alt='midi-sliders-screenshot' src='midi-sliders-screenshot.png' />
        </Typography>
      )
    }
  }

  onMIDISuccess = (midiAccess) => {
    if (midiAccess.outputs.size > 0) {
      this.props.actions.initMidiAccess({ midiAccess })

      if (this.props.sliderList.some((item) => item.listenToCc.length > 0)) {
        for (var input of midiAccess.inputs.values()) {
          input.onmidimessage = this.getMIDIMessage
        }
      }
    } else {
      this.setState({ hasMidi: false })
      console.warn('There are no midi-drivers available. Tip: Please create a virtual midi driver at first and then restart the application.')
    }
  }

  getMIDIMessage = (midiMessage) => {
    // only send action, if any cc listener is in list
    if (this.props.sliderList.some((item) => item.listenToCc.length > 0)) {
      const command = midiMessage.data[0]
      // var note = midiMessage.data[1]
      // a velocity value might not be included with a noteOff command
      const velocity = (midiMessage.data.length > 2) ? midiMessage.data[2] : 0

      switch (command) {
        case 144: // noteOn
          if (velocity > 0) {
            // console.log('note on ', note)
            this.props.actions.midiMessageArrived({ midiMessage, isNoteOn: true })
          } else {
            // console.log('note off ', note)
            this.props.actions.midiMessageArrived({ midiMessage, isNoteOn: false })
          }
          break
        case 128: // noteOff
          // console.log('note off ', note)
          this.props.actions.midiMessageArrived({ midiMessage, isNoteOn: false })
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

const styles = theme => ({
  root: {
    textAlign: 'center',
    width: '100%',
    overflowX: 'hidden'
  },
  heading: {
    marginTop: theme.spacing.unit * 2
  },
  noMidiTypography: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 4
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}
function mapStateToProps ({ viewSettings, sliderList }) {
  return {
    viewSettings,
    sliderList
  }
}
export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MidiSlidersPage)))
