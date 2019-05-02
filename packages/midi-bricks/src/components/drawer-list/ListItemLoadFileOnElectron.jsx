import React from 'react'
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core'
import LoadIcon from '@material-ui/icons/InsertDriveFile'
import {
  addIpcFileListenerOnce,
  openIpcFileDialog
} from './../../utils/ipc-renderer'
import { PropTypes } from 'prop-types'

ListItemLoadFileOnElectron.propTypes = {
  onFileChange: PropTypes.func
}

// At Electron App we use ipc for file loading from main process
// This is the last working version
export function ListItemLoadFileOnElectron({ onFileChange }) {
  return (
    <ListItem
      button
      onClick={(e) => {
        addIpcFileListenerOnce(onFileChange)
        openIpcFileDialog()
      }}
    >
      <ListItemIcon>
        <LoadIcon />
      </ListItemIcon>
      <ListItemText primary='Load Preset' />
    </ListItem>
  )
}


