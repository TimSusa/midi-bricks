import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import MusicIcon from '@material-ui/icons/MusicNote'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../actions/slider-list.js'

class MidiButtons extends React.Component {
  render () {
    const { sliderEntry, idx, classes } = this.props
    return (
      <div className={classNames({
        [classes.root]: true
      })}>
        <div className={classes.group}>
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
        </div>
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 230px)'
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
    minHeight: 88,
    maxHeight: 150
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default (withStyles(styles)(connect(null, mapDispatchToProps)(MidiButtons)))
