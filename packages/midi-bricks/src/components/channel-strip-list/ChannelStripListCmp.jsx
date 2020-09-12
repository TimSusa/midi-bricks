import { MIDIMonitorLabel } from '../MIDIMonitorLabel'
import React, { useEffect } from 'react'
import { map } from 'lodash'
import RGL, { WidthProvider } from 'react-grid-layout'
import Typography from '@material-ui/core/Typography'
import ChannelStrip from '../channel-strip/ChannelStrip'
import { useSelector, useDispatch } from 'react-redux'
import { Actions as MidiSliderActions } from '../../actions/slider-list.js'
import { Actions as ViewSettingsActions } from '../../actions/view-settings.js'
import { thunkChangeListOrder } from '../../actions/thunks/thunk-change-list-order'
import { thunkLiveModeToggle } from '../../actions/thunks/thunk-live-mode-toggle'
import MidiSettingsDialogButton from '../midi-settings-dialog/MidiSettingsDialogButton'
import { makeStyles, useTheme } from '@material-ui/styles'
import { SizeMe } from 'react-sizeme'
import { PAGE_TYPES } from '../../reducers'
import { Button } from '@material-ui/core'
import { thunkLoadFile } from '../../actions/thunks/thunk-load-file'
import { preset } from '../../utils/midi-bricks-preset-apc-40.js'
require('react-grid-layout/css/styles.css')
require('react-resizable/css/styles.css')

const {
  //goBack,
  toggleLayoutMode,
  toggleSettingsMode,
  toggleAutoArrangeMode,
  clone,
  toggleCompactMode,
  changeTheme,
  togglePage,
  setLastFocusedIndex,
  toggleSettingsDialogMode
} = { ...MidiSliderActions, ...ViewSettingsActions }

export const ChannelStripList = ChannelStripListCmp

ChannelStripList.propTypes = {}

// eslint-disable-next-line new-cap
const GridLayout = WidthProvider(RGL)

function ChannelStripListCmp() {
  const dispatch = useDispatch()
  const {
    pageType,
    isLayoutMode = true,
    isCompactHorz = false,
    isAutoArrangeMode = true,
    isSettingsMode = true,
    isSettingsDialogMode = false,
    isLiveMode = false,
    isMidiLearnMode = false,
    lastFocusedIdxs = [],
    lastFocusedPage,
    rowHeight,
    columns,
    isAutoSize,
    marginX,
    marginY,
    paddingX,
    paddingY
  } = useSelector((state) => state.viewSettings)
  const { sliderList = [], monitorVal: monTmp } = useSelector(
    (state) => state.sliders
  )
  const { driver, cC, channel } = monTmp || {
    driver: 'None',
    cC: 'None',
    channel: 'None'
  }
  const hasPages = useSelector((state) => Object.keys(state.pages).length > 1)
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()

  let elem = document.body

  useEffect(() => {
    const keypressRef = (e) => handleKeyPress(dispatch, isLayoutMode, e)

    // Protect dialog mode from global listeners
    if (!isSettingsDialogMode && !isLiveMode) {
      elem.addEventListener('keypress', keypressRef)
    }

    // clean up
    return () => {
      elem.removeEventListener('keypress', keypressRef)
    }
  }, [isSettingsDialogMode, isLayoutMode, isLiveMode, elem, pageType, dispatch])

  if (sliderList && sliderList.length > 0) {
    return (
      <GridLayout
        margin={[marginX, marginY]}
        containerPadding={[paddingX, paddingY]}
        autoSize={isAutoSize}
        style={{ bottom: 48, top: 8, height: 'calc(100vh - 120px)' }}
        rowHeight={rowHeight}
        cols={columns}
        useCSSTransforms
        //isRearrangeable={isAutoArrangeMode}
        preventCollision={!isAutoArrangeMode}
        isDraggable={isLayoutMode}
        isResizable={isLayoutMode}
        compactType={isCompactHorz ? 'horizontal' : 'vertical'}
        layout={sliderList}
        onLayoutChange={isLayoutMode ? onLayoutChange.bind(this) : () => {}}
      >
        {map(sliderList, (sliderEntry, idx) => {
          const { i } = sliderEntry
          const isFocused = lastFocusedIdxs.includes(i)
          return (
            <div
              onDoubleClick={(e) => {
                dispatch(setLastFocusedIndex({ i }))
                e.preventDefault()
                e.stopPropagation()
              }}
              onClick={
                !isLayoutMode &&
                isSettingsMode &&
                !isSettingsDialogMode &&
                !lastFocusedIdxs.includes(i)
                  ? (e) => {
                      dispatch(setLastFocusedIndex({ i }))
                      e.preventDefault()
                      e.stopPropagation()
                    }
                  : () => {}
              }
              key={i}
              style={
                (isMidiLearnMode || isSettingsMode) &&
                isFocused && {
                  borderRadius: 3,
                  overflow: isMidiLearnMode && 'hidden',
                  boxShadow: isSettingsMode
                    ? '0 0 3px 3px rgb(24, 154, 157)'
                    : '0 0 3px 3px rgb(212, 28, 138)'
                }
              }
            >
              <SizeMe monitorHeight>
                {({ size }) => {
                  return (
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 3,
                        background: isLayoutMode
                          ? '#f0ffff87'
                          : isSettingsMode
                          ? '#f5f5dcb3'
                          : isMidiLearnMode
                          ? '#cfcfcf'
                          : 'transparent'
                      }}
                    >
                      {isMidiLearnMode && isFocused && (
                        <MIDIMonitorLabel
                          isSettings={false}
                          midiInfo={{ driver, cC, channel }}
                          midiLearnTypo={classes.midiLearnTypo}
                        />
                      )}
                      <ChannelStrip
                        idx={idx}
                        size={size}
                        isDisabled={isLayoutMode || isSettingsMode}
                        isMidiLearnMode={isMidiLearnMode}
                      />
                      {!isMidiLearnMode && isSettingsMode && !isLayoutMode && (
                        <span
                          className='settings'
                          style={{
                            position: 'absolute',
                            right: -12,
                            top: -16,
                            cursor: 'pointer'
                          }}
                        >
                          <MidiSettingsDialogButton
                            isOpen={
                              !!(
                                isSettingsDialogMode &&
                                lastFocusedIdxs !== undefined &&
                                isFocused
                              )
                            }
                            toggleSettings={toggleSettings.bind(
                              this,
                              lastFocusedPage,
                              i
                            )}
                            sliderEntry={sliderEntry}
                          />
                        </span>
                      )}
                    </div>
                  )
                }}
              </SizeMe>
            </div>
          )
        })}
      </GridLayout>
    )
  } else if (!hasPages) {
    return (
      <div style={{ height: 'calc(100vh - 132px)', background: 'white' }}>
        <Typography variant='h4' className={classes.noMidiTypography}>
          <br />
          <br />
          <Button
            variant='outlined'
            onClick={async () =>
              await dispatch(thunkLoadFile(preset, preset.presetName))
            }
          >
            LOAD EXAMPLE
          </Button>
          <br />
          <br />
          <img alt={'cubefx'} src={'cube_fx.gif'}></img>
        </Typography>
      </div>
    )
  } else {
    return <></>
  }
  async function onLayoutChange(layout) {
    if (isLayoutMode) {
      dispatch(thunkChangeListOrder(layout, lastFocusedPage))
    }
  }
  function toggleSettings(lastFocusedPage, i, { isSettingsDialogMode }) {
    dispatch(
      toggleSettingsDialogMode({ i, lastFocusedPage, isSettingsDialogMode })
    )
  }
}

