import React, { useState } from 'react'
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
import DeleteModal from '../DeleteModal'
import ViewSettingsDialog from '../ApplicationSettingsDialog'
import { ListItemLoadFileOnElectron } from './ListItemLoadFileOnElectron'
import { ListItemSaveFileOnElectron } from './ListItemSaveFileOnElectron'
import { ListItemLoadFileOnWeb } from './ListItemLoadFileOnWeb'
import { PAGE_TYPES } from '../../global-state/reducers'
import { PropTypes } from 'prop-types'

import { thunkLoadFile } from '../../global-state/actions/thunks/thunk-load-file'
import { thunkDelete } from '../../global-state/actions/thunks/thunk-delete'
//import { thunkLiveModeToggle } from '../../global-state/actions/thunks/thunk-live-mode-toggle'
import { Actions as MidiSliderActions } from '../../global-state/actions/slider-list'
import { Actions as ViewSettingsActions } from '../../global-state/actions/view-settings'
import { useSelector, useDispatch } from 'react-redux'

const version = process.env.REACT_APP_VERSION || 'dev'
const { togglePage, saveFile, deleteFooterPages, deleteAll } = {
  ...MidiSliderActions,
  ...ViewSettingsActions
}
export const DrawerList = DrawerListCmp

DrawerListCmp.propTypes = {
  classes: PropTypes.object,
  deleteAll: PropTypes.func,
  deleteFooterPages: PropTypes.func,
  thunkLoadFile: PropTypes.func,
  thunkDelete: PropTypes.func,
  handleResetSliders: PropTypes.func,
  handleResetSlidersTmp: PropTypes.func,
  handleSaveFile: PropTypes.func,
  handleSaveFileTmp: PropTypes.func,
  onClose: PropTypes.func,
  onFileChange: PropTypes.func,
  saveFile: PropTypes.func,
  sliders: PropTypes.object,
  pages: PropTypes.object,
  togglePage: PropTypes.func,
  viewSettings: PropTypes.object
}

function DrawerListCmp(props) {
  const dispatch = useDispatch()
  const pages = useSelector((state) => state.pages)
  const viewSettings = useSelector((state) => state.viewSettings)
  const sliders = useSelector((state) => state.sliders)
  const {
    classes,
    // togglePage,
    // saveFile,
    onFileChange,
    // deleteAll,
    // deleteFooterPages,
    // handleSaveFile: handleSaveFileTmp,
    handleResetSliders: handleResetSlidersTmp
    // thunkLoadFile,
    // thunkDelete
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
            dispatch(
              togglePage({
                pageType: PAGE_TYPES.HOME_MODE
              })
            )
          }
        >
          <ListItemIcon className={classes.iconColor}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary='Main' />
        </ListItem>
        <ListItem
          button
          onClick={() =>
            dispatch(
              togglePage({
                pageType: PAGE_TYPES.GLOBAL_MODE
              })
            )
          }
        >
          <ListItemIcon className={classes.iconColor}>
            <GlobalIcon />
          </ListItemIcon>
          <ListItemText primary='Controllers' />
        </ListItem>

        <ListItem
          button
          onClick={() =>
            dispatch(
              togglePage({
                pageType: PAGE_TYPES.MIDI_DRIVER_MODE
              })
            )
          }
        >
          <ListItemIcon className={classes.iconColor}>
            <IconDriverSettings />
          </ListItemIcon>
          <ListItemText primary='Drivers' />
        </ListItem>

        <ListItem
          button
          onClick={
            !isOpenViewSettings
              ? () => dispatch(setIsOpenViewSettings(!isOpenViewSettings))
              : () => {}
          }
        >
          <ListItemIcon className={classes.iconColor}>
            <ViewIcon />
          </ListItemIcon>
          <ListItemText primary='Preferences' />
          <ViewSettingsDialog
            isOpen={isOpenViewSettings}
            onClose={() => {
              dispatch(setIsOpenViewSettings(!isOpenViewSettings))
              props.onClose()
            }}
            iconColor={classes.iconColor}
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
            iconColor={classes.iconColor}
          />
        ) : (
          <ListItemLoadFileOnElectron
            onFileChange={(e) =>
              handleFileChange(e, thunkLoadFile, onFileChange)
            }
            iconColor={classes.iconColor}
          />
        )}
      </List>
      <List>
        {process.env.REACT_APP_IS_WEB_MODE === 'true' ? (
          <ListItem
            button
            onClick={() =>
              dispatch(
                saveFile({
                  pages,
                  viewSettings,
                  sliders,
                  version
                })
              )
            }
          >
            <ListItemIcon className={classes.iconColor}>
              <SaveIcon />
            </ListItemIcon>
            <ListItemText primary='Save Preset' />
          </ListItem>
        ) : (
          <ListItemSaveFileOnElectron
            onFileChange={(e) =>
              handleFileChange(e, thunkLoadFile, onFileChange)
            }
            iconColor={classes.iconColor}
          />
        )}
        <ListItem button onClick={() => setOpen(!open)}>
          <ListItemIcon className={classes.iconColor}>
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
              thunkDelete,
              handleResetSlidersTmp,
              deleteAll,
              deleteFooterPages
            )}
            onClose={setOpen}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon className={classes.iconColor}>
            <VersionIcon />
          </ListItemIcon>
          <ListItemText primary={`${version}`} />
        </ListItem>
      </List>
      <Divider />
    </React.Fragment>
  )
  function handleResetSliders(thunkDeletet, cb) {
    cb()
    return dispatch(thunkDeletet('all'))
  }
  async function handleFileChange(content, thunkLoadFilet, cb) {
    await thunkLoadFilet(content.content, content.presetName)
    cb(content.content, content.presetName)
  }
}

// function mapDispatchToProps(dispatch) {
//   const { togglePage, saveFile, deleteFooterPages, deleteAll } = {
//     ...MidiSliderActions,
//     ...ViewSettingsActions
//   }
//   return {
//     togglePage: bindActionCreators(togglePage, dispatch),
//     saveFile: bindActionCreators(saveFile, dispatch),
//     deleteFooterPages: bindActionCreators(deleteFooterPages, dispatch),
//     deleteAll: bindActionCreators(deleteAll, dispatch),
//     thunkLoadFile: bindActionCreators(thunkLoadFile, dispatch),
//     thunkDelete: bindActionCreators(thunkDelete, dispatch),
//     thunkLiveModeToggle: bindActionCreators(thunkLiveModeToggle, dispatch)
//   }
// }
