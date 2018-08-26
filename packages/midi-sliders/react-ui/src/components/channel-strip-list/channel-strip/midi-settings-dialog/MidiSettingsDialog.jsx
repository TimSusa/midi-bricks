import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import MidiSettings from './MidiSettings'

class MidiSettingsDialog extends React.Component {
  render () {
    const { sliderEntry, idx, ...other } = this.props
    return (
      <Dialog
        onKeyDown={this.handleKeydown}
        disableBackdropClick
        aria-labelledby='confirmation-dialog-title'
        {...other}
      >
        <DialogTitle id='confirmation-dialog-title'>Settings</DialogTitle>
        <DialogContent>
          <MidiSettings sliderEntry={sliderEntry} idx={idx} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color='primary'>
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
