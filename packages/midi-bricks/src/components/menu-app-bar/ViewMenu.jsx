import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { initApp } from '../../actions/init'
import { Actions as MidiSlidersAction } from '../../actions/slider-list.js'
import { Actions as ViewSettingsAction } from '../../actions/view-settings'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import ViewSettingsIcon from '@material-ui/icons/Settings'
import MidiLearnIcon from '@material-ui/icons/SettingsInputSvideo'
import { Tooltip, FormControlLabel, Switch } from '@material-ui/core'

const ViewMenu = props => {
  const {
    viewSettings: {
      isLayoutMode = true,
      isAutoArrangeMode = true,
      isChangedTheme = false,
      isSettingsMode = false,
      isCompactHorz = true,
      isLiveMode = false,
      isMidiLearnMode = false,
      lastFocusedIdx = '',
    },
    actions,
    initMidiLearn,
    initApp,
    monitorVal,
  } = props

  const [ancEl, setAncEl] = useState(null)
  const isOpen = Boolean(ancEl)

  return (
    <React.Fragment>
      {!isMidiLearnMode && (
        <IconButton
          aria-owns={isOpen ? 'menu-appbar' : null}
          aria-haspopup="true"
          onClick={({ currentTarget }) => setAncEl(currentTarget)}
          color="inherit"
        >
          <Tooltip title="View Modes">
            <ViewSettingsIcon />
          </Tooltip>
        </IconButton>
      )}
      <Menu
        id="menu-appbar"
        anchorEl={ancEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isOpen}
        onClose={handleClose.bind(this, setAncEl)}
      >
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={isLayoutMode}
                onChange={toggleLayoutMode.bind(
                  this,
                  actions.toggleLayoutMode,
                  setAncEl
                )}
                value={isLayoutMode}
                color="secondary"
              />
            }
            label="Layout - l"
          />
        </MenuItem>
        {!isLayoutMode && (
          <MenuItem>
            <FormControlLabel
              control={
                <Switch
                  checked={isSettingsMode}
                  onChange={toggleSettingsMode.bind(
                    this,
                    actions.toggleSettingsMode,
                    setAncEl
                  )}
                  value={isSettingsMode}
                  color="secondary"
                />
              }
              label="Settings - s"
            />
          </MenuItem>
        )}
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={isCompactHorz}
                onChange={toggleCompactMode.bind(
                  this,
                  actions.toggleCompactMode,
                  setAncEl
                )}
                value={isCompactHorz}
                color="secondary"
              />
            }
            label="Gravity Horz/Vert - v"
          />
        </MenuItem>

        {isLayoutMode && (
          <MenuItem>
            <FormControlLabel
              control={
                <Switch
                  checked={isAutoArrangeMode}
                  onChange={handleChangeAutoArrangeMode.bind(
                    this,
                    actions.toggleAutoArrangeMode,
                    setAncEl
                  )}
                  value={isAutoArrangeMode}
                  color="secondary"
                />
              }
              label="Auto Gravity  - a"
            />
          </MenuItem>
        )}
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={isChangedTheme}
                onChange={handleChangeTheme.bind(
                  this,
                  actions.changeTheme,
                  setAncEl
                )}
                value={isChangedTheme}
                color="secondary"
              />
            }
            label="Theme  - t"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={isLiveMode}
                onChange={toggleLiveMode.bind(
                  this,
                  actions.toggleLiveMode,
                  setAncEl
                )}
                value={isLiveMode}
                color="secondary"
              />
            }
            label="Live  - p"
          />
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}

ViewMenu.propTypes = {
  actions: PropTypes.object.isRequired,
}

const handleChangeTheme = (changeTheme, setAncEl) => {
  changeTheme()
  handleClose(setAncEl)
}

const handleClose = setAncEl => {
  setAncEl(null)
}

const toggleLiveMode = (toggleLiveMode, setAncEl) => {
  toggleLiveMode()
  handleClose(setAncEl)
}

const toggleLayoutMode = (toggleLayoutMode, setAncEl) => {
  toggleLayoutMode()
  handleClose(setAncEl)
}

const handleChangeAutoArrangeMode = (toggleAutoArrangeMode, setAncEl) => {
  toggleAutoArrangeMode()
  handleClose(setAncEl)
}

const toggleCompactMode = (toggleCompactMode, setAncEl) => {
  toggleCompactMode()
  handleClose(setAncEl)
}

const toggleSettingsMode = (toggleSettingsMode, setAncEl) => {
  toggleSettingsMode()
  handleClose(setAncEl)
}

function mapStateToProps({ viewSettings, sliders: { monitorVal } }) {
  return {
    viewSettings,
    monitorVal,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSlidersAction, ...ViewSettingsAction },
      dispatch
    ),
    initApp: bindActionCreators(initApp, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewMenu)
