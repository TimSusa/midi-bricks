import { Drawer, withStyles } from '@material-ui/core'
import * as React from 'react'
import { connect } from 'react-redux'

import Home from './pages/Home'
import { bindActionCreators } from 'redux'
import * as MidiSlidersAction from './actions/slider-list.js'
import * as ViewActions from './actions/view-settings.js'
import { initApp } from './actions/init'

import MenuAppBar from './components/menu-app-bar/MenuAppBar'
import DrawerList from './components/drawer-list/DrawerList'
import Footer from './components/footer/Footer'
import { PAGE_TYPES } from './reducers/view-settings'

class App extends React.PureComponent {
  state = {
    isMobileOpen: false,
  }

  render() {
    return (
      <div className={this.props.classes.root}>
        <div className={this.props.classes.appBar}>
          <MenuAppBar handleDrawerToggle={this.handleDrawerToggle} />
          <Drawer
            variant="temporary"
            anchor={'left'}
            open={this.state.isMobileOpen}
            classes={{
              paper: this.props.classes.drawerPaper,
            }}
            onClose={this.handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
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

          {!window.location.href.endsWith('global') && <Footer />}
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

    const {
      viewSettings: { availableDrivers },
    } = parsedJson
    const drivers = availableDrivers || {
      inputs: { None: { ccChannels: [], noteChannels: [] } },
      outputs: { None: { ccChannels: [], noteChannels: [] } },
    }

    if (parsedJson.viewSettings && parsedJson.viewSettings.footerPages) {
      this.setState(
        state => ({ isMobileOpen: !this.state.isMobileOpen }),
        () =>
          this.props.actions.updateViewSettings({
            viewSettings: {
              ...parsedJson.viewSettings,
              availableDrivers: drivers,
            },
            sliderList: parsedJson.viewSettings.footerPages,
          })
      )
    } else {
      this.setState(
        state => ({ isMobileOpen: !this.state.isMobileOpen }),
        () =>
          parsedJson.sliders.sliderList &&
          this.props.actions.updateViewSettings({
            viewSettings: {
              ...parsedJson.viewSettings,
              availableDrivers: drivers,
            },
            sliderList: parsedJson.sliders.sliderList,
          })
      )
    }
    this.props.initApp()
    this.props.actions.togglePage({ pageType: PAGE_TYPES.GLOBAL_MODE })
  }

  handleSaveFile = () => {
    const { viewSettings, sliders } = this.props
    this.props.actions.saveFile({ viewSettings, sliders })
    this.setState(state => ({ isMobileOpen: !this.state.isMobileOpen }))
  }

  togglePage = pageType => {
    this.props.actions.togglePage(pageType)
  }

  handleResetSliders = () => {
    this.props.actions.deleteAll()

    this.setState(
      state => ({ isMobileOpen: !this.state.isMobileOpen }),
      () => this.props.actions.deleteFooterPages()
    )
  }

  handleDrawerToggle = () => {
    this.setState({ isMobileOpen: !this.state.isMobileOpen })
  }
}

const styles = theme => ({
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
    marginTop: theme.spacing.unit,
  },
})

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
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
)
