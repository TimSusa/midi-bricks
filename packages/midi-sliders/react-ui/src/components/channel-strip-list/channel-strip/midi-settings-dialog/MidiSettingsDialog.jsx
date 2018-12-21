import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import MidiSettings from './midi-settings/MidiSettings'
import { Typography } from '@material-ui/core'

const MidiSettingsDialog = props => {
  const { sliderEntry, idx, ...other } = props
  return (
    <Dialog
      onKeyDown={handleKeydown.bind(this, props)}
      disableBackdropClick
      aria-labelledby="confirmation-dialog-title"
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">
        <Typography color="secondary" variant="body1">
          Settings
        </Typography>
      </DialogTitle>
      <DialogContent>
        <MidiSettings
          sliderEntry={sliderEntry}
          idx={idx}
          onClose={handleClose.bind(this, props)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose.bind(this, props)} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
const handleClose = (props) => {
  props.onClose()
}

const handleKeydown = (props, e) => {
  // Enter key will close dialog
  if (e.keyCode === 13) {
    props.onClose()
    e.preventDefault()
  }
}
MidiSettingsDialog.propTypes = {
  onClose: PropTypes.func,
  value: PropTypes.string,
}

export default MidiSettingsDialog
