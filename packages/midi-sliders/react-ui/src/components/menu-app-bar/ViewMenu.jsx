import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSlidersAction from '../../actions/slider-list.js'
import * as ViewSettingsAction from '../../actions/view-settings'
import IconButton from '@material-ui/core/IconButton'
import ViewSettingsIcon from '@material-ui/icons/ViewWeek'
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
            <ViewSettingsIcon />
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
        </Menu>
      </div>
    )
  }

  handleChange = (event, checked) => {
    this.setState({ auth: checked })
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  toggleLayoutMode = () => {
    const { viewSettings: { listOrder }, actions } = this.props
    listOrder && actions.changeListOrder(listOrder)
    actions.toggleLayoutMode()
    this.handleClose()
  }
}

ViewMenu.propTypes = {
  actions: PropTypes.object.isRequired
}

function mapStateToProps ({viewSettings}) {
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
