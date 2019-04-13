import { MIDIMonitorLabel } from '../MIDIMonitorLabel'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import RGL, { WidthProvider } from 'react-grid-layout'
import Typography from '@material-ui/core/Typography'
import ChannelStrip from '../channel-strip/ChannelStrip'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { initApp } from '../../actions/init'
import { Actions as MidiSliderActions } from '../../actions/slider-list.js'
import { Actions as ViewSettingsActions } from '../../actions/view-settings.js'
import MidiSettingsDialogButton from '../midi-settings-dialog/MidiSettingsDialogButton'
import { makeStyles } from '@material-ui/styles'
import { SizeMe } from 'react-sizeme'
import { PAGE_TYPES } from '../../reducers/view-settings'
require('react-grid-layout/css/styles.css')
require('react-resizable/css/styles.css')

// eslint-disable-next-line new-cap
const GridLayout = WidthProvider(RGL)

const useStyles = makeStyles(styles, { useTheme: true })

function ChannelStripList(props) {
  const classes = useStyles()
  const {
    actions = {},
    sliderList = [],
    monitorVal: { driver = 'None', cC = 'None', channel = 'None' } = {},
    viewSettings: {
      isLayoutMode = true,
      isCompactHorz = true,
      isAutoArrangeMode = true,
      isSettingsMode = true,
      isSettingsDialogMode = false,
      isLiveMode = false,
      isMidiLearnMode = false,
      lastFocusedIdx,
      rowHeight = 40,
      columns = 18,
      isAutoSize,
      marginX = 0,
      marginY = 0,
      paddingX = 0,
      paddingY = 0
    }
  } = props

  useEffect(() => {
    let hasListener = false

    // Protect dialog mode from global listeners
    if (isSettingsDialogMode || isLiveMode) {
      if (hasListener) {
        document.body.removeEventListener(
          'keypress',
          handleKeyPress.bind(this, actions, isLayoutMode)
        )
        hasListener = false
      }
    } else {
      if (!hasListener) {
        document.body.addEventListener(
          'keypress',
          handleKeyPress.bind(this, actions, isLayoutMode)
        )
        hasListener = true
      }
    }

    // clean up
    return () => {
      if (hasListener) {
        document.body.removeEventListener(
          'keypress',
          handleKeyPress.bind(this, actions, isLayoutMode)
        )
        hasListener = false
      }
    }
  }, [props.viewSettings.isSettingsDialogMode, props.viewSettings.isLiveMode])

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
          const isFocused = i === lastFocusedIdx
          return (
            <div
              onDoubleClick={(e) => {
                actions.setLastFocusedIndex({ i })
                e.preventDefault()
                e.stopPropagation()
              }}
              onClick={(e) => {
                if (isMidiLearnMode) return
                actions.setLastFocusedIndex({ i })
                e.preventDefault()
                e.stopPropagation()
              }}
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
                          ? 'azure'
                          : isSettingsMode
                            ? 'beige'
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
                            toggleSettings={actions.toggleSettingsDialogMode}
                            lastFocusedIdx={lastFocusedIdx}
                            isSettingsDialogMode={isSettingsDialogMode}
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
        Hey guys, I suggest to add a page at first.
        <br />
        <br />
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
    ),
    initApp: bindActionCreators(initApp, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelStripList)
