import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
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
import { PAGE_TYPES } from '../../reducers/view-settings'
const DrawerList = props => {
  const {
    classes,
    togglePage,
    onFileChange,
    handleSaveFile,
    handleResetSliders,
  } = props
  const [open, setOpen] = useState(false)
  return (
    <React.Fragment>
      <div className={classes.drawerHeader} />
      <Divider />
      <List>
        <ListItem
          button
          onClick={() =>
            togglePage({
              pageType: PAGE_TYPES.HOME_MODE,
            })
          }
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Main" />
        </ListItem>
        <ListItem
          button
          onClick={() =>
            togglePage({
              pageType: PAGE_TYPES.GLOBAL_MODE,
            })
          }
        >
          <ListItemIcon>
            <GlobalIcon />
          </ListItemIcon>
          <ListItemText primary="Controllers" />
        </ListItem>

        <ListItem
          button
          onClick={() =>
            togglePage({
              pageType: PAGE_TYPES.MIDI_DRIVER_MODE,
            })
          }
        >
          <ListItemIcon>
            <IconDriverSettings />
          </ListItemIcon>
          <ListItemText primary="Drivers" />
        </ListItem>

        <ListItem
          button
          onClick={() =>
            togglePage({
              pageType: PAGE_TYPES.VIEW_SETTINGS_MODE,
            })
          }
        >
          <ListItemIcon>
            <ViewIcon />
          </ListItemIcon>
          <ListItemText primary="View Settings" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <FileReader as="binary" onChange={onFileChange}>
          <ListItem button>
            <ListItemIcon>
              <LoadIcon />
            </ListItemIcon>
            <ListItemText primary="Load Preset" />
          </ListItem>
        </FileReader>
      </List>
      <List>
        <ListItem button onClick={handleSaveFile}>
          <ListItemIcon>
            <SaveIcon />
          </ListItemIcon>
          <ListItemText primary="Save Preset" />
        </ListItem>
        <ListItem
          button
          onClick={() =>
            setOpen(!open)
          }
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Delete All" />
          <DeleteModal
            isOpen={open}
            asButton={false}
            sliderEntry={{
              i: 'me',
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
export default DrawerList
