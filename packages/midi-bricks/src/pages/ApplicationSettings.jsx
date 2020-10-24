import React, { useState } from 'react'
import DriverExpansionPanel from '../components/DriverExpansionPanel'
import {
  FormControlLabel,
  Switch,
  Tooltip,
  Button,
  Input
} from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { Actions as MidiSliderActions } from '../global-state/actions/slider-list.js'
import { Actions as ViewStuff } from '../global-state/actions/view-settings.js'
import { initApp } from '../global-state/actions/init'
import { MinMaxValInput } from '../components/midi-settings/elements/MinMaxValInput'
import { ValueInput } from '../components/midi-settings/elements/ValueInput'

import {
  sendAppSettings,
  setActualWinCoords,
  addIpcWindowCoordsListenerOnce
} from '../utils/ipc-renderer'
import LockIcon from '@material-ui/icons/Lock'
import LockOpenIcon from '@material-ui/icons/LockOpen'

const {
  changeGlobalMidiInputDelay,
  // setFullscreenOnLivemode,
  setElectronAppSettings,
  changeTheme,
  toggleAutosize,
  setColumns,
  setRowHeight,
  setXMargin,
  setYMargin,
  setXPadding,
  setYPadding
} = { ...MidiSliderActions, ...ViewStuff }

export default ApplicationSettings

const isWebMode = process.env.REACT_APP_IS_WEB_MODE === 'true'

