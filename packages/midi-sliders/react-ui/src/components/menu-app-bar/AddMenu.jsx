import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSlidersAction from '../../actions/slider-list.js'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import AddIcon from '@material-ui/icons/Add'
import Tooltip from '@material-ui/core/Tooltip'

class AddMenu extends React.Component {
  state = {
    auth: true,
    anchorEl: null
  }

  render () {
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)
    const {sliderListLength} = this.props
    if (sliderListLength < 80) {
      return (
        <div>
          <Tooltip
            placement='left'
            title='Add Slider or Button'
          >
            <IconButton
              aria-owns={open ? 'menu-appbar-add' : null}
              aria-haspopup='true'
              onClick={this.handleMenu}
              color='inherit'
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id='menu-appbar-add'
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
              onClick={this.handleAddSlider}
            >
              Add Slider
            </MenuItem>
            <MenuItem
              onClick={this.handleAddButton}
            >
              Add Button
            </MenuItem>
            <MenuItem
              onClick={this.handleAddLabel}
            >
              Add Label
            </MenuItem>
          </Menu>
        </div>
      )
    } else {
      return (<div />)
    }
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

  handleAddButton = () => {
    this.props.actions.addButton(this.props.sliderListLength)
    this.handleClose()
  }

  handleAddSlider = () => {
    this.props.actions.addSlider()
    this.handleClose()
  }

  handleAddLabel = () => {
    this.props.actions.addLabel()
    this.handleClose()
  }
}

AddMenu.propTypes = {
  actions: PropTypes.object.isRequired,
  sliderListLength: PropTypes.number
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSlidersAction, dispatch)
  }
}

export default (connect(null, mapDispatchToProps)(AddMenu))
