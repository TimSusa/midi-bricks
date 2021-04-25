import React, { useState, Suspense } from 'react'
import Home from './pages/Home'
import { useTheme } from '@material-ui/styles'
import Footer from './components/footer/Footer'
import { makeStyles } from '@material-ui/styles'
import { useSelector } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import { useBeforeUnload } from './utils/useBeforeUnload'
import { openIpcUnsavedChanges, exitApp } from './utils/ipc-renderer'


export function App() {
  const isLiveMode = useSelector((state) => state.viewSettings.isLiveMode)
  const state = useSelector((state) => state)
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()
  const [isMobileOpen, setIsMobileOpen] = useState(false)



  useBeforeUnload((event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault()
    // Older browsers supported custom message
    event.returnValue = ''
    if (isWebMode()) {
      // if (tmp !== null) window.alert()
    } else {
      //call ipc here
      !isEmpty(window.sessionStorage.getItem('history'))
        ? openIpcUnsavedChanges(state)
        : exitApp()
    }
  }, !!JSON.parse(window.sessionStorage.getItem('history')))

  if (!isLiveMode) {
    const MenuAppBar = React.lazy(() =>
      import('./components/menu-app-bar/MenuAppBar.jsx')
    )
    const Drawer = React.lazy(() =>
      import('./components/drawer-list/DrawerLoader.jsx')
    )
    const DrawerList = React.lazy(() =>
      import('./components/drawer-list/DrawerList.jsx')
    )

    return (
      <div className={classes.root}>
        <div className={classes.appBar}>
          <Suspense fallback={<div>Loading Menu...</div>}>
            <MenuAppBar
              handleDrawerToggle={() => setIsMobileOpen(!isMobileOpen)}
            />
            <Drawer
              variant='temporary'
              anchor={'left'}
              open={isMobileOpen}
              classes={{
                paper: classes.drawerPaper
              }}
              onClose={() => setIsMobileOpen(!isMobileOpen)}
            >
              <DrawerList
                onFileChange={() => setIsMobileOpen(false)}
                handleSaveFile={() => setIsMobileOpen(false)}
                handleResetSliders={() => setIsMobileOpen(false)}
                classes={classes}
                onClose={() => setIsMobileOpen(!isMobileOpen)}
              />
            </Drawer>
          </Suspense>
          <Home />
          <Footer />
        </div>
      </div>
    )
  } else {
    return (
      <div className={classes.root}>
        <div className={classes.appBar}>
          <Home />
          <Footer />
        </div>
      </div>
    )
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
      backgroundColor: theme.palette.background.default,
      color: theme.palette.primary.contrastText
    },
    iconColor: {
      color: theme.palette.primary.contrastText
    },
    content: {
      backgroundColor: theme.palette.background.default,
      width: '100%',
      marginTop: theme.spacing(1)
    }
  }
}

function isWebMode() {

  if (process.env.REACT_APP_IS_WEB_MODE === 'true') {
    return true
  } else {
    return false
  }

}


