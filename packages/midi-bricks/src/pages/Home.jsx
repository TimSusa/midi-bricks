import { makeStyles, useTheme } from '@material-ui/styles'

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { initApp } from '../actions/init.js'
import { Actions as MidiSliderActions } from '../actions/slider-list.js'
import { Actions as ViewStuff } from '../actions/view-settings.js'
import ChannelStripList from '../components/channel-strip-list/ChannelStripList'
import GlobalSettingsPage from './GlobalSettingsPage.jsx'
import MidiDriversSettingsPage from './MidiDriversSettingsPage'
import ApplicationSettingsPage from '../components/ApplicationSettings'
import { PAGE_TYPES } from '../reducers'

export default connect(
  mapStateToProperties,
  mapDispatchToProperties
)(Home)

Home.propTypes = {
  classes: PropTypes.object,
  viewSettings: PropTypes.object,
  initApp: PropTypes.func
}

function Home(props) {
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this,theme), { useTheme: true })()

  const {
    viewSettings: { isLiveMode = false, pageType = PAGE_TYPES.HOME_MODE },
    initApp
  } = props
  useEffect(() => {
    async function initAsync() {
      await initApp()
    }

    if (pageType !== PAGE_TYPES.HOME_MODE) {
      return
    }
    console.log('Re-Init MIDI')
    initAsync()
    return () => {}
  }, [initApp, pageType])

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
    return <ApplicationSettingsPage />
  } else if (pageType === PAGE_TYPES.HOME_MODE) {
    return (
      <div
        className={classes.root}
        style={isLiveMode ? preventScrollStyle : {}}
      >
        <ChannelStripList />
      </div>
    )
  }
}

function mapStateToProperties({
  viewSettings,
  sliders: { isMidiFailed }
}) {
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

function styles(theme) {
  return {
    root: {
      textAlign: 'center',
      width: '100%',
      overflowX: 'hidden',
      backgroundColor: theme.palette.background.default
    },
    heading: {
      marginTop: theme.spacing(2)
    },
    noMidiTypography: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
    }
  }
}
