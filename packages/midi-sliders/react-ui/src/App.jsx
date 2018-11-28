import {
  Drawer,
  withStyles
} from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'

import Home from './pages/Home'
import { bindActionCreators } from 'redux'
import * as MidiSlidersAction from './actions/slider-list.js'
import * as ViewActions from './actions/view-settings.js'

import MenuAppBar from './components/menu-app-bar/MenuAppBar'
import DrawerList from './components/drawer-list/DrawerList'
import Footer from './components/footer/Footer'
import { PAGE_TYPES } from './reducers/view-settings'

class App extends React.PureComponent {
  state = {
    isMobileOpen: false
  }

  render () {
    return (
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
              togglePage={this.togglePage}
              classes={this.props.classes}
            />
          </Drawer>
          <Home />

          {(!window.location.href.endsWith('global')) && (<Footer />) }
        </div>
      </div>
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
      () => parsedJson.sliders.sliderList &&
        this.props.actions.addPageToFooter({sliderList: parsedJson.sliders.sliderList}))
    }

    this.props.actions.togglePage({pageType: PAGE_TYPES.GLOBAL_MODE})

    // Bad hack go away
    // window.location.reload()
  }

  handleSaveFile = () => {
    this.props.actions.saveFile()
    this.setState(state => ({ isMobileOpen: !this.state.isMobileOpen }))
  }

  togglePage = (pageType) => {
    this.props.actions.togglePage(pageType)
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
