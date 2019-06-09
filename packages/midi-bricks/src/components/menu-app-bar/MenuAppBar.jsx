import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as ViewSettingsAction } from '../../actions/view-settings'
import { Actions as MidiSlidersAction } from '../../actions/slider-list.js'
import { ActionCreators as UndoAction } from 'redux-undo'

import { initApp } from '../../actions/init'
import { thunkCopyToNextPage } from '../../actions/thunks/thunk-copy-to-next-page.js'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import UndoIcon from '@material-ui/icons/Undo'
import RedoIcon from '@material-ui/icons/Redo'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import SwapVertIcon from '@material-ui/icons/SwapVert'
import CheckIcon from '@material-ui/icons/CheckCircle'

import MidiLearnIcon from '@material-ui/icons/SettingsInputSvideo'
import LayoutIcon from '@material-ui/icons/ViewQuilt'
import CancelIcon from '@material-ui/icons/Cancel'
import AutoArrangeModeIcon from '@material-ui/icons/Spellcheck'
import AutoArrangeModeIconFalse from '@material-ui/icons/TextFormat'
import CopyIcon from '@material-ui/icons/ArrowRightAlt'
import DeleteIcon from '@material-ui/icons/Delete'
import ViewSettingsIcon from '@material-ui/icons/Settings'
import AddMenu from './AddMenu'
import { PAGE_TYPES } from '../../reducers'
import { ToolTipIconButton } from '../ToolTipIconButton'

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuAppBar)

MenuAppBar.propTypes = {
  actions: PropTypes.object,
  future: PropTypes.array,
  handleDrawerToggle: PropTypes.func,
  initApp: PropTypes.func,
  monitorVal: PropTypes.object,
  past: PropTypes.array,
  presetName: PropTypes.string,
  thunkCopyToNextPage: PropTypes.func,
  viewSettings: PropTypes.object
}

