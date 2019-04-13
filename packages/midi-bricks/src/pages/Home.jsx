import { withStyles } from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { initApp } from '../actions/init.js'
import { Actions as MidiSliderActions } from '../actions/slider-list.js'
import { Actions as ViewStuff } from '../actions/view-settings.js'
import ChannelStripList from '../components/channel-strip-list/ChannelStripList'
import GlobalSettingsPage from './GlobalSettingsPage.jsx'
import MidiDriversSettingsPage from './MidiDriversSettingsPage'
import GlobalViewSettingsPage from '../components/GlobalViewSettings'
import { PAGE_TYPES } from '../reducers/view-settings'

class Home extends React.PureComponent {
  async componentWillMount() {
    // track driver changes after browser reload
    await this.props.initApp()

    // Start at last set page
    const {
      viewSettings: { lastFocusedFooterButtonIdx }
    } = this.props
    const element = document.getElementById(
      `page-${lastFocusedFooterButtonIdx}`
    )
    element && element.scrollIntoView({ block: 'start' })
  }

  render() {
    const {
      viewSettings: {
        isLayoutMode = true,
        isLiveMode = false,
        isSettingsMode = false,
        pageType = PAGE_TYPES.HOME_MODE
      }
    } = this.props

    const preventScrollStyle = isLiveMode
      ? {
        height: 'calc(100vh - 66px)',
        overflowY: 'hidden'
      }
      : {
        height: 'calc(100vh - 66px - 64px)',
        overflowY: 'hidden'
      }

    if (pageType === PAGE_TYPES.GLOBAL_MODE) {
      return <GlobalSettingsPage />
    } else if (pageType === PAGE_TYPES.MIDI_DRIVER_MODE) {
      return <MidiDriversSettingsPage />
    } else if (pageType === PAGE_TYPES.VIEW_SETTINGS_MODE) {
      return <GlobalViewSettingsPage />
    } else if (pageType === PAGE_TYPES.HOME_MODE) {
      return (
        <div
          className={this.props.classes.root}
          style={isLayoutMode || isSettingsMode ? {} : preventScrollStyle}
        >
          <ChannelStripList />
        </div>
      )
    }
  }
}

const styles = (theme) => ({
  root: {
    textAlign: 'center',
    width: '100%',
    overflowX: 'hidden'
  },
  heading: {
    marginTop: theme.spacing(2)
  },
  noMidiTypography: {
    textAlign: 'center',
    paddingTop: theme.spacing(4)
  }
})

function mapStateToProperties({ viewSettings, sliders: { isMidiFailed } }) {
  return {
    viewSettings,
    isMidiFailed
  }
}
function mapDispatchToProperties(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSliderActions, ...ViewStuff },
      dispatch
    ),
    initApp: bindActionCreators(initApp, dispatch)
  }
}
export default withStyles(styles)(
  connect(
    mapStateToProperties,
    mapDispatchToProperties
  )(Home)
)
