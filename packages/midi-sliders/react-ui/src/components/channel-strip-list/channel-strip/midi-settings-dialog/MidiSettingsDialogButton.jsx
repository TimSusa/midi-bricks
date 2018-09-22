import React from 'react'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { withStyles } from '@material-ui/core/styles'
import MidiSettingsDialog from './MidiSettingsDialog'

class MidiSettingsDialogButton extends React.Component {
  state = {
    isDialogOpen: false
  }
  render () {
    const { sliderEntry, idx } = this.props
    const { classes } = this.props
    return (
      <div
        className={classes.root}
      >
        {
          !this.state.isDialogOpen ? (
            <ExpandMoreIcon
              className={classes.iconColor}
              onClick={() => this.setState({isDialogOpen: !this.state.isDialogOpen})}
            />
          ) : (
            <ExpandLessIcon
              className={classes.iconColor}
              onClick={() => this.setState({isDialogOpen: !this.state.isDialogOpen})}
            />
          )
        }
        {
          this.state.isDialogOpen ? (
            <MidiSettingsDialog
              open={this.state.isDialogOpen}
              onClose={this.onDialogClose}
              sliderEntry={sliderEntry}
              idx={idx}
            />
          ) : (
            <div />
          )
        }
      </div>

    )
  }

  onDialogClose = (val) => {
    this.setState({
      isDialogOpen: !this.state.isDialogOpen
    })
  }
}

const styles = theme => ({
  root: {
    // position: 'absolute',
    // left: -8
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    width: 16
  },
  icon: {
    width: 5
  }
})

export default withStyles(styles)(MidiSettingsDialogButton)
