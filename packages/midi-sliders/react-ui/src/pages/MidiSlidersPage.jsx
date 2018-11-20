import { withStyles, Typography } from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../actions/slider-list.js'
import ChannelStripList from '../components/channel-strip-list/ChannelStripList'
import { debounce } from 'lodash'
import GlobalSettingsPage from './GlobalSettingsPage.jsx'

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
    const { classes, viewSettings: { isLayoutMode, isLiveMode, isSettingsMode, isGlobalSettingsMode } } = this.props

    const preventScrollStyle = isLiveMode ? {
      height: 'calc(100vh - 66px)',
      overflowY: 'hidden'
    } : {
      height: 'calc(100vh - 66px - 64px)',
      overflowY: 'hidden'
    }

    if (this.state.hasMidi) {
      if (isGlobalSettingsMode) {
        return (
          <GlobalSettingsPage />
        )
      }
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
      if (this.props.sliderList && this.props.sliderList.some((item) => item.listenToCc && item.listenToCc.length > 0)) {
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
    if (this.props.sliderList.some((item) => item.listenToCc && item.listenToCc.length > 0)) {
      const commandAndChannel = midiMessage.data[0]
      const note = midiMessage.data[1]

      // a velocity value might not be included with a noteOff command
      const velocity = (midiMessage.data.length > 2) ? midiMessage.data[2] : 0

      // Mask off the higher nibble (MIDI channel)
      const channel = (commandAndChannel & 0x0f) + 1

      // Mask off the lower nibble (Note On, Note Off or CC)
      const command = commandAndChannel & 0xf0
      switch (command) {
        case 0x90:
          if (velocity !== 0) { // if velocity != 0, this is a note-on message
            this.props.actions.midiMessageArrived({ midiMessage, isNoteOn: true, cC: note, channel })
          }
          break

        // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
        case 0x80:
          this.props.actions.midiMessageArrived({ midiMessage, isNoteOn: false, cC: note, channel })
          break

        case 0xb0:
          this.props.actions.midiMessageArrived({ midiMessage, isNoteOn: undefined, val: velocity, cC: note, channel })
          break

        default:
          // note off
          console.warn('fallen through')
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
function mapStateToProps ({ viewSettings, sliders: { sliderList } }) {
  return {
    viewSettings,
    sliderList
  }
}
export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MidiSlidersPage)))
