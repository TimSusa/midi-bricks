import React from 'react'
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import {
  addIpcSaveFileListenerOnce,
  saveIpcFileDialog
} from './../../utils/ipc-renderer'
import { PropTypes } from 'prop-types'

import { connect, useSelector } from 'react-redux'

export const ListItemSaveFileOnElectron = connect(
  null,
  null
)(ListItemSaveFileOnElectronComp)

ListItemSaveFileOnElectronComp.propTypes = {
  onFileChange: PropTypes.func,
  viewSettings: PropTypes.object,
  sliders: PropTypes.object,
  pages: PropTypes.object,
  iconColor: PropTypes.string
}

// At Electron App we use ipc for file loading from main process
export function ListItemSaveFileOnElectronComp({ onFileChange, iconColor }) {
  const pages = useSelector((state) => state.pages)
  const viewSettings = useSelector((state) => state.viewSettings)
  const sliders = useSelector((state) => state.sliders)
  return (
    <ListItem
      button
      onClick={() => {
        addIpcSaveFileListenerOnce(onFileChange)
        saveIpcFileDialog({ viewSettings, sliders, pages })
      }}
    >
      <ListItemIcon className={iconColor}>
        <SaveIcon />
      </ListItemIcon>
      <ListItemText primary='Save Preset' />
    </ListItem>
  )
}
