import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as ViewSettingsAction } from '../../actions/view-settings'
import { Actions as MidiSlidersAction } from '../../actions/slider-list.js'
import { initApp } from '../../actions/init'
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
import LayoutIcon from '@material-ui/icons/ViewQuilt'
import CancelIcon from '@material-ui/icons/Cancel'
import AutoArrangeModeIcon from '@material-ui/icons/Spellcheck'
import AutoArrangeModeIconFalse from '@material-ui/icons/TextFormat'
import ViewSettingsIcon from '@material-ui/icons/Settings'
import AddMenu from './AddMenu'
import { PAGE_TYPES } from '../../reducers/view-settings'
import { Tooltip } from '@material-ui/core'

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuAppBar)



MenuAppBar.propTypes = {
  actions: PropTypes.object,
  viewSettings: PropTypes.object,
  handleDrawerToggle: PropTypes.func,
  initApp: PropTypes.func,
  monitorVal: PropTypes.object,
  presetName: PropTypes.string
}

function MenuAppBar(props) {
  const classes = makeStyles(styles, { withTheme: true })()
  const {
    actions = {},
    presetName = '',
    monitorVal,
    viewSettings: {
      pageType,
      isLiveMode = false,
      isLayoutMode = false,
      isCompactHorz = true,
      isAutoArrangeMode = true,
      isMidiLearnMode = false,
      lastFocusedIdx
    }
  } = props

  if (isLiveMode) {
    return <div />
  }

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position='fixed'>
        <Toolbar>
          <IconButton
            onClick={props.handleDrawerToggle}
            className={classes.menuButton}
            color='inherit'
            aria-label='Menu'
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' color='inherit' className={classes.flex}>
            MIDI Brikqxs
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

          {isLayoutMode ? (
            isCompactHorz ? (
              <Tooltip disableHoverListener={false} title='Gravity horizontal'>
                <IconButton
                  onClick={actions.toggleCompactMode}
                  className={classes.menuButton}
                  color='inherit'
                  aria-label='Menu'
                >
                  <SwapHorizIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip disableHoverListener={false} title='Gravity vertical'>
                <IconButton
                  onClick={actions.toggleCompactMode}
                  className={classes.menuButton}
                  color='inherit'
                  aria-label='Menu'
                >
                  <SwapVertIcon />
                </IconButton>
              </Tooltip>
            )
          ) : (
            <div />
          )}

          {isLayoutMode ? (
            isAutoArrangeMode ? (
              <Tooltip disableHoverListener={false} title='Automatic Gravity'>
                <IconButton
                  onClick={actions.toggleAutoArrangeMode}
                  className={classes.menuButton}
                  color='inherit'
                  aria-label='Menu'
                >
                  <AutoArrangeModeIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip disableHoverListener={false} title='Static Gravity'>
                <IconButton
                  onClick={actions.toggleAutoArrangeMode}
                  className={classes.menuButton}
                  color='inherit'
                  aria-label='Menu'
                >
                  <AutoArrangeModeIconFalse />
                </IconButton>
              </Tooltip>
            )
          ) : (
            <div />
          )}

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
                variant='contained'
                onClick={actions.resetValues}
              >
                Reset To Saved Values
              </Button>
              <Button
                className={classes.resetButton}
                variant='contained'
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
                variant='contained'
                onClick={async () => await props.initApp()}
              >
                Detect Driver
              </Button>
              <Button
                className={classes.resetButton}
                variant='contained'
                onClick={async () => window.location.reload()}
              >
                Reload
              </Button>
              <Button
                className={classes.resetButton}
                variant='contained'
                onClick={async () => window.localStorage.clear()}
              >
                Clear Cache
              </Button>
            </>
          )}
          {![PAGE_TYPES.MIDI_DRIVER_MODE, PAGE_TYPES.GLOBAL_MODE].includes(
            pageType
          ) &&
            !isLayoutMode && (
              <>
                {!isMidiLearnMode && (
                  <Tooltip
                    disableHoverListener={false}
                    title='Switch to Settings Mode.'
                  >
                    <IconButton
                      onClick={(e) => actions.toggleSettingsMode()}
                      color='inherit'
                    >
                      <ViewSettingsIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {!isMidiLearnMode && (
                  <Tooltip
                    disableHoverListener={false}
                    title='Switch to Layout Mode.'
                  >
                    <IconButton
                      onClick={(e) => actions.toggleLayoutMode()}
                      color='inherit'
                    >
                      <LayoutIcon />
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip
                  disableHoverListener={false}
                  title={
                    isMidiLearnMode
                      ? 'Chose assigned element and finalize MIDI-Learn Mode.'
                      : 'Switch to MIDI Learn Mode. Please, double-click element for listening to changes.'
                  }
                >
                  <IconButton
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
                    color='inherit'
                  >
                    {!isMidiLearnMode ? <MidiLearnIcon /> : <CheckIcon />}
                  </IconButton>
                </Tooltip>

                {isMidiLearnMode && (
                  <Tooltip
                    disableHoverListener={false}
                    title={'Cancel MIDI Learn mode. Throw away changes.'}
                  >
                    <IconButton
                      onClick={cancelMidiLeanMode.bind(
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
                      color='inherit'
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </>
          )}
          {isLayoutMode && (
            <Tooltip
              disableHoverListener={false}
              title='Commit changes and exit layout-mode.'
            >
              <IconButton
                onClick={() => {
                  actions.toggleLayoutMode({ isLayoutMode: false })
                }}
                className={classes.menuButton}
                color='inherit'
                aria-label='Menu'
              >
                <CheckIcon />
              </IconButton>
            </Tooltip>
          )}
          {isLayoutMode && (
            <Tooltip
              disableHoverListener={false}
              title='Throw away changes and go back.'
            >
              <IconButton
                onClick={() => {
                  actions.goBack()
                  actions.toggleLayoutMode({ isLayoutMode: false })
                }}
                className={classes.menuButton}
                color='inherit'
                aria-label='Menu'
              >
                <CancelIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>
      <div
        style={{
          height: 64
        }}
      />
    </div>
  )
}

function styles(theme) {
  return {
    root: {
      flexGrow: 1
    },
    appBar: {
      background: theme.palette.appBar.background,
      fontWeight: 600
    },
    typoColorStyle: {
      color: theme.palette.primary.contrastText,
      fontWeight: 600,
      flex: 1
    },
    flex: {
      flex: 1
    },
    menuButton: {
      marginLeft: 0,
      marginRight: theme.spacing(2)
    },
    resetButton: {
      padding: '0 8px 0 8px',
      marginLeft: theme.spacing(2),
      height: 32,
      textTransform: 'none',
      fontSize: '12px',
      overflow: 'hidden',
      color: theme.palette.primary.contrastText
    }
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
      i: lastFocusedIdx
    })

    actions.selectMidiChannel({
      val: `${monitorVal.channel}`,
      idx: lastFocusedIdx
    })
    actions.selectCc({
      val: [`${monitorVal.cC}`],
      idx: lastFocusedIdx
    })
    actions.selectMidiDriverInput({
      driverNameInput: monitorVal.driver,
      i: lastFocusedIdx
    })
    actions.selectMidiChannelInput({
      val: `${monitorVal.channel}`,
      idx: lastFocusedIdx
    })

    actions.addMidiCcListener({
      val: [`${monitorVal.cC}`],
      idx: lastFocusedIdx
    })

    await initApp()
    //handleClose(setAncEl)
  } else {
    await initApp('all')
    //handleClose(setAncEl)
  }
  toggleMidiLearn({ isMidiLearnMode: !isMidiLearn })
}

async function cancelMidiLeanMode(
  toggleMidiLearn,
  setAncEl,
  isMidiLearn,
  initMidiLearn,
  initApp,
  actions,
  monitorVal,
  lastFocusedIdx
) {
  await initApp('all')

  toggleMidiLearn({ isMidiLearnMode: !isMidiLearn })
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSlidersAction, ...ViewSettingsAction },
      dispatch
    ),
    initApp: bindActionCreators(initApp, dispatch)
  }
}

function mapStateToProps({
  sliders: { presetName, monitorVal },
  viewSettings
}) {
  return {
    viewSettings,
    presetName,
    monitorVal
  }
}
