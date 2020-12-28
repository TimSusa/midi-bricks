import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Autocomplete from '@material-ui/lab/Autocomplete'

export function CopyToPageDialog({ isOpen: open, onClose, onOk }) {
  const pages = useSelector((state) => state.viewSettings.pageTargets || [{}])
  const lastFocusedPage = useSelector(
    (state) => state.viewSettings.lastFocusedPage
  )
  const [chosenPage, setChosenPage] = useState(
    pages.find((item) => item.id === lastFocusedPage)
  )
  return (
    <div>
      <Dialog
        open={open || false}
        onClose={onClose}
        aria-labelledby='copy-to-dialog'
      >
        <DialogTitle id='copy-to-dialog'>Copy Elements to Page:</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please, chose the page, where you want to copy the elements.
          </DialogContentText>
          <Autocomplete
            onChange={(e, newVal) => setChosenPage(newVal)}
            id='combo-box'
            options={pages}
            value={chosenPage || ''}
            getOptionLabel={(option) => option.label || ''}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label='Chose Page!' variant='outlined' />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={() => onClose()} color='primary'>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => onOk(chosenPage.id)}
            color='primary'
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

CopyToPageDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onOk: PropTypes.func
}
