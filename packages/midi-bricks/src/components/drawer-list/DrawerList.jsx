import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core'
import LoadIcon from '@material-ui/icons/InsertDriveFile'
import SaveIcon from '@material-ui/icons/Save'
import HomeIcon from '@material-ui/icons/Home'
import GlobalIcon from '@material-ui/icons/Public'
import ViewIcon from '@material-ui/icons/ViewCarousel'
import DeleteIcon from '@material-ui/icons/Delete'
import IconDriverSettings from '@material-ui/icons/SettingsInputSvideo'
import React, { useState } from 'react'
import FileReader from './FileReader'
import DeleteModal from '../DeleteModal'
import ViewSettingsDialog from '../GlobalViewSettingsDialog'
import { PAGE_TYPES } from '../../reducers/view-settings'
import { PropTypes } from 'prop-types'
import {addIpcFileListenerOnce, openIpcFileDialog} from './../../utils/ipc-renderer'

DrawerList.propTypes = {
  classes: PropTypes.object,
  handleResetSliders: PropTypes.func,
  handleSaveFile: PropTypes.func,
  onClose: PropTypes.func,
  onFileChange: PropTypes.func,
  togglePage: PropTypes.func
}

export default DrawerList

function DrawerList(props) {
  const {
    classes,
    togglePage,
    onFileChange,
    handleSaveFile,
    handleResetSliders
  } = props
  const [open, setOpen] = useState(false)
  const [isOpenViewSettings, setIsOpenViewSettings] = useState(false)
  return (
    <React.Fragment>
      <div className={classes.drawerHeader} />
      <Divider />
      <List>
        <ListItem
          button
          onClick={() =>
            togglePage({
              pageType: PAGE_TYPES.HOME_MODE
            })
          }
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary='Main' />
        </ListItem>
        <ListItem
          button
          onClick={() =>
            togglePage({
              pageType: PAGE_TYPES.GLOBAL_MODE
            })
          }
        >
          <ListItemIcon>
            <GlobalIcon />
          </ListItemIcon>
          <ListItemText primary='Controllers' />
        </ListItem>

        <ListItem
          button
          onClick={() =>
            togglePage({
              pageType: PAGE_TYPES.MIDI_DRIVER_MODE
            })
          }
        >
          <ListItemIcon>
            <IconDriverSettings />
          </ListItemIcon>
          <ListItemText primary='Drivers' />
        </ListItem>

        <ListItem
          button
          onClick={
            !isOpenViewSettings
              ? (e) => {
                setIsOpenViewSettings(!isOpenViewSettings)
              }
              : () => {}
          }
        >
          <ListItemIcon>
            <ViewIcon />
          </ListItemIcon>
          <ListItemText primary='View Settings' />
          <ViewSettingsDialog
            isOpen={isOpenViewSettings}
            onClose={(e) => {
              setIsOpenViewSettings(!isOpenViewSettings)
              props.onClose()
            }}
          />
        </ListItem>
      </List>
      <Divider />
      <List>
        {process.env.REACT_APP_IS_WEB_MODE === 'true' ? (
          <FileReader
            as='binary'
            onChange={handleFileChangeWebMode.bind(this, onFileChange)}
          >
            <ListItem button>
              <ListItemIcon>
                <LoadIcon />
              </ListItemIcon>
              <ListItemText primary='Load Preset' />
            </ListItem>
          </FileReader>
        ) : (
          <ListItem button onClick={(e) => {
            // on Electron App we use ipc for file loading from main process
            addIpcFileListenerOnce(onFileChange)
            openIpcFileDialog()
          }}>
            <ListItemIcon>
              <LoadIcon />
            </ListItemIcon>
            <ListItemText primary='Load Preset' />
          </ListItem>
        )}
      </List>
      <List>
        <ListItem button onClick={handleSaveFile}>
          <ListItemIcon>
            <SaveIcon />
          </ListItemIcon>
          <ListItemText primary='Save Preset' />
        </ListItem>
        <ListItem button onClick={() => setOpen(!open)}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary='Delete All' />
          <DeleteModal
            isOpen={open}
            asButton={false}
            sliderEntry={{
              i: 'me'
            }}
            onAction={handleResetSliders}
            onClose={setOpen}
          />
        </ListItem>
      </List>
      <Divider />
    </React.Fragment>
  )
}

function handleFileChangeWebMode(onFileChange, _, results) {
  if (!Array.isArray(results)) {
    throw new TypeError('No file selected')
  }
  const contentRaw = results[0][0].target.result
  const content = JSON.parse(contentRaw)
  const presetName = results[0][1].name

  onFileChange({ content, presetName })
}
