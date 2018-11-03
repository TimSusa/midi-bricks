import {
  Drawer,
  withStyles
} from '@material-ui/core'
import { createBrowserHistory } from 'history'
import * as React from 'react'
import { connect } from 'react-redux'
import { Route, HashRouter } from 'react-router-dom'

import MidiSlidersPage from './pages/MidiSlidersPage'
import { bindActionCreators } from 'redux'
import * as MidiSlidersAction from './actions/slider-list.js'
import * as ViewActions from './actions/view-settings.js'

import MenuAppBar from './components/menu-app-bar/MenuAppBar'
import DrawerList from './components/drawer-list/DrawerList'
import Footer from './components/footer/Footer'

import TestPage from './pages/TestPage.jsx'
import GlobalSettingsPage from './pages/GlobalSettingsPage'

const history = createBrowserHistory()

class App extends React.PureComponent {
  state = {
    isMobileOpen: false
  }

  routes = (
    <div className={this.props.classes.content}>
      <Route exact path='/' component={MidiSlidersPage} />
      <Route exact path='/global' component={GlobalSettingsPage} />
      <Route exact path='/test-page' component={TestPage} />
    </div>
  );

  render () {
    return (
      <HashRouter>
        <div className={this.props.classes.root}>
          <div className={this.props.classes.appBar}>
            <MenuAppBar
              handleDrawerToggle={this.handleDrawerToggle}
            />
            <Drawer
              variant='temporary'
              anchor={'left'}
              open={this.state.isMobileOpen}
              classes={{
                paper: this.props.classes.drawerPaper
              }}
              onClose={this.handleDrawerToggle}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
            >
              <DrawerList
                onFileChange={this.onFileChange}
                handleSaveFile={this.handleSaveFile}
                handleResetSliders={this.handleResetSliders}
                classes={this.props.classes}
                history={history}
              />
            </Drawer>
            {this.routes}

            {(!window.location.href.endsWith('global')) && (<Footer />) }
          </div>
        </div>
      </HashRouter>
    )
  }

  onFileChange = (e, results) => {
    this.props.actions.deleteFooterPages()
    this.props.actions.loadFile(results)

    // Prepare foooterpages flush
    const files = results[0]
    const content = files[0].target.result
    const parsedJson = JSON.parse(content)
    if (parsedJson.viewSettings && parsedJson.viewSettings.footerPages) {
      this.setState(state =>
        ({ isMobileOpen: !this.state.isMobileOpen }),
      () => this.props.actions.addPageToFooter({sliderList: parsedJson.viewSettings.footerPages}))
    } else {
      this.setState(state =>
        ({ isMobileOpen: !this.state.isMobileOpen }),
      () => parsedJson.sliderList &&
        this.props.actions.addPageToFooter({sliderList: parsedJson.sliderList}))
    }

    window.location.reload()
  }

  handleSaveFile = () => {
    this.props.actions.saveFile()
    this.setState(state => ({ isMobileOpen: !this.state.isMobileOpen }))
  }

  handleResetSliders = () => {
    this.props.actions.deleteAll()

    this.setState(state => ({ isMobileOpen: !this.state.isMobileOpen }), () => this.props.actions.deleteFooterPages())
  }

  handleDrawerToggle = () => {
    this.setState({ isMobileOpen: !this.state.isMobileOpen })
  }
}

const styles = theme => ({
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
  navIconHide: {
  },
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
    marginTop: theme.spacing.unit
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({...MidiSlidersAction, ...ViewActions}, dispatch)
  }
}
export default withStyles(styles)(connect(null, mapDispatchToProps)(App))
