import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSlidersAction } from '../../global-state/actions/slider-list.js'
import { Actions as ViewSettinsgsAction } from '../../global-state/actions/view-settings'
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
  LABEL,
  PAGE,
  XYPAD
} = STRIP_TYPE

export default connect(null, mapDispatchToProps)(AddMenu)

AddMenu.propTypes = {
  actions: PropTypes.object.isRequired
}

function AddMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  return (
    <React.Fragment>
      <Tooltip title='Add Elements'>
        <IconButton
          aria-owns={anchorEl ? 'menu-appbar-add' : null}
          aria-haspopup='true'
          onClick={handleMenu.bind(this, setAnchorEl)}
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
        onClose={handleClose.bind(this, setAnchorEl)}
      >
        <MenuItem onClick={handleAddPage.bind(this, props, setAnchorEl)}>
          Add Page
        </MenuItem>

        <MenuItem onClick={handleAddSlider.bind(this, setAnchorEl, props)}>
          Add Vertical Slider
        </MenuItem>
        <MenuItem onClick={handleAddSliderHorz.bind(this, setAnchorEl, props)}>
          Add Horizontal Slider
        </MenuItem>
        <MenuItem
          onClick={handleAddButton.bind(this, setAnchorEl, props, BUTTON)}
        >
          Add Button
        </MenuItem>
        <MenuItem
          onClick={handleAddButton.bind(this, setAnchorEl, props, BUTTON_CC)}
        >
          Add Button CC
        </MenuItem>
        <MenuItem
          onClick={handleAddButton.bind(
            this,
            setAnchorEl,
            props,
            BUTTON_PROGRAM_CHANGE
          )}
        >
          Add Button Program Change
        </MenuItem>
        <MenuItem onClick={handleAddLabel.bind(this, setAnchorEl, props)}>
          Add Label
        </MenuItem>
        <MenuItem onClick={handleAddXyPad.bind(this, setAnchorEl, props)}>
          Add X/Y Pad
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}

function handleMenu(setAnchorEl, event) {
  setAnchorEl(event.currentTarget)
}

function handleClose(setAnchorEl, event) {
  setAnchorEl(null)
}

async function handleAddButton(setAnchorEl, { addElement }, type) {
  //addButton({ type })
  await addElement(type)
  handleClose(setAnchorEl)
}

async function handleAddSlider(setAnchorEl, { addElement }) {
  await addElement(SLIDER)
  handleClose(setAnchorEl)
}
async function handleAddSliderHorz(setAnchorEl, { addElement }) {
  await addElement(SLIDER_HORZ)
  handleClose(setAnchorEl)
}

async function handleAddLabel(setAnchorEl, { addElement }) {
  await addElement(LABEL)
  handleClose(setAnchorEl)
}

async function handleAddXyPad(setAnchorEl, { addElement }) {
  await addElement(XYPAD)
  handleClose(setAnchorEl)
}

async function handleAddPage({ addElement }, setAnchorEl) {
  await addElement(PAGE)
  setAnchorEl(null)
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSlidersAction, ...ViewSettinsgsAction },
      dispatch
    ),
    addElement: bindActionCreators(addElement, dispatch)
  }
}
