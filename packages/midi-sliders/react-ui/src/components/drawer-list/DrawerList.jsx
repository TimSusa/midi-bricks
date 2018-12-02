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
import DeleteIcon from '@material-ui/icons/Delete'
import * as React from 'react'
import FileReader from './FileReader'
import DeleteModal from '../DeleteModal'
import { PAGE_TYPES } from '../../reducers/view-settings'

class DrawerList extends React.PureComponent {
  state = {
    isDeleteModalOpen: false
  }
  render () {
    return (
      <React.Fragment>
        <div className={this.props.classes.drawerHeader} />
        <Divider />
        <List>
          <ListItem button onClick={() => this.props.togglePage({ pageType: PAGE_TYPES.HOME_MODE })}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary='Main View' />
          </ListItem>
          <ListItem button onClick={() => this.props.togglePage({ pageType: PAGE_TYPES.GLOBAL_MODE })}>
            <ListItemIcon>
              <GlobalIcon />
            </ListItemIcon>
            <ListItemText primary='Global Settings' />
          </ListItem>

          <ListItem
            button
            onClick={() => this.props.togglePage({ pageType: PAGE_TYPES.MIDI_DRIVER_MODE })}
          >
            <ListItemIcon>
              <GlobalIcon />
            </ListItemIcon>
            <ListItemText primary='MIDI Driver Settings' />
          </ListItem>

        </List>
        <Divider />
        <List>
          <FileReader
            as='binary'
            onChange={this.props.onFileChange}>
            <ListItem button>
              <ListItemIcon >
                <LoadIcon />
              </ListItemIcon>
              <ListItemText primary='Load Preset' />
            </ListItem>
          </FileReader>
        </List>
        <List>
          <ListItem button onClick={this.props.handleSaveFile}>
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            <ListItemText primary='Save Preset' />
          </ListItem>
        </List>
        <List>
          <ListItem button onClick={() => this.setState({ isDeleteModalOpen: !this.state.isDeleteModalOpen })}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary='Delete Elements' />
            <DeleteModal
              isOpen={this.state.isDeleteModalOpen}
              asButton={false}
              sliderEntry={{ i: 'me' }}
              onAction={this.props.handleResetSliders}
              onClose={() => ({})}
            />
          </ListItem>
        </List>
        <Divider />
      </React.Fragment>
    )
  }
}

export default DrawerList
