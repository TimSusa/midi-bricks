import { withStyles, Typography } from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'
import ChannelStripList from '../components/channel-strip-list/ChannelStripList'
import GlobalSettingsPage from './GlobalSettingsPage.jsx'

class MidiSlidersPage extends React.PureComponent {
  render () {
    const { classes, isMidiFailed, viewSettings: { isLayoutMode, isLiveMode, isSettingsMode, isGlobalSettingsMode } } = this.props

    const preventScrollStyle = isLiveMode ? {
      height: 'calc(100vh - 66px)',
      overflowY: 'hidden'
    } : {
      height: 'calc(100vh - 66px - 64px)',
      overflowY: 'hidden'
    }

    if (isMidiFailed) {
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
    } else if (isGlobalSettingsMode) {
      return (
        <GlobalSettingsPage />
      )
    } else {
      return (
        <div
          className={this.props.classes.root}
          style={(isLayoutMode || isSettingsMode) ? {} : preventScrollStyle}
        >
          <ChannelStripList />
        </div>
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

function mapStateToProps ({ viewSettings, sliders: { isMidiFailed } }) {
  return {
    viewSettings,
    isMidiFailed
  }
}
export default (withStyles(styles)(connect(mapStateToProps, null)(MidiSlidersPage)))
