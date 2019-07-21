import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import MidiSettings from '../midi-settings/MidiSettings'
import { Typography } from '@material-ui/core'

function MidiSettingsDialog(props) {
  const { sliderEntry, onClose, iconColor, ...other } = props
  return (
    <Dialog
      onKeyDown={handleKeydown.bind(this, onClose)}
      disableBackdropClick
      aria-labelledby='confirmation-dialog-title'
      {...other}
    >
      <DialogTitle id='confirmation-dialog-title'>
        <Typography className={iconColor} variant='body1'>
          Settings
        </Typography>
      </DialogTitle>
      <DialogContent>
        <MidiSettings sliderEntry={sliderEntry} onClose={onClose} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className={iconColor}>
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

MidiSettingsDialog.propTypes = {
  iconColor: PropTypes.any,
  onClose: PropTypes.func,
  sliderEntry: PropTypes.any,
  value: PropTypes.string
}

export default MidiSettingsDialog
