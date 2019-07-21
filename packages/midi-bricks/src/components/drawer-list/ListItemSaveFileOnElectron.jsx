import React from 'react'
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import {
  addIpcSaveFileListenerOnce,
  saveIpcFileDialog
} from './../../utils/ipc-renderer'
import { PropTypes } from 'prop-types'

import { connect } from 'react-redux'

export const ListItemSaveFileOnElectron = connect(
  mapStateToProps,
  null
)(ListItemSaveFileOnElectronComp)

ListItemSaveFileOnElectronComp.propTypes = {
  onFileChange: PropTypes.func,
  viewSettings: PropTypes.object,
  sliders: PropTypes.object,
  pages: PropTypes.object
}

// At Electron App we use ipc for file loading from main process
export function ListItemSaveFileOnElectronComp({ onFileChange, viewSettings, sliders={}, pages, iconColor }) {
  return (
    <ListItem
      button
      onClick={(e) => {
        addIpcSaveFileListenerOnce(onFileChange)
        saveIpcFileDialog({viewSettings, sliders, pages})
      }}
    >
      <ListItemIcon className={iconColor}>
        <SaveIcon />
      </ListItemIcon>
      <ListItemText primary='Save Preset' />
    </ListItem>
  )
}

function mapStateToProps({ viewSettings, sliders, pages }) {
  return {
    viewSettings,
    sliders, 
    pages
  }
}

