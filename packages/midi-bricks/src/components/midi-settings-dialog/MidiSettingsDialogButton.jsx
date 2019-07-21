import React from 'react'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'
import MidiSettingsDialog from './MidiSettingsDialog'



MidiSettingsDialogButton.propTypes = {
  isOpen: PropTypes.bool,
  sliderEntry: PropTypes.object,
  toggleSettings: PropTypes.func
}

export default function MidiSettingsDialogButton(props) {
  const { isOpen, toggleSettings, sliderEntry } = props
    const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()

  return (
    <div className={classes.root}>
      {!isOpen ? (
        <ExpandMoreIcon
          className={classes.iconColor}
          onClick={toggleSettings.bind(this, {
            isSettingsDialogMode: true
          })}
        />
      ) : (
        <ExpandLessIcon
          className={classes.iconColor}
          onClick={toggleSettings.bind(this, {
            isSettingsDialogMode: false
          })}
        />
      )}
      {isOpen ? (
        <MidiSettingsDialog
          open={isOpen}
          onClose={toggleSettings.bind(this, {
            isSettingsDialogMode: false
          })}
          sliderEntry={sliderEntry}
        />
      ) : (
        <div />
      )}
    </div>
  )
}

function styles(theme) {
  return {
    root: {},
    iconColor: {
      color: theme.palette.primary.contrastText,
      width: 16
    },
    icon: {
      width: 5
    }
  }
}
