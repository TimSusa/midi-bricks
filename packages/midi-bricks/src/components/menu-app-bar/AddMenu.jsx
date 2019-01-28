import React, { useState } from 'react'
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

const AddMenu = props => {
  const [ancEl, setAncEl] = useState(null)
  const open = Boolean(ancEl)
  const { sliderList, actions } = props
  return (
    <React.Fragment>
      <IconButton
        aria-owns={open ? 'menu-appbar-add' : null}
        aria-haspopup="true"
        onClick={handleMenu.bind(this, setAncEl)}
        color="inherit"
      >
        <Tooltip title="Add Element">
          <AddIcon />
        </Tooltip>
      </IconButton>
      <Menu
        id="menu-appbar-add"
        ancEl={ancEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose.bind(this, setAncEl)}
      >
        <MenuItem
          onClick={handleAddPage.bind(this, props, setAncEl, sliderList)}
        >
          Add Page
        </MenuItem>

        <MenuItem
          onClick={handleAddSlider.bind(this, setAncEl, actions.addSlider)}
        >
          Add Vertical Slider
        </MenuItem>
        <MenuItem
          onClick={handleAddSliderHorz.bind(
            this,
            setAncEl,
            actions.addSliderHorz
          )}
        >
          Add Horizontal Slider
        </MenuItem>
        <MenuItem
          onClick={handleAddButton.bind(
            this,
            setAncEl,
            actions.addButton,
            STRIP_TYPE.BUTTON
          )}
        >
          Add Button
        </MenuItem>
        <MenuItem
          onClick={handleAddButton.bind(
            this,
            setAncEl,
            actions.addButton,
            STRIP_TYPE.BUTTON_CC
          )}
        >
          Add Button CC
        </MenuItem>
        <MenuItem
          onClick={handleAddButton.bind(
            this,
            setAncEl,
            actions.addButton,
            STRIP_TYPE.BUTTON_PROGRAM_CHANGE
          )}
        >
          Add Button Program Change
        </MenuItem>
        <MenuItem
          onClick={handleAddLabel.bind(this, setAncEl, actions.addLabel)}
        >
          Add Label
        </MenuItem>
        <MenuItem
          onClick={handleAddXyPad.bind(this, setAncEl, actions.addXypad)}
        >
          Add X/Y Pad
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}

const handleMenu = (setAncEl, event) => {
  setAncEl(event.currentTarget)
}

const handleClose = setAncEl => {
  setAncEl(null)
}

const handleAddButton = (setAncEl, addButton, type) => {
  addButton({ type })
  handleClose(setAncEl)
}

const handleAddSlider = (setAncEl, addSlider) => {
  addSlider()
  handleClose(setAncEl)
}
const handleAddSliderHorz = (setAncEl, addSliderHorz) => {
  addSliderHorz()
  handleClose(setAncEl)
}

const handleAddLabel = (setAncEl, addLabel) => {
  addLabel()
  handleClose(setAncEl)
}

const handleAddXyPad = (setAncEl, addXypad) => {
  addXypad()
  handleClose(setAncEl)
}

const handleAddPage = (props, setAncEl, sliderList) => {
  const { actions, viewSettings } = props
  actions.addPage()
  setAncEl(null)
  window.requestAnimationFrame(() =>
    actions.updateViewSettings({
      sliderList,
      viewSettings,
    })
  )
}

AddMenu.propTypes = {
  actions: PropTypes.object.isRequired,
}

function mapStateToProps({ sliders: { sliderList } }) {
  return {
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