function handleKeyPress(dispatch, isLayoutMode, e) {
  // e: midi driver settings
  // if (e.keyCode === 101) {
  //   const {
  //     viewSettings: { isMidiLearnMode },
  //     actions,
  //   } = props
  //   if (!isMidiLearnMode) {
  //     await initApp('all')
  //     e.preventDefault()
  //     dispatch(toggleMidiLearnMode(true))
  //   }
  // }

  // m: midi driver settings
  if (e.keyCode === 109) {
    e.preventDefault()
    dispatch(togglePage({ pageType: PAGE_TYPES.MIDI_DRIVER_MODE }))
  }

  // g: global midi settings
  if (e.keyCode === 103) {
    e.preventDefault()
    dispatch(togglePage({ pageType: PAGE_TYPES.GLOBAL_MODE }))
  }

  // z: go back
  if (e.keyCode === 122) {
    e.preventDefault()
    //dispatch(goBack())
  }

  // p: performance (live) mode
  if (e.keyCode === 112) {
    e.preventDefault()
    dispatch(thunkLiveModeToggle())
  }

  // l: layout mode
  if (e.keyCode === 108) {
    e.preventDefault()
    dispatch(toggleLayoutMode())
  }

  // s: settings mode
  if (e.keyCode === 115) {
    if (!isLayoutMode) {
      e.preventDefault()
      dispatch(toggleSettingsMode())
      return false
    }
  }

  // a: auto arrange mode
  if (e.keyCode === 97) {
    if (isLayoutMode) {
      e.preventDefault()
      dispatch(toggleAutoArrangeMode())
    }
  }

  // d: duplicate last added element
  if (e.keyCode === 100) {
    e.preventDefault()
    dispatch(clone())
  }

  // v: vertical / horizontal compact mode
  if (e.keyCode === 118) {
    e.preventDefault()
    dispatch(toggleCompactMode())
  }

  // t: theme
  if (e.keyCode === 116) {
    e.preventDefault()
    dispatch(changeTheme())
  }
}

function styles(theme) {
  return {
    channelList: {
      display: 'flex'
      // overflowX: 'scroll'
    },
    midiLearnTypo: {
      color: theme.palette.primary.contrastText,
      fontSize: 12,
      fontWeight: 500
    }
  }
}
