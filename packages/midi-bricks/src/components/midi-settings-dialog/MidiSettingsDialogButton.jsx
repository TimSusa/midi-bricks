import React, { Suspense } from 'react'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'

MidiSettingsDialogButton.propTypes = {
  isOpen: PropTypes.bool,
  sliderEntry: PropTypes.object,
  toggleSettings: PropTypes.func
}

// Bad hack go away! (fixes re-running midi-settings dialog, when giving input changes)
let MidiSettingsDialog = null

export default function MidiSettingsDialogButton(props) {
  const {
    isOpen,
    toggleSettings,
    sliderEntry: { i }
  } = props
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()
  if (isOpen && !MidiSettingsDialog) {
    MidiSettingsDialog = React.lazy(() => import('./MidiSettingsDialog'))
  }

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
        <Suspense fallback={<div>Loading MidiSettingsDialog...</div>}>
          <MidiSettingsDialog
            open={isOpen}
            onClose={toggleSettings.bind(this, {
              isSettingsDialogMode: false
            })}
            i={i}
          />
        </Suspense>
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
