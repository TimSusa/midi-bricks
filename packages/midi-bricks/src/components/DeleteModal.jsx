import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../actions/slider-list.js'
import { Actions as ViewActions } from '../actions/view-settings.js'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Tooltip from '@material-ui/core/Tooltip'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DeleteIcon from '@material-ui/icons/Delete'

export const DeleteModalComponent = props => {
  const {
    classes,
    sliderEntry,
    asButton,
    isOpen,
    onAction,
    actions,
    onClose,
  } = props
  const [open, setOpen] = useState(false)
  return (
    <React.Fragment>
      {asButton && (
        <Tooltip title="Remove">
          <Button
            className={classes.button}
            variant="contained"
            onClick={handleClickOpen.bind(this, setOpen)}
          >
            <DeleteIcon className={classes.iconColor} />
          </Button>
        </Tooltip>
      )}

      <Dialog
        open={open || isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText color="secondary" id="alert-dialog-description">
            Do you really want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseCancel.bind(this, setOpen)}
            color="secondary"
          >
            No
          </Button>
          <Button
            onClick={handleClose.bind(
              this,
              sliderEntry,
              onAction,
              actions,
              onClose,
              setOpen
            )}
            color="secondary"
            autoFocus
          >
            Yes, Delete!
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

const handleClickOpen = setOpen => {
  setOpen(true)
}

const handleCloseCancel = (setOpen, e) => {
  setOpen(false)
  e.preventDefault()
}

const handleClose = ({ i }, onAction, actions, onClose, setOpen) => {
  setOpen(false)
  onAction && onAction()
  actions.delete({ i })
  actions.deletePageFromFooter({ i })
  onClose && onClose(false)
}

const styles = theme => ({
  button: {
    margin: 8,
    width: '95%',
    background: theme.palette.button.background,
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer',
  },
})

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...MidiSliderActions, ...ViewActions },
      dispatch
    ),
  }
}

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(DeleteModalComponent)
)
