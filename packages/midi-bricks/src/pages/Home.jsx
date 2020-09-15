import { makeStyles, useTheme } from '@material-ui/styles'
import React, { useEffect, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import { initApp } from '../global-state/actions/init.js'
import ChannelStripList from '../components/channel-strip-list/ChannelStripList'
import { PAGE_TYPES } from '../reducers'

export default connect(null, mapDispatchToProperties)(Home)

Home.propTypes = {
  classes: PropTypes.object,
  initApp: PropTypes.func
}

function Home(props) {
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme), { useTheme: true })()

  const { initApp: initAppLocal } = props

  const pageType = useSelector(
    (state) => state.viewSettings.pageType || PAGE_TYPES.HOME_MODE
  )
  const isLiveMode = useSelector(
    (state) => state.viewSettings.isLiveMode || false
  )

  useEffect(() => {
    async function initAsync() {
      await initAppLocal()
    }

    if (pageType !== PAGE_TYPES.HOME_MODE) {
      return
    }
    initAsync()
    return () => {}
  }, [initAppLocal, pageType])

  const objLM = {
    height: 'calc(100vh - 66px)',
    overflowY: 'hidden'
  }
  const objNLM = {
    height: 'calc(100vh - 66px - 64px)',
    overflowY: 'hidden'
  }

  const preventScrollStyle = isLiveMode ? objLM : objNLM

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
  } else if (pageType === PAGE_TYPES.HOME_MODE) {
    return (
      <div
        className={classes.root}
        style={isLiveMode ? preventScrollStyle : {}}
      >
        <ChannelStripList />
      </div>
    )
  } else {
    return <div>NOK!</div>
  }
}

function mapDispatchToProperties(dispatch) {
  return {
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