function MenuAppBar(props) {
  const classes = makeStyles(styles, { withTheme: true })()
  const {
    actions = {},
    thunkCopyToNextPage,
    presetName = '',
    monitorVal,
    past = [],
    future = [],
    viewSettings: {
      pageType,
      isLiveMode = false,
      isLayoutMode = false,
      isSettingsMode,
      isCompactHorz = true,
      isAutoArrangeMode = true,
      isMidiLearnMode = false,
      lastFocusedIdx,
      lastFocusedIdxs,
      lastFocusedPage
    }
  } = props

  if (isLiveMode) {
    return <div />
  }

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position='fixed'>
        <Toolbar>
          <ToolTipIconButton
            title={'Menu'}
            handleClick={props.handleDrawerToggle}
            icon={<MenuIcon />}
            aria-label='Menu'
          />
          <Typography variant='h6' color='inherit' className={classes.flex}>
            MIDI Briqkxs
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
          {isSettingsMode && !isLayoutMode && (
            <Typography className={classes.typoColorStyle}>
              Settings Mode Running...
            </Typography>
          )}
          {isLayoutMode && (
            <ToolTipIconButton
              handleClick={(e) => actions.toggleCompactMode()}
              title={isCompactHorz ? 'Gravity horizontal' : 'Gravity vertical'}
              icon={isCompactHorz ? <SwapHorizIcon /> : <SwapVertIcon />}
            />
          )}
          {isLayoutMode && (
            <ToolTipIconButton
              handleClick={(e) => actions.toggleAutoArrangeMode()}
              title={isAutoArrangeMode ? 'Automatic Gravity' : 'Static Gravity'}
              icon={
                isAutoArrangeMode ? (
                  <AutoArrangeModeIcon />
                ) : (
                  <AutoArrangeModeIconFalse />
                )
              }
            />
          )}
          {isLayoutMode && <AddMenu />}
          {pageType === PAGE_TYPES.GLOBAL_MODE && (
            <Typography className={classes.typoColorStyle}>
              {presetName || ''}
            </Typography>
          )}
          {pageType === PAGE_TYPES.GLOBAL_MODE && (
            <>
              <Button
                className={classes.resetButton}
                variant='contained'
                onClick={(e) => actions.resetValues()}
              >
                Reset To Saved Values
              </Button>
              <Button
                className={classes.resetButton}
                variant='contained'
                onClick={(e) => actions.triggerAllMidiElements()}
              >
                Trigger All MIDI
              </Button>
            </>
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
                onClick={() => window.location.reload()}
              >
                Reload
              </Button>
              <Button
                className={classes.resetButton}
                variant='contained'
                onClick={() => window.localStorage.clear()}
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
                  <>
                    <ToolTipIconButton
                      handleClick={() => actions.toggleSettingsMode()}
                      title={'Switch to Settings Mode.'}
                      icon={<ViewSettingsIcon />}
                    />

                    {Array.isArray(lastFocusedIdxs) &&
                      lastFocusedIdxs.length > 0 && (
                        <>
                          <ToolTipIconButton
                            handleClick={() => thunkCopyToNextPage()}
                            title={'Copy to last page.'}
                            icon={<CopyIcon />}
                          />

                          <ToolTipIconButton
                            handleClick={(e) => {
                              lastFocusedIdxs.forEach((id) => {
                                actions.delete({ i: id, lastFocusedPage })
                              })
                            }}
                            title={'Delete.'}
                            icon={<DeleteIcon />}
                          />
                        </>
                    )}
                  </>
                )}
                {!isMidiLearnMode && (
                  <ToolTipIconButton
                    handleClick={(e) => actions.toggleLayoutMode()}
                    title={'Switch to Layout Mode.'}
                    icon={<LayoutIcon />}
                  />
                )}
                <ToolTipIconButton
                  handleClick={toggleMidiLearnMode.bind(
                    this,
                    actions.toggleMidiLearnMode,
                    null,
                    isMidiLearnMode,
                    null,
                    initApp,
                    actions,
                    monitorVal,
                    lastFocusedIdx,
                    lastFocusedPage
                  )}
                  title={
                    isMidiLearnMode
                      ? 'Chose assigned element and finalize MIDI-Learn Mode.'
                      : 'Switch to MIDI Learn Mode. Please, double-click element for listening to changes.'
                  }
                  icon={!isMidiLearnMode ? <MidiLearnIcon /> : <CheckIcon />}
                />

                {isMidiLearnMode && (
                  <ToolTipIconButton
                    handleClick={cancelMidiLeanMode.bind(
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
                    title={'Cancel MIDI Learn mode. Throw away changes.'}
                    icon={<CancelIcon />}
                  />
                )}
              </>
          )}
          {isLayoutMode && (
            <ToolTipIconButton
              handleClick={() =>
                actions.toggleLayoutMode({ isLayoutMode: false })
              }
              title={'Commit changes and exit layout-mode.'}
              icon={<CheckIcon />}
            />
          )}
          {isLayoutMode && (
            <ToolTipIconButton
              handleClick={() => {
                //actions.goBack()
                actions.toggleLayoutMode({ isLayoutMode: false })
              }}
              title={'Throw away changes and go back.'}
              icon={<CancelIcon />}
            />
          )}
          {
            <>
              <ToolTipIconButton
                isDisabled={past.length <1  }
                handleClick={actions.undo}
                title={`Undo´s left ${past.length}`}
                icon={<UndoIcon />}
              />

              <ToolTipIconButton
                isDisabled={future.length <1 }
                handleClick={actions.redo}
                title={`Redo´s left ${future.length}`}
                icon={<RedoIcon disabled />}
              />
            </>
          }
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
  lastFocusedIdx,
  lastFocusedPage
) {
  if (isMidiLearn) {
    if (!monitorVal) return
    actions.selectMidiDriver({
      driverName: monitorVal.driver,
      i: lastFocusedIdx,
      lastFocusedPage
    })

    actions.selectMidiChannel({
      val: `${monitorVal.channel}`,
      i: lastFocusedIdx,
      lastFocusedPage
    })
    actions.selectCc({
      val: [`${monitorVal.cC}`],
      i: lastFocusedIdx,
      lastFocusedPage
    })
    actions.selectMidiDriverInput({
      driverNameInput: monitorVal.driver,
      i: lastFocusedIdx,
      lastFocusedPage
    })
    // actions.selectMidiChannelInput({
    //   val: `${monitorVal.channel}`,
    //   i: lastFocusedIdx,
    //   lastFocusedPage
    // })

    actions.addMidiCcListener({
      val: [`${monitorVal.cC}`],
      i: lastFocusedIdx,
      lastFocusedPage
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
      { ...MidiSlidersAction, ...ViewSettingsAction, ...UndoAction },
      dispatch
    ),
    initApp: bindActionCreators(initApp, dispatch),
    thunkCopyToNextPage: bindActionCreators(thunkCopyToNextPage, dispatch)
  }
}

function mapStateToProps({
  sliders: {
    presetName, monitorVal
  },
  viewSettings
}) {
  return {
    viewSettings,
    presetName,
    monitorVal
  }
}
