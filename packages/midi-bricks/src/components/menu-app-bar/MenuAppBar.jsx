import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as ViewSettingsAction } from '../../actions/view-settings'
import { Actions as MidiSlidersAction } from '../../actions/slider-list.js'
import { initApp } from '../../actions/init'
import { thunkCopyToNextPage } from '../../actions/thunks/thunk-copy-to-next-page.js'
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
import CopyIcon from '@material-ui/icons/ArrowRightAlt'
import DeleteIcon from '@material-ui/icons/Delete'
import ViewSettingsIcon from '@material-ui/icons/Settings'
import AddMenu from './AddMenu'
import { PAGE_TYPES } from '../../reducers'
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
  thunkCopyToNextPage: PropTypes.func,
  monitorVal: PropTypes.object,
  presetName: PropTypes.string
}

function MenuAppBar(props) {
  const classes = makeStyles(styles, { withTheme: true })()
  const {
    actions = {},
    thunkCopyToNextPage,
    presetName = '',
    monitorVal,
    viewSettings: {
      pageType,
      isLiveMode = false,
      isLayoutMode = false,
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
          <IconButton
            onClick={props.handleDrawerToggle}
            className={classes.menuButton}
            color='inherit'
            aria-label='Menu'
          >
            <MenuIcon />
          </IconButton>
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

          {isLayoutMode &&
            renderAppBarButton(
              (e) => actions.toggleCompactMode(),
              isCompactHorz ? 'Gravity horizontal' : 'Gravity vertical',
              isCompactHorz ? <SwapHorizIcon /> : <SwapVertIcon />
            )}

          {isLayoutMode &&
            renderAppBarButton(
              (e) => actions.toggleAutoArrangeMode(),
              isAutoArrangeMode ? 'Automatic Gravity' : 'Static Gravity',
              isAutoArrangeMode ? (
                <AutoArrangeModeIcon />
              ) : (
                <AutoArrangeModeIconFalse />
              )
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
                  <>
                    {renderAppBarButton(
                      () => actions.toggleSettingsMode(),
                      'Switch to Settings Mode.',
                      <ViewSettingsIcon />
                    )}
                    {Array.isArray(lastFocusedIdxs) &&
                    lastFocusedIdxs.length > 1 ? (
                      <>
                        {renderAppBarButton(
                          () => thunkCopyToNextPage(),
                          'Copy to last page.',
                          <CopyIcon />
                        )}
                        {renderAppBarButton(
                          (e) => {
                            lastFocusedIdxs.forEach((id) => {
                              actions.delete({ i: id, lastFocusedPage })
                            })
                          },
                          'Delete.',
                          <DeleteIcon />
                        )}
                      </>
                      ) : (
                        <div />
                      )}
                  </>
                )}
                {!isMidiLearnMode &&
                  renderAppBarButton(
                    (e) => actions.toggleLayoutMode(),
                    'Switch to Layout Mode.',
                    <LayoutIcon />
                  )}

                {renderAppBarButton(
                  toggleMidiLearnMode.bind(
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
                  ),

                  isMidiLearnMode
                    ? 'Chose assigned element and finalize MIDI-Learn Mode.'
                    : 'Switch to MIDI Learn Mode. Please, double-click element for listening to changes.',
                  !isMidiLearnMode ? <MidiLearnIcon /> : <CheckIcon />
                )}
                {isMidiLearnMode &&
                  renderAppBarButton(
                    cancelMidiLeanMode.bind(
                      this,
                      actions.toggleMidiLearnMode,
                      null,
                      isMidiLearnMode,
                      null,
                      initApp,
                      actions,
                      monitorVal,
                      lastFocusedIdx
                    ),
                    'Cancel MIDI Learn mode. Throw away changes.',
                    <CancelIcon />
                  )}
              </>
          )}
          {isLayoutMode &&
            renderAppBarButton(
              () => actions.toggleLayoutMode({ isLayoutMode: false }),
              'Commit changes and exit layout-mode.',
              <CheckIcon />
            )}
          {isLayoutMode &&
            renderAppBarButton(
              () => {
                actions.goBack()
                actions.toggleLayoutMode({ isLayoutMode: false })
              },
              'Throw away changes and go back.',
              <CancelIcon />
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
      { ...MidiSlidersAction, ...ViewSettingsAction },
      dispatch
    ),
    initApp: bindActionCreators(initApp, dispatch),
    thunkCopyToNextPage: bindActionCreators(thunkCopyToNextPage, dispatch)
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

function renderAppBarButton(handleClick, title = '', icon) {
  return (
    <Tooltip disableHoverListener={false} title={title}>
      <IconButton onClick={handleClick} color='inherit'>
        {icon}
      </IconButton>
    </Tooltip>
  )
}
