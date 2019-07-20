import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import ApplicationSettings from './ApplicationSettings'
import { Typography } from '@material-ui/core'

export default ApplicationSettingsDialog

ApplicationSettingsDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  sliderEntry: PropTypes.object,
  value: PropTypes.string
}

function ApplicationSettingsDialog(props) {
  const { isOpen = true, sliderEntry, onClose, ...other } = props
  return (
    <Dialog
      open={isOpen}
      onKeyDown={handleKeydown.bind(this, onClose)}
      disableBackdropClick
      aria-labelledby='confirmation-dialog-title'
      {...other}
    >
      <DialogTitle id='confirmation-dialog-title'>
        <Typography color='secondary' variant='body1'>
        Preferences
        </Typography>
      </DialogTitle>
      <DialogContent>
        <ApplicationSettings />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => {
            props.onClose()
          }}
          color='secondary'
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function handleKeydown(onClose, e) {
  // Enter key will close dialog
  if (e.keyCode === 13) {
    onClose()
    e.preventDefault()
  }
}
