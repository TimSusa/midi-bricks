import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'
import { useDispatch, useSelector } from 'react-redux'
import { Actions as ViewSettingsAction } from '../../global-state/actions/view-settings'
import { Actions as MidiSlidersAction } from '../../global-state/actions/slider-list.js'

import { initApp } from '../../global-state/actions/init'
import { thunkToggleLayoutMode } from '../../global-state/actions/thunks/thunk-toggle-layout-mode'
import { thunkUndoRedo } from '../../global-state/actions/thunks/thunk-undo-redo'
import { thunkCopyToNextPage } from '../../global-state/actions/thunks/thunk-copy-to-next-page.js'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import UndoIcon from '@material-ui/icons/Undo'
import IconFilter from '@material-ui/icons/Filter'
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
import { PAGE_TYPES } from '../../global-state'
import { ToolTipIconButton } from '../ToolTipIconButton'
import { CopyToPageDialog } from './CopyToPageDialog'

const {
  toggleCompactMode,
  toggleAutoArrangeMode,
  //resetValues,
  triggerAllMidiElements,
  toggleSettingsMode,
  toggleMultiSelectionMode,
  delete: deleteSmth,
  // toggleLayoutMode,
  toggleMidiLearnMode,
  //goBack,
  selectMidiDriver,
  selectMidiChannel,
  selectCc,
  selectMidiDriverInput,
  //selectMidiChannelInput,
  addMidiCcListener
} = { ...ViewSettingsAction, ...MidiSlidersAction }

export const MenuAppBar = MenuAppBarCmp

