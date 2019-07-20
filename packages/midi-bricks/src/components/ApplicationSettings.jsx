import React, { useState, useEffect } from 'react'
import DriverExpansionPanel from './DriverExpansionPanel'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../actions/slider-list.js'
import { Actions as ViewStuff } from '../actions/view-settings.js'
import { thunkLiveModeToggle } from '../actions/thunks/thunk-live-mode-toggle'
import { MinMaxValInput } from './midi-settings/elements/MinMaxValInput'
import { ValueInput } from './midi-settings/elements/ValueInput'
import { FormControlLabel, Switch, Tooltip, Button } from '@material-ui/core'
import { PropTypes } from 'prop-types'
import {
  sendAppSettings,
  setActualWinCoords,
  addIpcWindowCoordsListenerOnce
} from '../utils/ipc-renderer'
import LockIcon from '@material-ui/icons/Lock'
import LockOpenIcon from '@material-ui/icons/LockOpen'

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationSettings)

const isWebMode = process.env.REACT_APP_IS_WEB_MODE === 'true'

ApplicationSettings.propTypes = {
  actions: PropTypes.object,
  thunkLiveModeToggle: PropTypes.func,
  viewSettings: PropTypes.object
}

function ApplicationSettings(props) {
  const {
    actions,
    thunkLiveModeToggle,
    viewSettings: {
      electronAppSettings: {
        isDevConsoleEnabled = false,
        isAllowedToUpdate = true,
        isAutoDownload = false,
        isAllowedDowngrade = false,
        isWindowSizeLocked = true,
        windowCoords: winCood = [69, 69, 690, 690]
      } = {},
      columns = 18,
      rowHeight = 40,
      isAutoSize = false,
      isChangedTheme = false,
      isFullscreenOnLivemode = false,
      marginX = 8,
      marginY = 8,
      paddingX = 8,
      paddingY = 8
    }
  } = props
  let windowCoords = winCood
  const [isViewPanelExpanded, setIsViewPanelExpanded] = useState(false)
  const [isUpdatePanelExpanded, setIsUpdatePanelExpanded] = useState(false)

  useEffect(() => {
    thunkLiveModeToggle({ isLiveMode: false })
  }, [thunkLiveModeToggle])

  return (
    <React.Fragment>
      <DriverExpansionPanel
        label='Updates'
        expanded={isUpdatePanelExpanded}
        noPadding={false}
        onChange={(e) => setIsUpdatePanelExpanded(!isUpdatePanelExpanded)}
      >
        {!isWebMode && (
          <FormControlLabel
            control={
              <Tooltip title='You can disable the check for updates here. Keep in mind, that this settings comes into play after restart.'>
                <Switch
                  checked={isAllowedToUpdate}
                  onChange={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const payload = {
                      isAllowedToUpdate: !isAllowedToUpdate
                    }
                    sendAppSettings(payload)
                    actions.setElectronAppSettings(payload)
                  }}
                  value={isAllowedToUpdate}
                  color='secondary'
                />
              </Tooltip>
            }
            label='Initial Update Check'
          />
        )}

        {!isWebMode && (
          <FormControlLabel
            disabled={!isAllowedToUpdate}
            control={
              <Tooltip title='Whether to automatically download an update when it is found.'>
                <Switch
                  checked={isAutoDownload}
                  onChange={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const payload = {
                      isAutoDownload: !isAutoDownload
                    }
                    sendAppSettings(payload)
                    actions.setElectronAppSettings(payload)
                  }}
                  value={isAutoDownload}
                  color='secondary'
                />
              </Tooltip>
            }
            label='Automatic Download (experimental)'
          />
        )}

        {!isWebMode && (
          <FormControlLabel
            disabled={!isAllowedToUpdate}
            control={
              <Tooltip title='Whether to allow version downgrade (when a user from the beta channel wants to go back to the stable channel). Defaults to `true` if application version contains prerelease components (e.g. `0.12.1-alpha.1`, here `alpha` is a prerelease component), otherwise `false`.'>
                <Switch
                  checked={isAllowedDowngrade}
                  onChange={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const payload = {
                      isAllowedDowngrade: !isAllowedDowngrade,
                      isAllowedPrerelease: !isAllowedDowngrade
                    }
                    sendAppSettings(payload)
                    actions.setElectronAppSettings(payload)
                  }}
                  value={isAllowedDowngrade}
                  color='secondary'
                />
              </Tooltip>
            }
            label='Rollback Update (experimental)'
          />
        )}
      </DriverExpansionPanel>
      <DriverExpansionPanel
        label='Views'
        expanded={isViewPanelExpanded}
        noPadding={false}
        onChange={(e) => setIsViewPanelExpanded(!isViewPanelExpanded)}
      >
        {isWebMode && (
          <FormControlLabel
            control={
              <Tooltip title='Set to fullscreen, when switching to livemode'>
                <Switch
                  checked={isFullscreenOnLivemode}
                  onChange={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    actions.setFullscreenOnLivemode()
                  }}
                  value={isFullscreenOnLivemode}
                  color='secondary'
                />
              </Tooltip>
            }
            label='Live Mode Fullscreen'
          />
        )}

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
                    actions.setElectronAppSettings(payload)
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
                      actions.setElectronAppSettings(payload)
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
                addIpcWindowCoordsListenerOnce((windowCoords) =>
                  actions.setElectronAppSettings({
                    windowCoords,
                    isWindowSizeLocked
                  })
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
                const windowCoords = (val || '100,100,600,800')
                  .split(',')
                  .map((val) => parseInt(val, 10))
                Array.isArray(windowCoords) &&
                  actions.setElectronAppSettings({
                    windowCoords,
                    isWindowSizeLocked: false
                  })

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
                  actions.changeTheme({})
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
                  actions.toggleAutosize({})
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
            actions.setColumns({ columns: parseInt(e.target.value, 10) })
          }
        />
        <MinMaxValInput
          label='Row Height'
          name='rowHeight'
          toolTip='Rows have a static height.'
          value={rowHeight}
          onChange={(e) =>
            actions.setRowHeight({
              rowHeight: parseInt(e.target.value, 10)
            })
          }
        />
        <MinMaxValInput
          label='X Margin'
          name='xMargin'
          toolTip='Set margin between items in x-direction.'
          value={marginX}
          onChange={(e) =>
            actions.setXMargin({
              marginX: parseInt(e.target.value, 10)
            })
          }
        />
        <MinMaxValInput
          label='Y Margin'
          name='yMargin'
          toolTip='Set margin between items in y-direction.'
          value={marginY}
          onChange={(e) =>
            actions.setYMargin({
              marginY: parseInt(e.target.value, 10)
            })
          }
        />

        <MinMaxValInput
          label='X Container Padding'
          name='xPadding'
          toolTip='Padding inside the container in y-direction.'
          value={paddingX}
          onChange={(e) =>
            actions.setXPadding({
              paddingX: parseInt(e.target.value, 10)
            })
          }
        />
        <MinMaxValInput
          label='Y Container Padding'
          name='yPadding'
          toolTip='Padding inside the container in y-direction.'
          value={paddingY}
          onChange={(e) =>
            actions.setYPadding({
              paddingY: parseInt(e.target.value, 10)
            })
          }
        />
      </DriverExpansionPanel>
    </React.Fragment>
  )
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSliderActions, ...ViewStuff },
      dispatch
    ),
    thunkLiveModeToggle: bindActionCreators(thunkLiveModeToggle, dispatch)
  }
}

function mapStateToProps({ sliders: { sliderList, midi }, viewSettings }) {
  return {
    sliderList,
    midi,
    viewSettings
  }
}
