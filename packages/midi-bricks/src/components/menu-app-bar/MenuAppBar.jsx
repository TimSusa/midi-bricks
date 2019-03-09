import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as ViewSettingsAction } from '../../actions/view-settings'
import { Actions as MidiSlidersAction } from '../../actions/slider-list.js'
import { initApp } from '../../actions/init'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import SwapVertIcon from '@material-ui/icons/SwapVert'
import AutoArrangeModeIcon from '@material-ui/icons/Spellcheck'
import AutoArrangeModeIconFalse from '@material-ui/icons/TextFormat'
import ViewMenu from './ViewMenu'
import AddMenu from './AddMenu'
import { PAGE_TYPES } from '../../reducers/view-settings'
import { Tooltip } from '@material-ui/core'

const MenuAppBar = props => {
  const {
    classes,
    actions,
    presetName,
    viewSettings: {
      pageType,
      isLiveMode = false,
      isLayoutMode,
      isCompactHorz = true,
      isAutoArrangeMode = true,
      isMidiLearnMode = false,
    },
  } = props

  if (isLiveMode) {
    return <div />
  }

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
          <IconButton
            onClick={props.handleDrawerToggle}
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.flex}>
            MIDI Bricks
          </Typography>
          <IconButton
            onClick={actions.toggleCompactMode}
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            {isLayoutMode ? (
              isCompactHorz ? (
                <Tooltip title="Gravity horizontal">
                  <SwapHorizIcon />
                </Tooltip>
              ) : (
                <Tooltip title="Gravity vertical">
                  <SwapVertIcon />
                </Tooltip>
              )
            ) : (
              <div />
            )}
          </IconButton>

          <IconButton
            onClick={actions.toggleAutoArrangeMode}
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            {isLayoutMode ? (
              isAutoArrangeMode ? (
                <Tooltip title="Automatic Gravity">
                  <AutoArrangeModeIcon />
                </Tooltip>
              ) : (
                <Tooltip title="Static Gravity">
                  <AutoArrangeModeIconFalse />
                </Tooltip>
              )
            ) : (
              <div />
            )}
          </IconButton>

          {isLayoutMode && <AddMenu />}
          {pageType === PAGE_TYPES.GLOBAL_MODE && (
            <Typography className={classes.typoColorStyle}>
              {presetName || ''}
            </Typography>
          )}
          {isMidiLearnMode && (
            <Typography className={classes.typoColorStyle}>
              MIDI Learn Mode Running...
            </Typography>
          )}
          {pageType === PAGE_TYPES.GLOBAL_MODE && (
            <React.Fragment>
              <Button
                className={classes.resetButton}
                variant="contained"
                onClick={actions.resetValues}
              >
                Restore Saved Values
              </Button>
              <Button
                className={classes.resetButton}
                variant="contained"
                onClick={actions.triggerAllMidiElements}
              >
                TRIGGER ALL MIDI
              </Button>
            </React.Fragment>
          )}
          {[PAGE_TYPES.MIDI_DRIVER_MODE, PAGE_TYPES.GLOBAL_MODE].includes(
            pageType
          ) && (
            <Button
              className={classes.resetButton}
              variant="contained"
              onClick={() => props.initApp()}
            >
              Detect Driver Changes
            </Button>
          )}
          {![PAGE_TYPES.MIDI_DRIVER_MODE, PAGE_TYPES.GLOBAL_MODE].includes(
            pageType
          ) && <ViewMenu />}
        </Toolbar>
      </AppBar>
      <div
        style={{
          height: 64,
        }}
      />
    </div>
  )
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    background: theme.palette.appBar.background,
    fontWeight: 600,
  },
  typoColorStyle: {
    color: theme.palette.primary.contrastText,
    fontWeight: 600
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  resetButton: {
    marginLeft: 16,
    padding: 8,
  },
})

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSlidersAction, ...ViewSettingsAction },
      dispatch
    ),
    initApp: bindActionCreators(initApp, dispatch),
  }
}

function mapStateToProps({ sliders: { presetName }, viewSettings }) {
  return {
    presetName,
    viewSettings,
  }
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MenuAppBar)
)
