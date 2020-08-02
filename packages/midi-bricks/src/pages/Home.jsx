import { makeStyles, useTheme } from '@material-ui/styles'
import React, { useEffect, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { initApp } from '../actions/init.js'
import { Actions as MidiSliderActions } from '../actions/slider-list.js'
import { Actions as ViewStuff } from '../actions/view-settings.js'
// import ChannelStripList from '../components/channel-strip-list/ChannelStripList'
// import ApplicationSettingsPage from '../components/ApplicationSettings'
import { PAGE_TYPES } from '../reducers'

export default connect(mapStateToProperties, mapDispatchToProperties)(Home)

Home.propTypes = {
  classes: PropTypes.object,
  viewSettings: PropTypes.object,
  initApp: PropTypes.func
}

function Home(props) {
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme), { useTheme: true })()

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
    const GlobalSettingsPage = React.lazy(() =>
      import('./GlobalSettingsPage.jsx')
    )
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <GlobalSettingsPage />
      </Suspense>
    )
  } else if (pageType === PAGE_TYPES.MIDI_DRIVER_MODE) {
    const MidiDriversSettingsPage = React.lazy(() =>
      import('./MidiDriversSettingsPage.jsx')
    )
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <MidiDriversSettingsPage />
      </Suspense>
    )
  }
  //  else if (pageType === PAGE_TYPES.VIEW_SETTINGS_MODE) {
  //   return <ApplicationSettingsPage />
  // }
  else if (pageType === PAGE_TYPES.HOME_MODE) {
    const ChannelStripList = React.lazy(() =>
      import('../components/channel-strip-list/ChannelStripList')
    )
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div
          className={classes.root}
          style={isLiveMode ? preventScrollStyle : {}}
        >
          <ChannelStripList />
        </div>
      </Suspense>
    )
  }
}

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
      paddingTop: theme.spacing(4)
    }
  }
}
