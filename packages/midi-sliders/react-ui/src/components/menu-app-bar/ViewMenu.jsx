import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSlidersAction from '../../actions/midi-sliders.js'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

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
        <IconButton
          aria-owns={open ? 'menu-appbar' : null}
          aria-haspopup='true'
          onClick={this.handleMenu}
          color='inherit'
        >
          <AccountCircle />
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
          open={open}
          onClose={this.handleClose}
        >
          <MenuItem
            onClick={this.handleCollapse}>
              Hide
          </MenuItem>
          <MenuItem
            onClick={this.handleExpand}>
              Show
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

  handleExpand = () => {
    this.props.actions.expandSliders()
    this.handleClose()
  }

  handleCollapse = () => {
    this.props.actions.collapseSliders()
    this.handleClose()
  }
}

ViewMenu.propTypes = {
  actions: PropTypes.object.isRequired
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSlidersAction, dispatch)
  }
}

export default (connect(null, mapDispatchToProps)(ViewMenu))
