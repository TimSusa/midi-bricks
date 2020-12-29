import React, { useState } from 'react'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'

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
import { PAGE_TYPES } from '../../global-state'
import { PropTypes } from 'prop-types'
import { thunkLoadFile } from '../../global-state/actions/thunks/thunk-load-file'
import { thunkDelete } from '../../global-state/actions/thunks/thunk-delete'
import { Actions as MidiSliderActions } from '../../global-state/actions/slider-list'
import { Actions as ViewSettingsActions } from '../../global-state/actions/view-settings'
import { useSelector, useDispatch } from 'react-redux'

const version = process.env.REACT_APP_VERSION || 'dev'
const { togglePage, saveFile } = {
  ...MidiSliderActions,
  ...ViewSettingsActions
}
export const DrawerList = DrawerListCmp

function DrawerListCmp(props) {
  const dispatch = useDispatch()
  const pages = useSelector((state) => state.pages)
  const viewSettings = useSelector((state) => state.viewSettings)
  const sliders = useSelector((state) => state.sliders)
  const {
    classes,
    onFileChange,
    handleResetSliders: handleResetSlidersTmp
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
            onFileChange={handleFileChange}
            iconColor={classes.iconColor}
          />
        ) : (
          <ListItemLoadFileOnElectron
            onFileChange={handleFileChange}
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
            onFileChange={handleFileChange}
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
            onAction={handleResetSliders}
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
  function handleResetSliders() {
    handleResetSlidersTmp()
    return dispatch(thunkDelete('all'))
  }
  async function handleFileChange(content) {
    await dispatch(thunkLoadFile(content.content, content.presetName))
    onFileChange(content.content, content.presetName)
  }
}

DrawerListCmp.propTypes = {
  classes: PropTypes.shape({
    drawerHeader: PropTypes.any,
    iconColor: PropTypes.any
  }),
  handleResetSliders: PropTypes.any,
  onClose: PropTypes.func,
  onFileChange: PropTypes.any
}
