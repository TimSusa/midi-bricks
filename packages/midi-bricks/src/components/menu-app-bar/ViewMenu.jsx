import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSlidersAction } from '../../actions/slider-list.js'
import { Actions as ViewSettingsAction } from '../../actions/view-settings'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import OnIcon from '@material-ui/icons/Done'
import OffIcon from '@material-ui/icons/Close'
import ViewSettingsIcon from '@material-ui/icons/Settings'
import {
  Typography,
  Tooltip,
  FormControlLabel,
  Switch,
} from '@material-ui/core'

class ViewMenu extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      auth: true,
      anchorEl: null,
    }
  }

  render() {
    const { anchorEl } = this.state
    const {
      viewSettings: {
        isLayoutMode = true,
        isAutoArrangeMode = true,
        isChangedTheme = false,
        isSettingsMode = false,
        isCompactHorz = true,
        isLiveMode = false,
      },
    } = this.props
    const isOpen = Boolean(anchorEl)
    return (
      <div>
        <IconButton
          aria-owns={isOpen ? 'menu-appbar' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
        >
          <Tooltip title="View Settings">
            <ViewSettingsIcon />
          </Tooltip>
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isOpen}
          onClose={this.handleClose}
        >
          <MenuItem>
            <FormControlLabel
              control={
                <Switch
                  checked={isLayoutMode}
                  onChange={this.toggleLayoutMode}
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
                    onChange={this.toggleSettingsMode}
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
                  onChange={this.toggleCompactMode}
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
                    onChange={this.handleChangeAutoArrangeMode}
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
                  onChange={this.handleChangeTheme}
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
                  onChange={this.toggleLiveMode}
                  value={isLiveMode}
                  color="secondary"
                />
              }
              label="Live  - p"
            />
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
    //this.handleClose()
  }

  handleChangeAutoArrangeMode = () => {
    this.props.actions.toggleAutoArrangeMode()
    //this.handleClose()
  }

  toggleCompactMode = () => {
    this.props.actions.toggleCompactMode()
    //this.handleClose()
  }

  toggleSettingsMode = () => {
    this.props.actions.toggleSettingsMode()
    //this.handleClose()
  }
}

ViewMenu.propTypes = {
  actions: PropTypes.object.isRequired,
}

function mapStateToProps({ viewSettings }) {
  return {
    viewSettings,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSlidersAction, ...ViewSettingsAction },
      dispatch
    ),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewMenu)
