import { Drawer, withStyles } from '@material-ui/core'
import React, { useState } from 'react'
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

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
)

function mapStateToProps({ viewSettings, sliders }) {
  return {
    viewSettings,
    sliders,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSlidersAction, ...ViewActions },
      dispatch
    ),
    initApp: bindActionCreators(initApp, dispatch),
  }
}

function App(props) {
  const { actions, initApp } = props
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  return (
    <div className={props.classes.root}>
      <div className={props.classes.appBar}>
        <MenuAppBar handleDrawerToggle={() => setIsMobileOpen(!isMobileOpen)} />
        <Drawer
          variant="temporary"
          anchor={'left'}
          open={isMobileOpen}
          classes={{
            paper: props.classes.drawerPaper,
          }}
          onClose={() => setIsMobileOpen(!isMobileOpen)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
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
            classes={props.classes}
            onClose={() => setIsMobileOpen(!isMobileOpen)}
          />
        </Drawer>
        <Home />

        {!window.location.href.endsWith('global') && <Footer />}
      </div>
    </div>
  )
}

function styles(theme) {
  return {
    root: {
      width: '100%',
      height: '100%',
      zIndex: 1,
    },
    appFrame: {
      position: 'relative',
      display: 'flex',
      width: '100%',
      height: '100%',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      position: 'absolute',
      right: 0,
      left: 0,
      margin: 0,
    },
    navIconHide: {},
    drawerHeader: {
      ...theme.mixins.toolbar,
    },
    drawerPaper: {
      width: 250,
      backgroundColor: 'white',
    },
    content: {
      backgroundColor: theme.palette.background.default,
      width: '100%',
      marginTop: theme.spacing(1),
    },
  }
}

async function onFileChange(actions, initApp, setIsMobileOpen, e, results) {
  actions.deleteFooterPages()
  window.localStorage.clear()
  actions.loadFile(results) // Prepare foooterpages flush

  const files = results[0]
  const content = files[0].target.result
  const parsedJson = JSON.parse(content)
  const {
    viewSettings: { availableDrivers },
  } = parsedJson
  const drivers = availableDrivers || {
    inputs: {
      None: {
        ccChannels: [],
        noteChannels: [],
      },
    },
    outputs: {
      None: {
        ccChannels: [],
        noteChannels: [],
      },
    },
  }
  parsedJson.sliders.sliderList &&
    actions.updateViewSettings({
      viewSettings: { ...parsedJson.viewSettings, availableDrivers: drivers },
      sliderList: parsedJson.sliders.sliderList,
    })
  await initApp()
  actions.togglePage({
    pageType: PAGE_TYPES.GLOBAL_MODE,
  })
  setIsMobileOpen(false)
}

function handleSaveFile(
  { viewSettings, sliders, actions: { saveFile } },
  setIsMobileOpen
) {
  saveFile({
    viewSettings,
    sliders,
  })
  setIsMobileOpen(false)
}

function togglePage({ actions: { togglePage } }, pageType) {
  togglePage(pageType)
}

function handleResetSliders({ actions: { deleteAll } }, setIsMobileOpen) {
  deleteAll()
  setIsMobileOpen(false)
}
