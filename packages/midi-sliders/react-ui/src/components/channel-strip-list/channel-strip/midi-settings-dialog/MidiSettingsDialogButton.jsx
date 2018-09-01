import React from 'react'
import Button from '@material-ui/core/Button'
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
      <React.Fragment>
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
      </React.Fragment>

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
  },
  iconColor: {
    color: theme.palette.primary.contrastText
  }
})

export default withStyles(styles)(MidiSettingsDialogButton)