function MenuAppBarCmp(props) {
  const dispatch = useDispatch()
  const theme = useTheme()
  const {
    pageType,
    isLiveMode = false,
    isLayoutMode = false,
    isSettingsMode,
    isMultiSelectionMode,
    isCompactHorz = true,
    isAutoArrangeMode = true,
    isMidiLearnMode = false,
    lastFocusedIdx,
    lastFocusedIdxs,
    lastFocusedPage
  } = useSelector((state) => state.viewSettings)

  const { presetName, monitorVal } = useSelector((state) => state.sliders)
  const classes = makeStyles(styles.bind(this, theme))()
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false)
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
          <Typography variant='h6' className={classes.typoColorStyle}>
            MIDI Bricks
          </Typography>
          {isMidiLearnMode && (
            <Typography className={classes.typoColorStyle}>
              MIDI Learn Mode Running...
            </Typography>
          )}

          {isSettingsMode && !isLayoutMode && (
            <Typography className={classes.typoColorStyle}>
              Settings Mode Running...
            </Typography>
          )}
          {isLayoutMode && (
            <>
              <Typography className={classes.typoColorStyle}>
                Layout Mode Running...
              </Typography>
              <ToolTipIconButton
                handleClick={() => dispatch(toggleCompactMode())}
                title={
                  isCompactHorz ? 'Gravity horizontal' : 'Gravity vertical'
                }
                icon={isCompactHorz ? <SwapHorizIcon /> : <SwapVertIcon />}
              />
              <ToolTipIconButton
                handleClick={() => dispatch(toggleAutoArrangeMode())}
                title={
                  isAutoArrangeMode ? 'Automatic Gravity' : 'Static Gravity'
                }
                icon={
                  isAutoArrangeMode ? (
                    <AutoArrangeModeIcon />
                  ) : (
                    <AutoArrangeModeIconFalse />
                  )
                }
              />
              <AddMenu />
              <ToolTipIconButton
                handleClick={async () =>
                  await dispatch(thunkToggleLayoutMode({ isLayoutMode: false }))
                }
                title={'Commit changes and exit layout-mode.'}
                icon={<CheckIcon />}
                isInvisible={!isLayoutMode}
              />

              <ToolTipIconButton
                handleClick={async () => {
                  await dispatch(thunkToggleLayoutMode({ isLayoutMode: false }))
                }}
                title={'Throw away changes and go back.'}
                icon={<CancelIcon />}
                isInvisible={!isLayoutMode}
              />
            </>
          )}
          {pageType === PAGE_TYPES.GLOBAL_MODE && (
            <>
              <Typography className={classes.typoColorStyle}>
                {presetName || ''}
              </Typography>
              {/* <Button
                className={classes.resetButton}
                variant='contained'
                onClick={(e) => dispatch(resetValues()}
              >
                Reset To Saved Values
              </Button> */}
              <Button
                className={classes.resetButton}
                variant='contained'
                onClick={() => dispatch(triggerAllMidiElements())}
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
                onClick={async () => await dispatch(initApp())}
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
          {[PAGE_TYPES.HOME_MODE].includes(pageType) && (
            <Fragment>
              <ToolTipIconButton
                handleClick={() => dispatch(toggleSettingsMode())}
                title={'Switch to Settings Mode.'}
                isInvisible={isMidiLearnMode || isLayoutMode}
                icon={
                  <ViewSettingsIcon
                    color={isSettingsMode ? 'error' : 'inherit'}
                  />
                }
              />
              <ToolTipIconButton
                title='Switch to Multi SelectionMode'
                isInvisible={isMidiLearnMode || !isSettingsMode || isLayoutMode}
                icon={
                  <IconFilter
                    color={isMultiSelectionMode ? 'error' : 'inherit'}
                  ></IconFilter>
                }
                handleClick={() => dispatch(toggleMultiSelectionMode())}
              />
              {Array.isArray(lastFocusedIdxs) && lastFocusedIdxs.length > 0 && (
                <>
                  <ToolTipIconButton
                    handleClick={() => setIsCopyDialogOpen(true)}
                    title={'Copy to page.'}
                    isInvisible={isMidiLearnMode || isLayoutMode}
                    icon={<CopyIcon />}
                  />
                  {isCopyDialogOpen && (
                    <CopyToPageDialog
                      isOpen={isCopyDialogOpen}
                      onOk={(pageId) => {
                        dispatch(thunkCopyToNextPage(pageId))
                        setIsCopyDialogOpen(false)
                      }}
                      onClose={() => setIsCopyDialogOpen(false)}
                    ></CopyToPageDialog>
                  )}

                  <ToolTipIconButton
                    handleClick={() => {
                      lastFocusedIdxs.forEach((id) => {
                        dispatch(deleteSmth({ i: id, lastFocusedPage }))
                      })
                    }}
                    title={'Delete.'}
                    isInvisible={isMidiLearnMode || isLayoutMode}
                    icon={<DeleteIcon />}
                  />
                </>
              )}
              <ToolTipIconButton
                handleClick={async () =>
                  await dispatch(thunkToggleLayoutMode({ isLayoutMode: true }))
                }
                title={'Switch to Layout Mode.'}
                isInvisible={isMidiLearnMode || isLayoutMode}
                icon={<LayoutIcon />}
              />

              <ToolTipIconButton
                handleClick={toggleMidiLearn}
                title='Chose assigned element and finalize MIDI-Learn Mode.'
                icon={<CheckIcon />}
                isInvisible={!isMidiLearnMode}
              />
              <ToolTipIconButton
                handleClick={toggleMidiLearn}
                title='Switch to MIDI Learn Mode. Please, click element for listening to changes.'
                icon={<MidiLearnIcon />}
                isInvisible={
                  lastFocusedIdxs.length <= 0 || !isSettingsMode || isLayoutMode
                }
              />
              <ToolTipIconButton
                handleClick={cancelMidiLeanMode}
                title={'Cancel MIDI Learn mode. Throw away changes.'}
                isInvisible={!isMidiLearnMode || isLayoutMode}
                icon={<CancelIcon />}
              />
              <ToolTipIconButton
                handleClick={() => dispatch(thunkUndoRedo({ offset: -1 }))}
                title='Undo'
                icon={<UndoIcon />}
                isInvisible={
                  !JSON.parse(window.sessionStorage.getItem('history')) ||
                  JSON.parse(window.sessionStorage.getItem('history')).length <
                    1
                }
              />
            </Fragment>
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
  async function cancelMidiLeanMode() {
    await dispatch(initApp())
    dispatch(toggleMidiLearnMode({ isMidiLearnMode: !isMidiLearnMode }))
  }
  async function toggleMidiLearn() {
    if (isMidiLearnMode) {
      if (!monitorVal) return
      dispatch(
        selectMidiDriver({
          driverName: monitorVal.driver,
          i: lastFocusedIdx,
          lastFocusedPage
        })
      )

      dispatch(
        selectMidiChannel({
          val: `${monitorVal.channel}`,
          i: lastFocusedIdx,
          lastFocusedPage
        })
      )
      dispatch(
        selectCc({
          val: [`${monitorVal.cC}`],
          i: lastFocusedIdx,
          lastFocusedPage
        })
      )
      dispatch(
        selectMidiDriverInput({
          driverNameInput: monitorVal.driver,
          i: lastFocusedIdx,
          lastFocusedPage
        })
      )
      // dispatch(selectMidiChannelInput({
      //   val: `${monitorVal.channel}`,
      //   i: lastFocusedIdx,
      //   lastFocusedPage
      // })

      dispatch(
        addMidiCcListener({
          val: [`${monitorVal.cC}`],
          i: lastFocusedIdx,
          lastFocusedPage
        })
      )

      await initApp()
      //handleClose(setAncEl)
    } else {
      await initApp('all')
      //handleClose(setAncEl)
    }
    dispatch(toggleMidiLearnMode({ isMidiLearnMode: !isMidiLearnMode }))
  }
}

MenuAppBarCmp.propTypes = {
  handleDrawerToggle: PropTypes.any
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
