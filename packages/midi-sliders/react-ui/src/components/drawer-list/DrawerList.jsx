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
import FileReader from './FileReader'
import DeleteModal from '../DeleteModal'

class DrawerList extends React.PureComponent {
  state = {
    isDeleteModalOpen: false
  }
  render () {
    return (
      <div>
        <div className={this.props.classes.drawerHeader} />
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
        <Divider />
        <List>
          <ListItem button onClick={this.props.handleSaveFile}>
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            <ListItemText primary='Save Preset' />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={() => this.setState({ isDeleteModalOpen: !this.state.isDeleteModalOpen })}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary='Delete Sliders' />
            <DeleteModal
              isOpen={this.state.isDeleteModalOpen}
              asButton={false}
              sliderEntry={{ i: 'me' }}
              onAction={this.props.handleResetSliders}
              onClose={() => ({})}
            />
          </ListItem>
        </List>

        <List>
          <ListItem button onClick={() => this.props.history.push('/test-page')}>
            <ListItemText primary='Test Page' />
          </ListItem>
        </List>

        {/* <div style={{ height: 10000 }} /> */}
      </div>
    )
  }
}

export default DrawerList
