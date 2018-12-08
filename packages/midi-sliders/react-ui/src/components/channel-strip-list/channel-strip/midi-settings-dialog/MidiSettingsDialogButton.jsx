import React from 'react'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { withStyles } from '@material-ui/core/styles'
import MidiSettingsDialog from './MidiSettingsDialog'

class MidiSettingsDialogButton extends React.PureComponent {
  render() {
    const {
      classes,
      sliderEntry,
      idx,
      isSettingsDialogMode,
      lastFocusedIdx,
    } = this.props
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
            onClick={this.props.toggleSettings.bind(this, {
              idx,
              isSettingsDialogMode: true,
            })}
          />
        ) : (
          <ExpandLessIcon
            className={classes.iconColor}
            onClick={this.props.toggleSettings.bind(this, {
              idx,
              isSettingsDialogMode: false,
            })}
          />
        )}
        {isOpen ? (
          <MidiSettingsDialog
            open={isOpen}
            onClose={this.props.toggleSettings.bind(this, {
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
