import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'
import { useSelector, useDispatch } from 'react-redux'
import { Actions as MidiSliderActions } from '../global-state/actions/slider-list.js'
import { Actions as ViewActions } from '../global-state/actions/view-settings.js'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Tooltip from '@material-ui/core/Tooltip'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DeleteIcon from '@material-ui/icons/Delete'

const { delete: deleteSmth, deletePageFromFooter, setLastFocusedIndex } = {
  ...MidiSliderActions,
  ...ViewActions
}

export default DeleteModalComponent

DeleteModalComponent.propTypes = {
  asButton: PropTypes.bool,
  isOpen: PropTypes.bool,
  lastFocusedPage: PropTypes.string,
  onAction: PropTypes.func,
  onClose: PropTypes.func,
  pageTargets: PropTypes.array,
  sliderEntry: PropTypes.object
}

export function DeleteModalComponent(props) {
  const dispatch = useDispatch()
  const { pageTargets, lastFocusedPage } = useSelector(
    (state) => state.viewSettings
  )
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()
  const {
    sliderEntry = {},
    asButton = false,
    isOpen = false,
    onAction = () => {},
    onClose = () => {}
  } = props
  const [open, setOpen] = useState(false)
  return (
    <React.Fragment>
      {asButton && (
        <Tooltip title='Remove'>
          <Button
            className={classes.button}
            variant='contained'
            onClick={handleClickOpen.bind(this, setOpen)}
          >
            <DeleteIcon className={classes.iconColor} />
          </Button>
        </Tooltip>
      )}

      <Dialog
        open={open || isOpen}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          <DialogContentText color='secondary' id='alert-dialog-description'>
            Do you really want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancel} color='secondary'>
            No
          </Button>
          <Button onClick={handleClose} color='secondary' autoFocus>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
  function handleClose() {
    const { i, id } = sliderEntry || pageTargets[lastFocusedPage]
    onAction && onAction()
    if ((i || id) !== 'me') {
      dispatch(deleteSmth({ lastFocusedPage, i: i || id }))
    }
    if ((i || id).startsWith('page')) {
      dispatch(deletePageFromFooter({ i: i || id }))
      dispatch(setLastFocusedIndex())
    }
    onClose && onClose(false)
    setOpen(false)
  }
  function handleClickOpen() {
    setOpen(true)
  }

  function handleCloseCancel(e) {
    setOpen(false)
    e.preventDefault()
  }
}

function styles(theme) {
  return {
    button: {
      margin: 8,
      width: '95%',
      background: theme.palette.button.background
    },
    iconColor: {
      color: theme.palette.primary.contrastText,
      cursor: 'pointer'
    }
  }
}
