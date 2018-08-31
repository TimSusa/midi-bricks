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
        <Button
          className={classes.buttonExpand}
          onClick={() => this.setState({isDialogOpen: !this.state.isDialogOpen})}>
          {
            this.state.isDialogOpen ? (
              <ExpandMoreIcon />
            ) : (
              <ExpandLessIcon />
            )
          }
        </Button>
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

  buttonExpand: {
    margin: '8px 0',
    width: '100%'
  }

})

export default withStyles(styles)(MidiSettingsDialogButton)
