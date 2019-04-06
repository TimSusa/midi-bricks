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
import CheckIcon from '@material-ui/icons/CheckCircle'

import MidiLearnIcon from '@material-ui/icons/SettingsInputSvideo'
import CancelIcon from '@material-ui/icons/Cancel'
import AutoArrangeModeIcon from '@material-ui/icons/Spellcheck'
import AutoArrangeModeIconFalse from '@material-ui/icons/TextFormat'
import ViewMenu from './ViewMenu'
import AddMenu from './AddMenu'
import { PAGE_TYPES } from '../../reducers/view-settings'
import { Tooltip } from '@material-ui/core'

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MenuAppBar)
)

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSlidersAction, ...ViewSettingsAction },
      dispatch
    ),
    initApp: bindActionCreators(initApp, dispatch),
  }
}

function mapStateToProps({
  sliders: { presetName, monitorVal },
  viewSettings,
}) {
  return {
    viewSettings,
    presetName,
    monitorVal,
  }
}

function MenuAppBar(props) {
  const {
    classes,
    actions,
    presetName,
    monitorVal,
    viewSettings: {
      pageType,
      isLiveMode = false,
      isLayoutMode = false,
      isCompactHorz = true,
      isAutoArrangeMode = true,
      isMidiLearnMode = false,
      lastFocusedIdx,
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
          {isMidiLearnMode && (
            <Typography className={classes.typoColorStyle}>
              MIDI Learn Mode Running...
            </Typography>
          )}
          {isLayoutMode && (
            <Typography className={classes.typoColorStyle}>
              Layout Mode Running...
            </Typography>
          )}
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

          {pageType === PAGE_TYPES.GLOBAL_MODE && (
            <React.Fragment>
              <Button
                className={classes.resetButton}
                variant="contained"
                onClick={actions.resetValues}
              >
                Reset To Saved Values
              </Button>
              <Button
                className={classes.resetButton}
                variant="contained"
                onClick={actions.triggerAllMidiElements}
              >
                Trigger All MIDI
              </Button>
            </React.Fragment>
          )}
          {[PAGE_TYPES.MIDI_DRIVER_MODE, PAGE_TYPES.GLOBAL_MODE].includes(
            pageType
          ) && (
            <>
              <Button
                className={classes.resetButton}
                variant="contained"
                onClick={async () => await props.initApp()}
              >
                Detect Driver
              </Button>
              <Button
                className={classes.resetButton}
                variant="contained"
                onClick={async () => window.location.reload()}
              >
                Reload
              </Button>
              <Button
                className={classes.resetButton}
                variant="contained"
                onClick={async () => window.localStorage.clear()}
              >
                Clear Cache
              </Button>
            </>
          )}
          {![PAGE_TYPES.MIDI_DRIVER_MODE, PAGE_TYPES.GLOBAL_MODE].includes(
            pageType
          ) && !isLayoutMode && (
            <>
              <ViewMenu />
              { (
                <IconButton
                  aria-haspopup="true"
                  onClick={toggleMidiLearnMode.bind(
                    this,
                    actions.toggleMidiLearnMode,
                    null,
                    isMidiLearnMode,
                    null,
                    initApp,
                    actions,
                    monitorVal,
                    lastFocusedIdx
                  )}
                  color="inherit"
                >
                  <Tooltip
                    title={
                      isMidiLearnMode
                        ? 'Chose assigned element and finalize MIDI-Learn Mode.'
                        : 'Switch to MIDI Learn Mode.'
                    }
                  >
                    <MidiLearnIcon />
                  </Tooltip>
                </IconButton>
              )}
            </>
          )}
                    {isLayoutMode && (
            <IconButton
              onClick={() => {
                actions.toggleLayoutMode({ isLayoutMode: false })
              }}
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <Tooltip title="Commit changes and exit layout-mode.">
                <CheckIcon />
              </Tooltip>
            </IconButton>
          )}
          {isLayoutMode && (
            <IconButton
              onClick={() => {
                actions.goBack()
                actions.toggleLayoutMode({ isLayoutMode: false })
              }}
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <Tooltip title="Throw away changes and go back.">
                <CancelIcon />
              </Tooltip>
            </IconButton>
          )}
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

function styles(theme) {
  return {
    root: {
      flexGrow: 1,
    },
    appBar: {
      background: theme.palette.appBar.background,
      fontWeight: 600,
    },
    typoColorStyle: {
      color: theme.palette.primary.contrastText,
      fontWeight: 600,
      flex: 1,
    },
    flex: {
      flex: 1,
    },
    menuButton: {
      marginLeft: 0,
      marginRight: 0,
    },
    resetButton: {
      padding: '0 8px 0 8px',
      marginLeft: '16px',
      height: '32px',
      textTransform: 'none',
      fontSize: '12px',
    },
  }
}

async function toggleMidiLearnMode(
  toggleMidiLearn,
  setAncEl,
  isMidiLearn,
  initMidiLearn,
  initApp,
  actions,
  monitorVal,
  lastFocusedIdx
) {
  if (isMidiLearn) {
    if (!monitorVal) return
    actions.selectMidiDriver({
      driverName: monitorVal.driver,
      i: lastFocusedIdx,
    })
    
    actions.selectMidiChannel({
      val: `${monitorVal.channel}`,
      idx: lastFocusedIdx,
    })
    actions.selectCc({
      val: [`${monitorVal.cC}`],
      idx: lastFocusedIdx,
    })
    actions.selectMidiDriverInput({
      driverNameInput: monitorVal.driver,
      i: lastFocusedIdx,
    })
    actions.selectMidiChannelInput({
      val: `${monitorVal.channel}`,
      idx: lastFocusedIdx,
    })

    actions.addMidiCcListener({
      val: [`${monitorVal.cC}`],
      idx: lastFocusedIdx,
    })

    await initApp()
    //handleClose(setAncEl)
  } else {
    await initApp('all')
    //handleClose(setAncEl)
  }
  toggleMidiLearn({ isMidiLearnMode: !isMidiLearn })
}
