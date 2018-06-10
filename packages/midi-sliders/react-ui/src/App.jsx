import {
  // Button,
  Badge,
  Divider,
  Drawer,
  // Hidden,
  // IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  // Toolbar,
  // Typography,
  withStyles
} from '@material-ui/core'
import TodoIcon from '@material-ui/icons/FormatListNumbered'
import LoadIcon from '@material-ui/icons/InsertDriveFile'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
// import MenuIcon from '@material-ui/icons/Menu'
import { createBrowserHistory } from 'history'
import * as React from 'react'
import { connect } from 'react-redux'
import { Route, Router } from 'react-router'

import MidiSlidersPage from './pages/MidiSlidersPage'
import { bindActionCreators } from 'redux'
import * as MidiSlidersAction from './actions/midi-sliders.js'

import withRoot from './withRoot'
import AppBar from './components/AppBar'
import FileReaderInput from './components/FileReader'

const history = createBrowserHistory()

class App extends React.Component {
  state = {
    isMobileOpen: false
  }

  routes = (
    <div className={this.props.classes.content}>
      <Route exact path='/' component={MidiSlidersPage} />
      <Route exact path='/midi-sliders' component={MidiSlidersPage} />
    </div>
  );

  render () {
    let drawer = (
      <div>
        <div className={this.props.classes.drawerHeader} />
        <Divider />
        <List>
          <FileReaderInput
            as='binary'
            onChange={this.onFileChange}>
            <ListItem button>
              <ListItemIcon >
                <LoadIcon />
              </ListItemIcon>
              <ListItemText primary='Load Preset' />
            </ListItem>
          </FileReaderInput>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={this.handleSaveFile}>
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            <ListItemText primary='Save Preset' />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={this.handleResetSliders}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary='Delete Sliders' />
          </ListItem>
        </List>
        {/*
        <List>
          <ListItem button onClick={() => history.push('/about')}>
            <ListItemIcon>
              {this.renderRackIcon()}
            </ListItemIcon>
            <ListItemText primary='Rack' />
          </ListItem>
        </List>
        */}
        <div style={{ height: 10000 }} />
      </div>
    )

    return (
      <Router history={history}>
        <div className={this.props.classes.root}>
          <div className={this.props.classes.appBar}>
            <AppBar
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
              {drawer}
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
    this.props.actions.deleteAllSliders()
    this.setState(state => ({isMobileOpen: !this.state.isMobileOpen}))
  }

  renderTodoIcon () {
    let uncompletedTodos = this.props.rackItemList.filter(t => t.muted === false)

    if (uncompletedTodos.length > 0) {
      return (
        <Badge color='secondary' badgeContent={uncompletedTodos.length}>
          <TodoIcon />
        </Badge>
      )
    } else {
      return (
        <TodoIcon />
      )
    }
  }

  renderRackIcon () {
    let uncompletedTodos = this.props.todoList.filter(t => t.completed === false)

    if (uncompletedTodos.length > 0) {
      return (
        <Badge color='secondary' badgeContent={uncompletedTodos.length}>
          <TodoIcon />
        </Badge>
      )
    } else {
      return (
        <TodoIcon />
      )
    }
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
    // [theme.breakpoints.up('md')]: {
    //   display: 'none'
    // }
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: 250,
    backgroundColor: theme.palette.background.default
    // [theme.breakpoints.up('md')]: {
    //   width: drawerWidth,
    //   position: 'relative',
    //   height: '100%'
    // }
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    // height: 'calc(100% - 56px)',
    marginTop: theme.spacing.unit
    // [theme.breakpoints.up('sm')]: {
    //   height: 'calc(100% - 64px)',
    //   marginTop: 64
    // }
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSlidersAction, dispatch)
  }
}
export default (withRoot(withStyles(styles)(connect(null, mapDispatchToProps)(App))))
