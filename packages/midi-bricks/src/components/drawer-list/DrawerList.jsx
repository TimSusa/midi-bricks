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
import { PAGE_TYPES } from '../../reducers'
import { PropTypes } from 'prop-types'

import { bindActionCreators } from 'redux'
import { thunkLoadFile } from '../../actions/thunks/thunk-load-file'
import { Actions as MidiSliderActions } from '../../actions/slider-list'
import { Actions as ViewSettingsActions } from '../../actions/view-settings'
import { connect } from 'react-redux'

const version = process.env.REACT_APP_VERSION || 'dev'

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawerList)

DrawerList.propTypes = {
  classes: PropTypes.object,
  deleteAll: PropTypes.func,
  deleteFooterPages: PropTypes.func,
  thunkLoadFile: PropTypes.func,
  handleResetSliders: PropTypes.func,
  handleResetSlidersTmp: PropTypes.func,
  handleSaveFile: PropTypes.func,
  handleSaveFileTmp: PropTypes.func,
  onClose: PropTypes.func,
  onFileChange: PropTypes.func,
  saveFile: PropTypes.func,
  sliders: PropTypes.object,
  togglePage: PropTypes.func,
  viewSettings: PropTypes.object
}

function DrawerList(props) {
  const {
    classes,
    togglePage,
    saveFile,
    onFileChange,
    deleteAll,
    deleteFooterPages,
    handleSaveFile: handleSaveFileTmp,
    handleResetSliders: handleResetSlidersTmp,
    viewSettings,
    sliders,
    thunkLoadFile
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
          <ListItemLoadFileOnWeb
            onFileChange={(e) =>
              handleFileChange(e, thunkLoadFile, onFileChange)
            }
          />
        ) : (
          <ListItemLoadFileOnElectron
            onFileChange={(e) =>
              handleFileChange(e, thunkLoadFile, onFileChange)
            }
          />
        )}
      </List>
      <List>
        {process.env.REACT_APP_IS_WEB_MODE === 'true' ? (
          <ListItem
            button
            onClick={handleSaveFile.bind(
              this,
              saveFile,
              handleSaveFileTmp,
              viewSettings,
              sliders,
              version
            )}
          >
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            <ListItemText primary='Save Preset' />
          </ListItem>
        ) : (
          <ListItemSaveFileOnElectron
            onFileChange={(e) =>
              handleFileChange(e, thunkLoadFile, onFileChange)
            }
          />
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
            onAction={handleResetSliders.bind(
              this,
              handleResetSlidersTmp,
              deleteAll,
              deleteFooterPages
            )}
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

function handleResetSliders(cb, deleteAll, deleteFooterPages) {
  deleteFooterPages()
  deleteAll()
  cb()
}

function handleSaveFile(saveFile, handleSaveFile, viewSettings, sliders) {
  saveFile({
    viewSettings,
    sliders,
    version
  })
  handleSaveFile()
}

function mapStateToProps({ viewSettings, sliders, version }) {
  return {
    viewSettings,
    sliders
  }
}

function mapDispatchToProps(dispatch) {
  const { togglePage, saveFile, deleteFooterPages, deleteAll } = {
    ...MidiSliderActions,
    ...ViewSettingsActions
  }
  return {
    togglePage: bindActionCreators(togglePage, dispatch),
    saveFile: bindActionCreators(saveFile, dispatch),
    deleteFooterPages: bindActionCreators(deleteFooterPages, dispatch),
    deleteAll: bindActionCreators(deleteAll, dispatch),
    // actions: bindActionCreators(
    //   { ...MidiSliderActions, ...ViewSettingsActions },
    //   dispatch
    // ),
    thunkLoadFile: bindActionCreators(thunkLoadFile, dispatch)
  }
}

async function handleFileChange(content, thunkLoadFile, cb) {
  await thunkLoadFile(content.content, content.presetName)
  cb(content.content, content.presetName)
}
