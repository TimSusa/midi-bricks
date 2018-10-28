import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSlidersAction from '../../actions/slider-list.js'
import * as ViewSettinsgsAction from '../../actions/view-settings'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import AddIcon from '@material-ui/icons/Add'
import { STRIP_TYPE } from '../../reducers/slider-list'

class AddMenu extends React.PureComponent {
  state = {
    auth: true,
    anchorEl: null
  }

  render () {
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)
    const { viewSettings: { isLayoutMode }, sliderList } = this.props
    if (isLayoutMode) {
      return (
        <div>

          <IconButton
            aria-owns={open ? 'menu-appbar-add' : null}
            aria-haspopup='true'
            onClick={this.handleMenu}
            color='inherit'
          >
            <AddIcon />
          </IconButton>
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
              Add Vertical Slider
            </MenuItem>
            <MenuItem
              onClick={this.handleAddSliderHorz}
            >
              Add Horizontal Slider
            </MenuItem>
            <MenuItem
              onClick={this.handleAddButton.bind(this, STRIP_TYPE.BUTTON)}
            >
              Add Button
            </MenuItem>
            <MenuItem
              onClick={this.handleAddButton.bind(this, STRIP_TYPE.BUTTON_CC)}
            >
              Add Button CC
            </MenuItem>
            <MenuItem
              onClick={this.handleAddLabel}
            >
              Add Label
            </MenuItem>
            <MenuItem
              onClick={this.handleAddPage}
            >
              Add Page
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

  handleAddButton = (type) => {
    this.props.actions.addButton({type})
    this.handleClose()
  }

  handleAddSlider = () => {
    this.props.actions.addSlider()
    this.handleClose()
  }
  handleAddSliderHorz = () => {
    this.props.actions.addSliderHorz()
    this.handleClose()
  }

  handleAddLabel = () => {
    this.props.actions.addLabel()
    this.handleClose()
  }
  handleAddPage = () => {
    this.props.actions.addPage()

    window.requestAnimationFrame(() => {
      this.props.actions.addPageToFooter({sliderList: this.props.sliderList})
    })

    this.handleClose()
  }
}

AddMenu.propTypes = {
  actions: PropTypes.object.isRequired
}
function mapStateToProps ({ viewSettings, sliderList }) {
  return {
    viewSettings,
    sliderList
  }
}
function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({...MidiSlidersAction, ...ViewSettinsgsAction}, dispatch)
  }
}

export default (connect(mapStateToProps, mapDispatchToProps)(AddMenu))
