import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import MidiSettings from './midi-settings/MidiSettings'
import { Typography } from '@material-ui/core'

class MidiSettingsDialog extends React.PureComponent {
  render () {
    const { sliderEntry, idx, ...other } = this.props
    return (
      <Dialog
        onKeyDown={this.handleKeydown}
        disableBackdropClick
        aria-labelledby='confirmation-dialog-title'
        {...other}
      >
        <DialogTitle
          id='confirmation-dialog-title'
        >
          <Typography
            color='secondary'
            variant='h6'
          >
        Settings

          </Typography>
        </DialogTitle>
        <DialogContent>
          <MidiSettings
            sliderEntry={sliderEntry}
            idx={idx}
            onClose={this.handleClose}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleClose}
            color='secondary'
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

    handleClose = () => {
      this.props.onClose()
    }

    handleKeydown = (e) => {
      // Enter key will close dialog
      if (e.keyCode === 13) {
        this.props.onClose()
        e.preventDefault()
      }
    }
}

MidiSettingsDialog.propTypes = {
  onClose: PropTypes.func,
  value: PropTypes.string
}

export default MidiSettingsDialog
