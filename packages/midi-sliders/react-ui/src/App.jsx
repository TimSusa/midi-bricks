import {
  Drawer,
  withStyles
} from '@material-ui/core'
import { createBrowserHistory } from 'history'
import * as React from 'react'
import { connect } from 'react-redux'
import { Route, Router } from 'react-router'

import MidiSlidersPage from './pages/MidiSlidersPage'
import { bindActionCreators } from 'redux'
import * as MidiSlidersAction from './actions/slider-list.js'

import withRoot from './withRoot'
import MenuAppBar from './components/menu-app-bar/MenuAppBar'
import DrawerList from './components/DrawerList'

import TestPage from './pages/TestPage.jsx'
// import DraggableLayout from './pages/DraggableLayout'

const history = createBrowserHistory()

class App extends React.Component {
  state = {
    isMobileOpen: false
  }

  routes = (
    <div className={this.props.classes.content}>
      <Route exact path='/' component={MidiSlidersPage} />
      <Route exact path='/slider-list' component={MidiSlidersPage} />
      <Route exact path='/test-page' component={TestPage} />
      {/* <Route exact path='/draggable' component={DraggableLayout} /> */}
    </div>
  );

  render () {
    return (
      <Router history={history}>
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
          </div>
        </div>
      </Router>
    )
  }

  onFileChange = (e, results) => {
    this.props.actions.loadFile(results)
    this.setState(state => ({isMobileOpen: !this.state.isMobileOpen}))
  }

  handleSaveFile = () => {
    this.props.actions.saveFile()
    this.setState(state => ({isMobileOpen: !this.state.isMobileOpen}))
  }

  handleResetSliders = () => {
    this.props.actions.deleteAll()
    this.setState(state => ({isMobileOpen: !this.state.isMobileOpen}))
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
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: 250,
    backgroundColor: theme.palette.background.default
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    marginTop: theme.spacing.unit
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSlidersAction, dispatch)
  }
}
export default (withRoot(withStyles(styles)(connect(null, mapDispatchToProps)(App))))
