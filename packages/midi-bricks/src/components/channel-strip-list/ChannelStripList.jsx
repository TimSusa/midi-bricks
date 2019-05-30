import { MIDIMonitorLabel } from '../MIDIMonitorLabel'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import RGL, { WidthProvider } from 'react-grid-layout'
import Typography from '@material-ui/core/Typography'
import ChannelStrip from '../channel-strip/ChannelStrip'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../../actions/slider-list.js'
import { Actions as ViewSettingsActions } from '../../actions/view-settings.js'
import MidiSettingsDialogButton from '../midi-settings-dialog/MidiSettingsDialogButton'
import { makeStyles } from '@material-ui/styles'
import { SizeMe } from 'react-sizeme'
import { PAGE_TYPES } from '../../reducers'
import { Button } from '@material-ui/core'
import { preset } from '../../utils/midi-bricks-preset-apc-40.js'
require('react-grid-layout/css/styles.css')
require('react-resizable/css/styles.css')

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelStripList)

// eslint-disable-next-line new-cap
const GridLayout = WidthProvider(RGL)

function ChannelStripList(props) {
  const classes = makeStyles(styles, { withTheme: true })()
  const {
    actions,
    sliderList =[],
    monitorVal: { driver = 'None', cC = 'None', channel = 'None' } = {},
    viewSettings: {
      pageType,
      isLayoutMode = true,
      isCompactHorz = false,
      isAutoArrangeMode = true,
      isSettingsMode = true,
      isSettingsDialogMode = false,
      // isLiveMode = false,
      isMidiLearnMode = false,
      lastFocusedIdxs,
      rowHeight,
      columns,
      isAutoSize,
      marginX,
      marginY,
      paddingX,
      paddingY
    }
  } = props

  let elem = document.body

  useEffect(() => {
    const keypressRef = (e) => handleKeyPress(actions, isLayoutMode, e)

    // Protect dialog mode from global listeners
    if (!isSettingsDialogMode) {
      console.log('Add Keypress Listener')
      elem.addEventListener('keypress', keypressRef)
    }

    // clean up
    return () => {
      console.log('clean up -> Remove Keypress Listener ')
      elem.removeEventListener('keypress', keypressRef)
    }
  }, [isSettingsDialogMode, isLayoutMode, elem, pageType, actions])

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
        onLayoutChange={
          isLayoutMode
            ? onLayoutChange.bind(this, actions, isLayoutMode)
            : () => {}
        }
      >
        {map(sliderList, (sliderEntry, idx) => {
          const { i } = sliderEntry
          const isFocused = lastFocusedIdxs.includes(i)
          return (
            <div
              onDoubleClick={(e) => {
                actions.setLastFocusedIndex({ i })
                e.preventDefault()
                e.stopPropagation()
              }}
              onClick={
                !isLayoutMode && isSettingsMode && !isSettingsDialogMode && !lastFocusedIdxs.includes(i)
                  ? (e) => {
                    actions.setLastFocusedIndex({ i })
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
                      {/* {isSettingsMode && isFocused && (
                          <MIDIMonitorLabel
                            isSettings={true}
                            midiInfo={{
                              driver: sliderEntry.driverNameInput,
                              cC: sliderEntry.listenToCc.join(', '),
                              channel: sliderEntry.midiChannelInput,
                            }}
                            midiLearnTypo={classes.midiLearnTypo}
                          />
                        )} */}
                      <ChannelStrip
                        size={size}
                        sliderEntry={sliderEntry}
                        idx={idx}
                        isDisabled={isLayoutMode}
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
                            toggleSettings={toggleSettings.bind(this, actions)}
                            sliderEntry={sliderEntry}
                            idx={idx}
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
  } else {
    return (
      <Typography variant='h4' className={classes.noMidiTypography}>
        <br />
        <br />
        Dear user, 
        I suggest for you to load an example preset.
        <br />
        <br />
        <Button
          onClick={() =>
            props.actions.loadFile({ content: preset, presetName: 'APC-40 Preset' })
          }
        >
          LOAD EXAMPLE PRESET
        </Button>
        <br />
        <br />
        Otherwise, feel free to play arround and add a page or buttons.
        You can do this with the button at the right top in the AppBar → ↑
      </Typography>
    )
  }
}

ChannelStripList.propTypes = {
  actions: PropTypes.object,
  sliderList: PropTypes.array,
  viewSettings: PropTypes.object
}

function onLayoutChange(actions, isLayoutMode, layout) {
  if (isLayoutMode) {
    actions.changeListOrder({ listOrder: layout })
  }
}

function handleKeyPress(actions, isLayoutMode, e) {
  // e: midi driver settings
  // if (e.keyCode === 101) {
  //   const {
  //     viewSettings: { isMidiLearnMode },
  //     actions,
  //   } = props
  //   if (!isMidiLearnMode) {
  //     await initApp('all')
  //     e.preventDefault()
  //     actions.toggleMidiLearnMode(true)
  //   }
  // }

  // m: midi driver settings
  if (e.keyCode === 109) {
    e.preventDefault()
    actions.togglePage({ pageType: PAGE_TYPES.MIDI_DRIVER_MODE })
  }

  // g: global midi settings
  if (e.keyCode === 103) {
    e.preventDefault()
    actions.togglePage({ pageType: PAGE_TYPES.GLOBAL_MODE })
  }

  // z: go back
  if (e.keyCode === 122) {
    e.preventDefault()
    actions.goBack()
  }

  // p: performance (live) mode
  if (e.keyCode === 112) {
    e.preventDefault()
    actions.toggleLiveMode()
  }

  // l: layout mode
  if (e.keyCode === 108) {
    e.preventDefault()
    actions.toggleLayoutMode()
  }

  // s: settings mode
  if (e.keyCode === 115) {
    if (!isLayoutMode) {
      e.preventDefault()
      actions.toggleSettingsMode()
      return false
    }
  }

  // a: auto arrange mode
  if (e.keyCode === 97) {
    if (isLayoutMode) {
      e.preventDefault()
      actions.toggleAutoArrangeMode()
    }
  }

  // d: duplicate last added element
  if (e.keyCode === 100) {
    e.preventDefault()
    actions.clone()
  }

  // v: vertical / horizontal compact mode
  if (e.keyCode === 118) {
    e.preventDefault()
    actions.toggleCompactMode()
  }

  // t: theme
  if (e.keyCode === 116) {
    e.preventDefault()
    actions.changeTheme()
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

function toggleSettings(actions, { isSettingsDialogMode }) {
  actions.toggleSettingsDialogMode({ isSettingsDialogMode })
}

function mapStateToProps({
  viewSettings,
  sliders: { sliderList, monitorVal }
}) {
  return {
    viewSettings,
    sliderList,
    monitorVal
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSliderActions, ...ViewSettingsActions },
      dispatch
    )
  }
}
