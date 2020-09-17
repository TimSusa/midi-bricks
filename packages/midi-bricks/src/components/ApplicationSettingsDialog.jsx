import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import { Typography } from '@material-ui/core'

export default ApplicationSettingsDialog

ApplicationSettingsDialog.propTypes = {
  iconColor: PropTypes.any,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  sliderEntry: PropTypes.object,
  value: PropTypes.string
}

function ApplicationSettingsDialog(props) {
  const { isOpen = true, onClose, iconColor, ...other } = props

  if (isOpen) {
    var ApplicationSettings = React.lazy(() =>
      import('../pages/ApplicationSettings')
    )
  }

  return (
    <Dialog
      open={isOpen}
      onKeyDown={handleKeydown.bind(this, onClose)}
      disableBackdropClick
      aria-labelledby='confirmation-dialog-title'
      {...other}
    >
      <DialogTitle id='confirmation-dialog-title'>
        <Typography className={iconColor} variant='body1'>
          Preferences
        </Typography>
      </DialogTitle>
      <DialogContent>
        {isOpen && (
          <Suspense fallback={<div>Loading...</div>}>
            <ApplicationSettings />
          </Suspense>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} className={iconColor}>
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
