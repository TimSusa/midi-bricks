import { withStyles } from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiAccessAction from '../actions/midi-access.js'
import ChannelStripList from '../components/channel-strip-list/ChannelStripList'

class MidiSlidersPage extends React.Component {
  state = {
    open: false
  };

  constructor (props) {
    super(props)
    this.detectChromeBrowser()

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: true })
        .then(this.onMIDISuccess, this.onMIDIFailure)
    } else {
      window.alert('WebMIDI is not supported in this browser.')
    }
  }

  render () {
    return (
      <div className={this.props.classes.root}>
        <ChannelStripList />
      </div>
    )
  }

  onMIDISuccess = (midiAccess) => {
    this.props.actions.initMidiAccess({midiAccess})
  }

  onMIDIFailure = () => {
    window.alert('Could not access your MIDI devices.')
  }

  detectChromeBrowser = () => {
    var isChromium = window.chrome
    var winNav = window.navigator
    var vendorName = winNav.vendor
    var isOpera = typeof window.opr !== 'undefined'
    var isIEedge = winNav.userAgent.indexOf('Edge') > -1
    var isIOSChrome = winNav.userAgent.match('CriOS')

    if (isIOSChrome) {
      console.log('is Google Chrome on IOS')
      window.alert('sry, is Google Chrome on IOS')
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
      window.alert('Sry. This App will only work with Google Chrome Browser.')
    }
  }
}

const styles = theme => ({
  root: {
    textAlign: 'center',
    // background: theme.palette.primary.main,
    width: '100%'
  },
  heading: {
    marginTop: theme.spacing.unit * 2
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiAccessAction, dispatch)
  }
}

export default (withStyles(styles)(connect(null, mapDispatchToProps)(MidiSlidersPage)))
