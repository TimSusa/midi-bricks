import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSlidersAction } from '../../actions/slider-list.js'
import { Actions as ViewSettinsgsAction } from '../../actions/view-settings'
import { addElement } from '../../actions/add-element'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import AddIcon from '@material-ui/icons/Add'
import { STRIP_TYPE } from '../../reducers/slider-list'
import { Tooltip, IconButton } from '@material-ui/core'

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMenu)

AddMenu.propTypes = {
  actions: PropTypes.object.isRequired
}

function AddMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const { actions } = props
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

        <MenuItem
          onClick={handleAddSlider.bind(this, setAnchorEl, actions.addSlider)}
        >
          Add Vertical Slider
        </MenuItem>
        <MenuItem
          onClick={handleAddSliderHorz.bind(
            this,
            setAnchorEl,
            actions.addSliderHorz
          )}
        >
          Add Horizontal Slider
        </MenuItem>
        <MenuItem
          onClick={handleAddButton.bind(
            this,
            setAnchorEl,
            actions.addButton,
            STRIP_TYPE.BUTTON
          )}
        >
          Add Button
        </MenuItem>
        <MenuItem
          onClick={handleAddButton.bind(
            this,
            setAnchorEl,
            actions.addButton,
            STRIP_TYPE.BUTTON_CC
          )}
        >
          Add Button CC
        </MenuItem>
        <MenuItem
          onClick={handleAddButton.bind(
            this,
            setAnchorEl,
            actions.addButton,
            STRIP_TYPE.BUTTON_PROGRAM_CHANGE
          )}
        >
          Add Button Program Change
        </MenuItem>
        <MenuItem
          onClick={handleAddLabel.bind(this, setAnchorEl, actions.addLabel)}
        >
          Add Label
        </MenuItem>
        <MenuItem
          onClick={handleAddXyPad.bind(this, setAnchorEl, actions.addXypad)}
        >
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

function handleAddButton(setAnchorEl, addButton, type) {
  addButton({ type })
  handleClose(setAnchorEl)
}

function handleAddSlider(setAnchorEl, addSlider) {
  addSlider()
  handleClose(setAnchorEl)
}
function handleAddSliderHorz(setAnchorEl, addSliderHorz) {
  addSliderHorz()
  handleClose(setAnchorEl)
}

function handleAddLabel(setAnchorEl, addLabel) {
  addLabel()
  handleClose(setAnchorEl)
}

function handleAddXyPad(setAnchorEl, addXypad) {
  addXypad()
  handleClose(setAnchorEl)
}

async function handleAddPage(props, setAnchorEl) {
  const { addElement } = props
  await addElement('PAGE')
  setAnchorEl(null)
}

function mapStateToProps() {
  return {}
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
