import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSlidersAction from '../../actions/slider-list.js'
import * as ViewSettingsAction from '../../actions/view-settings'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import OnIcon from '@material-ui/icons/Done'
import OffIcon from '@material-ui/icons/Close'
import ViewSettingsIcon from '@material-ui/icons/Settings'
import { Typography } from '@material-ui/core'

class ViewMenu extends React.PureComponent {
  state = {
    auth: true,
    anchorEl: null
  }

  render () {
    const { anchorEl } = this.state
    const {
      viewSettings: {
        isLayoutMode = true,
        isAutoArrangeMode = true,
        isChangedTheme = false,
        isSettingsMode = false,
        isCompactHorz = true,
        isLiveMode = false
      }
    } = this.props
    const isOpen = Boolean(anchorEl)
    return (
      <div>
        <IconButton
          aria-owns={isOpen ? 'menu-appbar' : null}
          aria-haspopup='true'
          onClick={this.handleMenu}
          color='inherit'
        >
          <ViewSettingsIcon />
        </IconButton>
        <Menu
          id='menu-appbar'
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={isOpen}
          onClose={this.handleClose}
        >

          <MenuItem
            onClick={this.toggleLayoutMode}>
            <ListItemIcon>
              {isLayoutMode ? (
                <OnIcon />
              ) : (
                <OffIcon />
              )}
            </ListItemIcon>

            <Typography variant='subtitle1'>
              Layout Mode - shift + l
            </Typography>
          </MenuItem>
          {
            !isLayoutMode &&
            <MenuItem
              onClick={this.toggleSettingsMode}
            >
              <ListItemIcon>
                {isSettingsMode ? (
                  <OnIcon />
                ) : (
                  <OffIcon />
                )}
              </ListItemIcon>
              <Typography variant='subtitle1'>
                Settings Mode - shift + s
              </Typography>
            </MenuItem>
          }

          <MenuItem
            onClick={this.toggleCompactMode}
          >
            <ListItemIcon>
              {!isCompactHorz ? (
                <OnIcon />
              ) : (
                <OffIcon />
              )}
            </ListItemIcon>
            <Typography variant='subtitle1'>
              Compact Vertically - shift + v
            </Typography>
          </MenuItem>

          {
            isLayoutMode &&
            <MenuItem
              onClick={this.handleChangeAutoArrangeMode}
            >
              <ListItemIcon>
                {isAutoArrangeMode ? (
                  <OnIcon />
                ) : (
                  <OffIcon />
                )}
              </ListItemIcon>
              <Typography variant='subtitle1'>
                Auto Arrange Mode - shift + a
              </Typography>
            </MenuItem>
          }
          <MenuItem
            onClick={this.handleChangeTheme}>
            <ListItemIcon>
              {isChangedTheme ? (
                <OnIcon />
              ) : (
                <OffIcon />
              )}
            </ListItemIcon>
            <Typography variant='subtitle1'>
              Switch Theme - shift + t
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={this.toggleLiveMode}>
            <ListItemIcon>
              {isLiveMode ? (
                <OnIcon />
              ) : (
                <OffIcon />
              )}
            </ListItemIcon>

            <Typography variant='subtitle1'>
              Live Mode - shift + p
            </Typography>
          </MenuItem>
        </Menu>
      </div>
    )
  }

  handleChange = (event, checked) => {
    this.setState({ auth: checked })
  }

  handleChangeTheme = () => {
    this.props.actions.changeTheme()
    this.handleClose()
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  toggleLiveMode = () => {
    this.props.actions.toggleLiveMode()
    this.handleClose()
  }

  toggleLayoutMode = () => {
    this.props.actions.toggleLayoutMode()
    this.handleClose()
  }

  handleChangeAutoArrangeMode = () => {
    this.props.actions.toggleAutoArrangeMode()
    this.handleClose()
  }

  toggleCompactMode = () => {
    this.props.actions.toggleCompactMode()
    this.handleClose()
  }

  toggleSettingsMode = () => {
    this.props.actions.toggleSettingsMode()
    this.handleClose()
  }
}

ViewMenu.propTypes = {
  actions: PropTypes.object.isRequired
}

function mapStateToProps ({ viewSettings }) {
  return {
    viewSettings
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ ...MidiSlidersAction, ...ViewSettingsAction }, dispatch)
  }
}

export default (connect(mapStateToProps, mapDispatchToProps)(ViewMenu))
