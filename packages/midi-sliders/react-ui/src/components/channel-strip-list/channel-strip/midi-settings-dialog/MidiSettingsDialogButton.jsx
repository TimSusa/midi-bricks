import React from 'react'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { withStyles } from '@material-ui/core/styles'
import MidiSettingsDialog from './MidiSettingsDialog'

const MidiSettingsDialogButton = props => {
  const {
    classes,
    sliderEntry,
    idx,
    isSettingsDialogMode,
    lastFocusedIdx,
  } = props
  const isOpen = !!(
    isSettingsDialogMode &&
    lastFocusedIdx !== undefined &&
    lastFocusedIdx === idx
  )
  return (
    <div className={classes.root}>
      {!isOpen ? (
        <ExpandMoreIcon
          className={classes.iconColor}
          onClick={props.toggleSettings.bind(this, {
            idx,
            isSettingsDialogMode: true,
          })}
        />
      ) : (
        <ExpandLessIcon
          className={classes.iconColor}
          onClick={props.toggleSettings.bind(this, {
            idx,
            isSettingsDialogMode: false,
          })}
        />
      )}
      {isOpen ? (
        <MidiSettingsDialog
          open={isOpen}
          onClose={props.toggleSettings.bind(this, {
            idx,
            isSettingsDialogMode: false,
          })}
          sliderEntry={sliderEntry}
          idx={idx}
        />
      ) : (
        <div />
      )}
    </div>
  )
}
const styles = theme => ({
  root: {},
  iconColor: {
    color: theme.palette.primary.contrastText,
    width: 16,
  },
  icon: {
    width: 5,
  },
})

export default withStyles(styles)(MidiSettingsDialogButton)
