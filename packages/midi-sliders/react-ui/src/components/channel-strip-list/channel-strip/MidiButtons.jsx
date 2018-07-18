import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import MusicIcon from '@material-ui/icons/MusicNote'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../actions/midi-sliders.js'

class MidiButtons extends React.Component {
  render () {
    const { sliderEntry, idx, classes } = this.props
    return (
      <div className={classNames({
        [classes.root]: true,
        [classes.rootExpanded]: sliderEntry.isExpanded,
        [classes.rootCollapsed]: !sliderEntry.isExpanded
      })}>
        <div className={classes.group}>
          <Tooltip
            placement='right'
            title='Trigger sending MIDI Note'
          >
            <Button
              className={classes.button}
              variant='raised'
              onMouseDown={this.props.actions.toggleNote.bind(this, idx)}
              onMouseUp={this.props.actions.toggleNote.bind(this, idx)}
              onTouchStart={this.props.actions.toggleNote.bind(this, idx)}
              onTouchEnd={this.props.actions.toggleNote.bind(this, idx)}
            >
              <MusicIcon className={classes.iconColor} />
            </Button>
          </Tooltip>

          <Tooltip
            placement='right'
            title='Toggle sending Note On/Off'
          >
            <Button
              classes={{ root: classes.button }}
              variant='raised'
              onClick={this.props.actions.toggleNote.bind(this, idx)}>
              <MusicIcon className={classes.iconColor} />
              <Typography
                variant='caption'>
                {sliderEntry.isNoteOn ? 'Off ' : 'On'}
              </Typography>
            </Button>
          </Tooltip>
        </div>
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rootCollapsed: {
    height: 'calc(100vh - 196px)'
  },
  rootExpanded: {
    height: 'calc(100vh - 480px)'
  },
  group: {
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer'
  },
  button: {
    marginBottom: 4 * theme.spacing.unit,
    background: theme.palette.secondary.light,
    height: 'calc(100vh - 750px)',
    minHeight: 80
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default (withStyles(styles)(connect(null, mapDispatchToProps)(MidiButtons)))
