import WebMIDI from 'webmidi'
import { withStyles, Typography } from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../actions/slider-list.js'
import ChannelStripList from '../components/channel-strip-list/ChannelStripList'
import GlobalSettingsPage from './GlobalSettingsPage.jsx'

class MidiSlidersPage extends React.PureComponent {
  state = {
    open: false,
    hasMidi: true
  };

  constructor(props) {
    super(props)
    WebMIDI.enable((err) => {
      if (err) {
        window.alert("Midi could not be enabled.", err);
        this.setState({ hasMidi: false })
      }
      const { inputs, outputs } = WebMIDI

      const midiAccess = {
        inputs,
        outputs
      }
      this.props.actions.initMidiAccess({ midiAccess })
      let driverNames = []
      this.props.sliderList.forEach((entry) => {
        if (entry.listenToCc && entry.listenToCc.length > 0) {
          if (!driverNames.includes(entry.driverName)) {
            driverNames.push(entry.driverName)
          }
        }
      })

      inputs.forEach(input => {
        input.removeListener()
        if (driverNames.includes(input.name)) {
          input.addListener('controlchange', 'all', ({ data, value, channel, controller: { number } }) => {
            const obj = { midiMessage: data, isNoteOn: undefined, val: value, cC: number, channel, driver: input.name }
            this.props.actions.midiMessageArrived(obj)
          })
          input.addListener('noteoff', 'all', ({ data, value, channel, note }) => {
            const obj = { midiMessage: data, isNoteOn: false, val: value, cC: note, channel, driver: input.name }
            this.props.actions.midiMessageArrived(obj)
          })
          input.addListener('noteon', 'all', ({ data, value, channel, note }) => {
            const obj = { midiMessage: data, isNoteOn: true, val: value, cC: note, channel, driver: input.name }
            this.props.actions.midiMessageArrived(obj)
          })
        }
      })
    })
  }

  render() {
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

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}
function mapStateToProps({ viewSettings, sliders: { sliderList } }) {
  return {
    viewSettings,
    sliderList
  }
}
export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MidiSlidersPage)))
