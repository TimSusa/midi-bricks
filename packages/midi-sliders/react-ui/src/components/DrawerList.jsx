import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core'
import LoadIcon from '@material-ui/icons/InsertDriveFile'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
import * as React from 'react'
import FileReaderInput from './FileReader'

const DrawerList = props => (
  <div>
    <div className={props.classes.drawerHeader} />
    <Divider />
    <List>
      <FileReaderInput
        as='binary'
        onChange={props.onFileChange}>
        <ListItem button>
          <ListItemIcon >
            <LoadIcon />
          </ListItemIcon>
          <ListItemText primary='Load Preset' />
        </ListItem>
      </FileReaderInput>
    </List>
    <Divider />
    <List>
      <ListItem button onClick={props.handleSaveFile}>
        <ListItemIcon>
          <SaveIcon />
        </ListItemIcon>
        <ListItemText primary='Save Preset' />
      </ListItem>
    </List>
    <Divider />
    <List>
      <ListItem button onClick={props.handleResetSliders}>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText primary='Delete Sliders' />
      </ListItem>
    </List>

    <List>
      <ListItem button onClick={() => props.history.push('/test-page')}>
        <ListItemText primary='Test Page' />
      </ListItem>
    </List>

    {/* <div style={{ height: 10000 }} /> */}
  </div>
)

export default DrawerList
