import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSlidersAction from '../../actions/slider-list.js'
import * as ViewSettingsAction from '../../actions/view-settings'
import IconButton from '@material-ui/core/IconButton'
import ViewSettingsIcon from '@material-ui/icons/ViewColumn'
import ViewSettingsIconList from '@material-ui/icons/ViewList'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import ToolTip from '@material-ui/core/Tooltip'

class ViewMenu extends React.Component {
  state = {
    auth: true,
    anchorEl: null
  }

  render () {
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)
    return (
      <div>
        <ToolTip
          placement='left'
          title='View Settings'
        >
          <IconButton
            aria-owns={open ? 'menu-appbar' : null}
            aria-haspopup='true'
            onClick={this.handleMenu}
            color='inherit'
          >
            {
              this.props.viewSettings.isCompactHorz ? (
                <ViewSettingsIconList />
              ) : (
                <ViewSettingsIcon />
              )
            }

          </IconButton>
        </ToolTip>
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
          open={open}
          onClose={this.handleClose}
        >
          <MenuItem
            onClick={this.toggleLayoutMode}>
            {this.props.viewSettings.isLayoutMode ? ('Layout Mode Exit') : ('Layout Mode Enter')}
          </MenuItem>
          {
            !this.props.viewSettings.isLayoutMode && <MenuItem
              onClick={this.toggleSettingsMode}>
              {this.props.viewSettings.isSettingsMode ? ('Hide Settings') : ('Show Settings')}
            </MenuItem>
          }

          <MenuItem
            onClick={this.toggleCompactMode}>
            {!this.props.viewSettings.isCompactHorz ? ('Compact Horizontally') : ('Compact Vertically')}
          </MenuItem>

          <MenuItem
            onClick={this.handleChangeTheme}>
            {!this.props.viewSettings.isChangedTheme ? ('Dark Theme') : ('Light Theme')}
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

  toggleLayoutMode = () => {
    this.props.actions.toggleLayoutMode()
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
