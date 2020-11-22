import React, { useState } from 'react'
import DriverExpansionPanel from '../components/DriverExpansionPanel'
import {
  FormControlLabel,
  Switch,
  Tooltip,
  Button,
  Input,
  List,
  ListItem
} from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { Actions as MidiSliderActions } from '../global-state/actions/slider-list.js'
import { Actions as ViewStuff } from '../global-state/actions/view-settings.js'
import { initApp } from '../global-state/actions/init'
import { MinMaxValInput } from '../components/midi-settings/elements/MinMaxValInput'
//import { ValueInput } from '../components/midi-settings/elements/ValueInput'

import {
  sendAppSettings,
  setActualWinCoords,
  addIpcWindowCoordsListenerOnce
} from '../utils/ipc-renderer'
//import LockIconOpen from '@material-ui/icons/LockOpen'
//import LockOpenIcon from '@material-ui/icons/LockOpen'

const {
  changeGlobalMidiInputDelay,
  changeHistoryMaxLength,
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
      //isWindowSizeLocked = true,
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
    globalMidiInputDelay,
    historyMaxLength
  } = useSelector((state) => state.viewSettings)

  let windowCoords = winCood
  const [winCoordsLocal, setWinCoordsLocal] = useState(windowCoords)
  const [isViewPanelExpanded, setIsViewPanelExpanded] = useState(false)
  const [midiInputDelayValue, setMidiInputDelayValue] = useState(
    globalMidiInputDelay
  )
  const [historyMaxLengthValue, setHistoryMaxLength] = useState(
    historyMaxLength
  )
  // const [isDevConsoleEnabledLocal, setIsDevConsoleEnabledLocal] = useState(
  //   isDevConsoleEnabled
  // )
  const [rowHeightLocal, setRowHeightLocal] = useState(rowHeight)
  const [columnsLocal, setColumnsLocal] = useState(columns)
  const [marginXLocal, setMarginXLocal] = useState(marginX)
  const [marginYLocal, setMarginYLocal] = useState(marginY)
  const [paddingXLocal, setPaddingXLocal] = useState(paddingX)
  const [paddingYLocal, setPaddingYLocal] = useState(paddingY)

  return (
    <>
      <List>
        <ListItem style={{ justifyContent: 'center' }}>
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
            OK
          </Button>
        </ListItem>

        <ListItem style={{ justifyContent: 'center' }}>
          <FormControlLabel
            control={
              <Tooltip title='Available undo steps. If you have performance trouble, consider setting it to zero.'>
                <Input
                  onChange={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setHistoryMaxLength(e.target.value)
                  }}
                  value={historyMaxLengthValue || 15}
                />
              </Tooltip>
            }
            label='Number of available undo steps'
          />
          <Button
            variant='contained'
            onClick={async () => {
              dispatch(
                changeHistoryMaxLength({
                  historyMaxLength: historyMaxLengthValue
                })
              )
              await dispatch(initApp())
            }}
          >
            OK
          </Button>
        </ListItem>
      </List>

      <DriverExpansionPanel
        label='Views'
        expanded={isViewPanelExpanded}
        noPadding={false}
        onChange={() => setIsViewPanelExpanded(!isViewPanelExpanded)}
      >
        <List>
          {!isWebMode && (
            <>
              {' '}
              <ListItem style={{ justifyContent: 'center' }}>
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
              </ListItem>
              <ListItem style={{ justifyContent: 'center' }}>
                <Button
                  disabled={false}
                  variant='outlined'
                  onClick={(e) => {
                    e.preventDefault()
                    addIpcWindowCoordsListenerOnce((windowCoo) => {
                      dispatch(
                        setElectronAppSettings({
                          windowCoords: windowCoo
                          //isWindowSizeLocked
                        })
                      )
                    })
                    setActualWinCoords(windowCoords)
                  }}
                >
                  Take over position
                </Button>
              </ListItem>
              <ListItem style={{ justifyContent: 'center' }}>
                <MinMaxValInput
                  label='x'
                  name='x'
                  toolTip='Window Coordinates: X Offset'
                  value={winCoordsLocal[0]}
                  onChange={(e) =>
                    setWinCoordsLocal([
                      parseInt(e.target.value),
                      winCoordsLocal[1],
                      winCoordsLocal[2],
                      winCoordsLocal[3]
                    ])
                  }
                />
                <MinMaxValInput
                  label='y'
                  name='y'
                  toolTip='Window Coordinates: Y Offset'
                  value={winCoordsLocal[1]}
                  onChange={(e) =>
                    setWinCoordsLocal([
                      winCoordsLocal[0],
                      parseInt(e.target.value),
                      winCoordsLocal[2],
                      winCoordsLocal[3]
                    ])
                  }
                />
                <MinMaxValInput
                  label='width'
                  name='width'
                  toolTip='Window Coordinates: width '
                  value={winCoordsLocal[2]}
                  onChange={(e) =>
                    setWinCoordsLocal([
                      winCoordsLocal[0],
                      winCoordsLocal[1],
                      parseInt(e.target.value),
                      winCoordsLocal[3]
                    ])
                  }
                />
                <MinMaxValInput
                  label='height'
                  name='height'
                  toolTip='Window Coordinates: height Offset'
                  value={winCoordsLocal[3]}
                  onChange={(e) =>
                    setWinCoordsLocal([
                      winCoordsLocal[0],
                      winCoordsLocal[1],
                      winCoordsLocal[2],
                      parseInt(e.target.value)
                    ])
                  }
                />
                <Button
                  variant='contained'
                  onClick={(e) => {
                    e.preventDefault()
                    // const val = winCoordsLocal //e.target.value
                    // const windowCoordss = val || '100,100,600,800'
                    Array.isArray(winCoordsLocal) &&
                      dispatch(
                        setElectronAppSettings({
                          windowCoords: winCoordsLocal
                          //isWindowSizeLocked: false
                        })
                      )
                    sendAppSettings({
                      windowCoords: winCoordsLocal
                      //isWindowSizeLocked: false
                    })
                    // Array.isArray(windowCoords) &&
                    //   sendAppSettings({
                    //     windowCoords
                    //     //isWindowSizeLocked: false
                    //   })
                  }}
                >
                  OK{' '}
                </Button>
                {/* <ValueInput
                  isDisabled={true}
                  icon={<LockIconOpen />}
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
                          windowCoords: windowCoordss
                          //isWindowSizeLocked: false
                        })
                      )
    
                    Array.isArray(windowCoords) &&
                      sendAppSettings({
                        windowCoords
                        //isWindowSizeLocked: false
                      })
                  }}
                /> */}
              </ListItem>
            </>
          )}

          <ListItem style={{ justifyContent: 'center' }}>
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
          </ListItem>
          <ListItem style={{ justifyContent: 'center' }}>
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
          </ListItem>
          <ListItem style={{ justifyContent: 'center' }}>
            <FormControlLabel
              control={
                <>
                  <MinMaxValInput
                    label='Columns'
                    name='columns'
                    toolTip='Number of columns in this layout.'
                    value={columnsLocal}
                    onChange={(e) =>
                      setColumnsLocal(parseInt(e.target.value, 10))
                    }
                  />
                  <Button
                    variant='contained'
                    onClick={() => {
                      dispatch(setColumns({ columns: columnsLocal }))
                    }}
                  >
                    OK{' '}
                  </Button>
                </>
              }
              label=''
            />
            <FormControlLabel
              control={
                <>
                  <MinMaxValInput
                    label='Row Height'
                    name='rowHeight'
                    toolTip='Rows have a static height.'
                    value={rowHeightLocal}
                    onChange={(e) =>
                      setRowHeightLocal(parseInt(e.target.value, 10))
                    }
                  />
                  <Button
                    variant='contained'
                    onClick={() => {
                      dispatch(
                        setRowHeight({
                          rowHeight: rowHeightLocal
                        })
                      )
                    }}
                  >
                    OK{' '}
                  </Button>
                </>
              }
              label=''
            />
          </ListItem>

          <ListItem style={{ justifyContent: 'center' }}>
            {' '}
            <FormControlLabel
              control={
                <>
                  <MinMaxValInput
                    label='X Margin'
                    name='xMargin'
                    toolTip='Set margin between items in x-direction.'
                    value={marginXLocal}
                    onChange={(e) =>
                      setMarginXLocal(parseInt(e.target.value, 10))
                    }
                  />
                  <Button
                    variant='contained'
                    onClick={() => {
                      dispatch(
                        setXMargin({
                          marginX: marginXLocal
                        })
                      )
                    }}
                  >
                    OK{' '}
                  </Button>
                </>
              }
              label=''
            />
            <FormControlLabel
              control={
                <>
                  <MinMaxValInput
                    label='Y Margin'
                    name='yMargin'
                    toolTip='Set margin between items in y-direction.'
                    value={marginYLocal}
                    onChange={(e) =>
                      setMarginYLocal(parseInt(e.target.value, 10))
                    }
                  />
                  <Button
                    variant='contained'
                    onClick={() => {
                      dispatch(
                        setYMargin({
                          marginY: marginYLocal
                        })
                      )
                    }}
                  >
                    OK{' '}
                  </Button>
                </>
              }
              label=''
            />
          </ListItem>
          <ListItem style={{ justifyContent: 'center' }}>
            {' '}
            <FormControlLabel
              control={
                <>
                  <MinMaxValInput
                    label='X Padding'
                    name='xPadding'
                    toolTip='Padding inside the container in y-direction.'
                    value={paddingXLocal}
                    onChange={(e) =>
                      setPaddingXLocal(parseInt(e.target.value, 10))
                    }
                  />
                  <Button
                    variant='contained'
                    onClick={() => {
                      dispatch(
                        setXPadding({
                          paddingX: paddingXLocal
                        })
                      )
                    }}
                  >
                    OK{' '}
                  </Button>
                </>
              }
              label=''
            />
            <FormControlLabel
              control={
                <>
                  <MinMaxValInput
                    label='Y Padding'
                    name='yPadding'
                    toolTip='Padding inside the container in y-direction.'
                    value={paddingYLocal}
                    onChange={(e) =>
                      setPaddingYLocal(parseInt(e.target.value, 10))
                    }
                  />
                  <Button
                    variant='contained'
                    onClick={() => {
                      dispatch(
                        setYPadding({
                          paddingY: paddingYLocal
                        })
                      )
                    }}
                  >
                    OK{' '}
                  </Button>
                </>
              }
              label=''
            />
          </ListItem>
        </List>
      </DriverExpansionPanel>
    </>
  )
}
