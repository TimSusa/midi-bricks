import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addElement } from '../../global-state/actions/thunks/thunk-add-element.js'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import AddIcon from '@material-ui/icons/Add'
import { STRIP_TYPE } from '../../global-state/reducers/slider-list'
import { Tooltip, IconButton } from '@material-ui/core'

const {
  BUTTON,
  BUTTON_CC,
  BUTTON_PROGRAM_CHANGE,
  SLIDER,
  SLIDER_HORZ,
  ROTARY_KNOB,
  LABEL,
  PAGE
} = STRIP_TYPE

export default AddMenu

function AddMenu() {
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  return (
    <React.Fragment>
      <Tooltip title='Add Elements'>
        <IconButton
          aria-owns={anchorEl ? 'menu-appbar-add' : null}
          aria-haspopup='true'
          onClick={handleMenu}
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
        onClose={handleClose}
      >
        <MenuItem onClick={handleAddPage}>Add Page</MenuItem>
        <MenuItem onClick={handleAddSlider}>Add Vertical Slider</MenuItem>
        <MenuItem onClick={handleAddSliderHorz}>Add Horizontal Slider</MenuItem>
        <MenuItem onClick={handleAddRotaryKnob}>Add Rotary Knob</MenuItem>
        <MenuItem onClick={handleAddButton.bind(this, BUTTON)}>
          Add Button
        </MenuItem>
        <MenuItem onClick={handleAddButton.bind(this, BUTTON_CC)}>
          Add Button CC
        </MenuItem>
        <MenuItem onClick={handleAddButton.bind(this, BUTTON_PROGRAM_CHANGE)}>
          Add Button Program Change
        </MenuItem>
        <MenuItem onClick={handleAddLabel}>Add Label</MenuItem>
      </Menu>
    </React.Fragment>
  )
  function handleMenu(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  async function handleAddButton(type) {
    await dispatch(addElement(type))
    handleClose()
  }

  async function handleAddSlider() {
    await dispatch(addElement(SLIDER))
    handleClose()
  }
  async function handleAddSliderHorz() {
    await dispatch(addElement(SLIDER_HORZ))
    handleClose()
  }
  async function handleAddRotaryKnob() {
    await dispatch(addElement(ROTARY_KNOB))
    handleClose()
  }

  async function handleAddLabel() {
    await dispatch(addElement(LABEL))
    handleClose()
  }

  async function handleAddPage() {
    await dispatch(addElement(PAGE))
    setAnchorEl(null)
  }
}
