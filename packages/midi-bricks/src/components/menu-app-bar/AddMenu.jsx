import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSlidersAction } from '../../actions/slider-list.js'
import { Actions as ViewSettinsgsAction } from '../../actions/view-settings'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import AddIcon from '@material-ui/icons/Add'
import { STRIP_TYPE } from '../../reducers/slider-list'
import { Tooltip } from '@material-ui/core'

class AddMenu extends React.PureComponent {
  state = {
    auth: true,
    anchorEl: null,
  }

  render() {
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)
    const {
      viewSettings: { isLayoutMode },
    } = this.props
    if (isLayoutMode) {
      return (
        <div>
          <IconButton
            aria-owns={open ? 'menu-appbar-add' : null}
            aria-haspopup="true"
            onClick={this.handleMenu}
            color="inherit"
          >
            <Tooltip title="Add Element">
              <AddIcon />
            </Tooltip>
          </IconButton>
          <Menu
            id="menu-appbar-add"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.handleAddPage}>Add Page</MenuItem>

            <MenuItem onClick={this.handleAddSlider}>
              Add Vertical Slider
            </MenuItem>
            <MenuItem onClick={this.handleAddSliderHorz}>
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
              onClick={this.handleAddButton.bind(
                this,
                STRIP_TYPE.BUTTON_PROGRAM_CHANGE
              )}
            >
              Add Button Program Change
            </MenuItem>
            <MenuItem onClick={this.handleAddLabel}>Add Label</MenuItem>
            <MenuItem onClick={this.handleAddXyPad}>Add X/Y Pad</MenuItem>
          </Menu>
        </div>
      )
    } else {
      return <div />
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

  handleAddButton = type => {
    this.props.actions.addButton({ type })
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

  handleAddXyPad = () => {
    this.props.actions.addXypad()
    this.handleClose()
  }

  handleAddPage = () => {
    const { actions, viewSettings } = this.props
    actions.addPage()
    this.setState({ anchorEl: null })
    window.requestAnimationFrame(() =>
      actions.updateViewSettings({
        sliderList: this.props.sliderList,
        viewSettings,
      })
    )
  }
}

AddMenu.propTypes = {
  actions: PropTypes.object.isRequired,
}

function mapStateToProps({ viewSettings, sliders: { sliderList } }) {
  return {
    viewSettings,
    sliderList,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSlidersAction, ...ViewSettinsgsAction },
      dispatch
    ),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMenu)
