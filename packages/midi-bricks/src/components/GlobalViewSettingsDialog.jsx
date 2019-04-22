import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import GlobalViewSettings from './GlobalViewSettings'
import { Typography } from '@material-ui/core'

export default GlobalViewSettingsDialog

GlobalViewSettingsDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  sliderEntry: PropTypes.object,
  value: PropTypes.string
}

function GlobalViewSettingsDialog(props) {
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
          Global-View-Settings
        </Typography>
      </DialogTitle>
      <DialogContent>
        <GlobalViewSettings />
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
