import { Drawer } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Home from './pages/Home'
import { bindActionCreators } from 'redux'
import { Actions as MidiSlidersAction } from './actions/slider-list.js'
import { Actions as ViewActions } from './actions/view-settings.js'
import { initApp } from './actions/init'

import MenuAppBar from './components/menu-app-bar/MenuAppBar'
import DrawerList from './components/drawer-list/DrawerList'
import Footer from './components/footer/Footer'
import { PAGE_TYPES } from './reducers/view-settings'
import { makeStyles } from '@material-ui/styles'

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

App.displayName = 'App'

App.propTypes = {
  actions: PropTypes.object,
  classes: PropTypes.object,
  initApp: PropTypes.func
}

function App(props) {
  const classes = makeStyles(styles, { withTheme: true })()
  const { actions = {}, initApp = () => {} } = props
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [appVersion, setAppVersion] = useState('')

  useEffect(() => {
    setAppVersion(process.env.REACT_APP_VERSION || 'unknown')
  }, [])

  return (
    <div className={classes.root}>
      <div className={classes.appBar}>
        <MenuAppBar handleDrawerToggle={() => setIsMobileOpen(!isMobileOpen)} />
        <Drawer
          variant='temporary'
          anchor={'left'}
          open={isMobileOpen}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={() => setIsMobileOpen(!isMobileOpen)}
          ModalProps={{
            keepMounted: true // Better open performance on mobile .
          }}
        >
          <DrawerList
            onFileChange={onFileChange.bind(
              this,
              actions,
              initApp,
              setIsMobileOpen
            )}
            handleSaveFile={handleSaveFile.bind(this, props, setIsMobileOpen)}
            handleResetSliders={handleResetSliders.bind(
              this,
              props,
              setIsMobileOpen
            )}
            togglePage={togglePage.bind(this, props)}
            classes={classes}
            onClose={() => setIsMobileOpen(!isMobileOpen)}
            version={appVersion}
          />
        </Drawer>
        <Home />

        {!window.location.href.endsWith('global') && <Footer />}
      </div>
    </div>
  )
}

async function onFileChange(
  actions,
  initApp,
  setIsMobileOpen,
  { presetName, content },
  e
) {
  actions.deleteFooterPages()
  window.localStorage.clear()

  // will load content to slider-list-reducer
  actions.loadFile({ presetName, content })

  const {
    viewSettings = {},
    viewSettings: { availableDrivers } = {},
    sliders: { sliderList } = {}
  } = content
  const drivers = availableDrivers || {
    inputs: {
      None: {
        ccChannels: [],
        noteChannels: []
      }
    },
    outputs: {
      None: {
        ccChannels: [],
        noteChannels: []
      }
    }
  }

  // Will load content to view-settings-reducer
  sliderList && Array.isArray(sliderList)
    ? actions.updateViewSettings({
      viewSettings: { ...viewSettings, availableDrivers: drivers },
      sliderList: sliderList
    })
    : actions.updateViewSettings({
      viewSettings: { ...viewSettings, availableDrivers: drivers }
    })
  await initApp()
  actions.togglePage({
    pageType: PAGE_TYPES.GLOBAL_MODE
  })
  setIsMobileOpen(false)
}

function handleSaveFile(
  { viewSettings, sliders, actions: { saveFile } },
  setIsMobileOpen
) {
  saveFile({
    viewSettings,
    sliders
  })
  setIsMobileOpen(false)
}

function togglePage({ actions: { togglePage } }, pageType) {
  togglePage(pageType)
}

function handleResetSliders(
  { actions: { deleteAll, deleteFooterPages } },
  setIsMobileOpen
) {
  deleteFooterPages()
  deleteAll()
  setIsMobileOpen(false)
}

function mapStateToProps({ viewSettings, sliders }) {
  return {
    viewSettings,
    sliders
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSlidersAction, ...ViewActions },
      dispatch
    ),
    initApp: bindActionCreators(initApp, dispatch)
  }
}

function styles(theme) {
  return {
    root: {
      width: '100%',
      height: '100%',
      zIndex: 1
    },
    appFrame: {
      position: 'relative',
      display: 'flex',
      width: '100%',
      height: '100%'
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      position: 'absolute',
      right: 0,
      left: 0,
      margin: 0
    },
    navIconHide: {},
    drawerHeader: {
      ...theme.mixins.toolbar
    },
    drawerPaper: {
      width: 250,
      backgroundColor: 'white'
    },
    content: {
      backgroundColor: theme.palette.background.default,
      width: '100%',
      marginTop: theme.spacing(1)
    }
  }
}