function ApplicationSettings() {
  const dispatch = useDispatch()
  const {
    electronAppSettings: {
      isDevConsoleEnabled = false,
      isWindowSizeLocked = true,
      windowCoords: winCood = [69, 69, 690, 690]
    } = {},
    columns = 18,
    rowHeight = 40,
    isAutoSize = false,
    isChangedTheme = false,
    // isFullscreenOnLivemode = false,
    marginX = 8,
    marginY = 8,
    paddingX = 8,
    paddingY = 8,
    globalMidiInputDelay
  } = useSelector((state) => state.viewSettings)

  let windowCoords = winCood
  const [isViewPanelExpanded, setIsViewPanelExpanded] = useState(false)
  const [midiInputDelayValue, setMidiInputDelayValue] = useState(
    globalMidiInputDelay
  )

  return (
    <React.Fragment>
      <FormControlLabel
        control={
          <Tooltip title='Increase to >10 or >15, if incoming MIDI data is displayed with a lag on your system (caused by high amounts of data). Otherwise you can set lower values around 5 to display incoming MIDI data immediately and accurately for softer slider movements.'>
            <Input
              onChange={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setMidiInputDelayValue(e.target.value)
              }}
              value={midiInputDelayValue || 15}
            />
          </Tooltip>
        }
        label='Global Midi Input Delay'
      />
      <Button
        variant='contained'
        onClick={async () => {
          dispatch(
            changeGlobalMidiInputDelay({
              globalMidiInputDelay: midiInputDelayValue
            })
          )
          await dispatch(initApp())
        }}
      >
        OK{' '}
      </Button>
      <DriverExpansionPanel
        label='Views'
        expanded={isViewPanelExpanded}
        noPadding={false}
        onChange={() => setIsViewPanelExpanded(!isViewPanelExpanded)}
      >
        {/* {isWebMode && (
          <FormControlLabel
            control={
              <Tooltip title='Set to fullscreen, when switching to livemode'>
                <Switch
                  checked={isFullscreenOnLivemode}
                  onChange={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    dispatch(setFullscreenOnLivemode())
                  }}
                  value={isFullscreenOnLivemode}
                  color='secondary'
                />
              </Tooltip>
            }
            label='Live Mode Fullscreen'
          />
        )} */}

        {!isWebMode && (
          <FormControlLabel
            control={
              <Tooltip title='Show developer console from startup. Keep in mind, that this settings comes into play after restart.'>
                <Switch
                  checked={isDevConsoleEnabled}
                  onChange={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const payload = {
                      isDevConsoleEnabled: !isDevConsoleEnabled
                    }
                    dispatch(setElectronAppSettings(payload))
                    sendAppSettings(payload)
                  }}
                  value={isDevConsoleEnabled}
                  color='secondary'
                />
              </Tooltip>
            }
            label='Show Dev Console'
          />
        )}

        {!isWebMode && (
          <>
            <FormControlLabel
              icon={isWindowSizeLocked ? <LockIcon /> : <LockOpenIcon />}
              control={
                <Tooltip title='Lock startup window position and size, so changes will not be saved immediately.'>
                  <Switch
                    checked={isWindowSizeLocked}
                    onChange={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const payload = {
                        isWindowSizeLocked: !isWindowSizeLocked
                      }
                      sendAppSettings(payload)
                      dispatch(setElectronAppSettings(payload))
                    }}
                    value={isWindowSizeLocked}
                    color='secondary'
                  />
                </Tooltip>
              }
              label='Lock Initial Window Pos/Size'
            />
            <Button
              disabled={isWindowSizeLocked}
              variant='outlined'
              onClick={(e) => {
                e.preventDefault()
                addIpcWindowCoordsListenerOnce((windowCoo) =>
                  dispatch(
                    setElectronAppSettings({
                      windowCoords: windowCoo,
                      isWindowSizeLocked
                    })
                  )
                )
                setActualWinCoords()
              }}
            >
              Take over position
            </Button>

            <ValueInput
              isDisabled={isWindowSizeLocked}
              icon={<LockIcon />}
              label='Change Window Size'
              name='app-window-coords'
              value={
                Array.isArray(windowCoords)
                  ? windowCoords.join(',')
                  : '100,100,600,800'
              }
              onChange={(e) => {
                e.preventDefault()
                const val = e.target.value
                const windowCoordss = (val || '100,100,600,800')
                  .split(',')
                  .map((v) => parseInt(v, 10))
                Array.isArray(windowCoordss) &&
                  dispatch(
                    setElectronAppSettings({
                      windowCoords: windowCoordss,
                      isWindowSizeLocked: false
                    })
                  )

                !isWindowSizeLocked &&
                  Array.isArray(windowCoords) &&
                  sendAppSettings({
                    windowCoords,
                    isWindowSizeLocked: false
                  })
              }}
            />
          </>
        )}

        <FormControlLabel
          control={
            <Tooltip title='Toggle Theme'>
              <Switch
                checked={isChangedTheme}
                onChange={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  dispatch(changeTheme({}))
                }}
                value={isChangedTheme}
                color='secondary'
              />
            </Tooltip>
          }
          label='Toggle Theme'
        />

        <FormControlLabel
          control={
            <Tooltip title='If true, the container height swells and contracts to fit contents'>
              <Switch
                checked={isAutoSize}
                onChange={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  dispatch(toggleAutosize({}))
                }}
                value={isAutoSize}
                color='secondary'
              />
            </Tooltip>
          }
          label='Auto Size'
        />

        <MinMaxValInput
          label='Columns'
          name='columns'
          toolTip='Number of columns in this layout.'
          value={columns}
          onChange={(e) =>
            dispatch(setColumns({ columns: parseInt(e.target.value, 10) }))
          }
        />
        <MinMaxValInput
          label='Row Height'
          name='rowHeight'
          toolTip='Rows have a static height.'
          value={rowHeight}
          onChange={(e) =>
            dispatch(
              setRowHeight({
                rowHeight: parseInt(e.target.value, 10)
              })
            )
          }
        />
        <MinMaxValInput
          label='X Margin'
          name='xMargin'
          toolTip='Set margin between items in x-direction.'
          value={marginX}
          onChange={(e) =>
            dispatch(
              setXMargin({
                marginX: parseInt(e.target.value, 10)
              })
            )
          }
        />
        <MinMaxValInput
          label='Y Margin'
          name='yMargin'
          toolTip='Set margin between items in y-direction.'
          value={marginY}
          onChange={(e) =>
            dispatch(
              setYMargin({
                marginY: parseInt(e.target.value, 10)
              })
            )
          }
        />

        <MinMaxValInput
          label='X Container Padding'
          name='xPadding'
          toolTip='Padding inside the container in y-direction.'
          value={paddingX}
          onChange={(e) =>
            dispatch(
              setXPadding({
                paddingX: parseInt(e.target.value, 10)
              })
            )
          }
        />
        <MinMaxValInput
          label='Y Container Padding'
          name='yPadding'
          toolTip='Padding inside the container in y-direction.'
          value={paddingY}
          onChange={(e) =>
            dispatch(
              setYPadding({
                paddingY: parseInt(e.target.value, 10)
              })
            )
          }
        />
      </DriverExpansionPanel>
    </React.Fragment>
  )
}
