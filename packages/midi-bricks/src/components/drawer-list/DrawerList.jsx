import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import HomeIcon from '@material-ui/icons/Home'
import GlobalIcon from '@material-ui/icons/Public'
import ViewIcon from '@material-ui/icons/ViewCarousel'
import DeleteIcon from '@material-ui/icons/Delete'
import VersionIcon from '@material-ui/icons/FormatListNumberedRtl'
import IconDriverSettings from '@material-ui/icons/SettingsInputSvideo'
import React, { useState } from 'react'
import DeleteModal from '../DeleteModal'
import ViewSettingsDialog from '../ApplicationSettingsDialog'
import { ListItemLoadFileOnElectron } from './ListItemLoadFileOnElectron'
import { ListItemSaveFileOnElectron } from './ListItemSaveFileOnElectron'
import { ListItemLoadFileOnWeb } from './ListItemLoadFileOnWeb'
import { PAGE_TYPES } from '../../reducers/view-settings'
import { PropTypes } from 'prop-types'

DrawerList.propTypes = {
  classes: PropTypes.object,
  handleResetSliders: PropTypes.func,
  handleSaveFile: PropTypes.func,
  onClose: PropTypes.func,
  onFileChange: PropTypes.func,
  togglePage: PropTypes.func,
  version: PropTypes.string
}

export default DrawerList

function DrawerList(props) {
  const {
    classes,
    togglePage,
    onFileChange,
    handleSaveFile,
    handleResetSliders,
    version
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
          <ListItemText primary='Views Settings' />
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
          <ListItemLoadFileOnWeb onFileChange={onFileChange} />
        ) : (
          <ListItemLoadFileOnElectron onFileChange={onFileChange} />
        )}
      </List>
      <List>
        {process.env.REACT_APP_IS_WEB_MODE === 'true' ? (
          <ListItem button onClick={handleSaveFile}>
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            <ListItemText primary='Save Preset' />
          </ListItem>
        ) : (
          <ListItemSaveFileOnElectron onFileChange={onFileChange} />
        )}
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
        <ListItem>
          <ListItemIcon>
            <VersionIcon />
          </ListItemIcon>
          <ListItemText primary={`${version}`} />
        </ListItem>
      </List>
      <Divider />
    </React.Fragment>
  )
}
