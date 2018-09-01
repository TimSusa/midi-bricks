import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import MusicIcon from '@material-ui/icons/MusicNote'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../actions/slider-list.js'
import { STRIP_TYPE } from '../../../reducers/slider-list'

class MidiButtons extends React.Component {
  render () {
    const { sliderEntry, idx, classes, height, width } = this.props
    if (sliderEntry.type === STRIP_TYPE.BUTTON) {
      return (
        <div
          className={classNames({
            [classes.root]: true
          })}
        >
          <div >
            <Button
              style={{height: ((height || 0) - 90), width: ((width || 0) - 56)}}
              onContextMenu={this.preventCtxMenu}
              className={classes.button}
              variant='raised'
              onMouseDown={this.props.actions.toggleNote.bind(this, idx)}
              onMouseUp={this.props.actions.toggleNote.bind(this, idx)}
              onTouchStart={this.handleTouchButtonTrigger.bind(this, idx)}
              onTouchEnd={this.handleTouchButtonTrigger.bind(this, idx)}
            >
              <MusicIcon className={classes.iconColor} />
            </Button>
          </div>
        </div>
      )
    } else if (sliderEntry.type === STRIP_TYPE.BUTTON_TOGGLE) {
      return (
        <div
          className={classNames({
            [classes.root]: true

          })}>
          <div >
            <Button
              style={{height: ((height || 0) - 90), width: ((width || 0) - 56)}}
              onContextMenu={this.preventCtxMenu}
              classes={{ root: classes.button }}
              variant='raised'
              onClick={this.handleTouchButtonTrigger.bind(this, idx)}
              // onTouchStart={this.handleTouchButtonTrigger.bind(this, idx)}
            >
              <MusicIcon className={classes.iconColor} />
              <Typography
                variant='caption'>
                {sliderEntry.isNoteOn ? 'Off ' : 'On'}
              </Typography>
            </Button>
          </div>
        </div>)
    } else {
      return (<div />)
    }
  }

  // For touch-devices, we do not want
  // context menu being shown on touch events
  preventCtxMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  // Prevent double events, after touch,
  // from being triggered
  handleTouchButtonTrigger = (idx, e) => {
    this.props.actions.toggleNote(idx)
    e.preventDefault()
    e.stopPropagation()
  }
}

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  group: {
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer'
  },
  button: {
    background: theme.palette.secondary.light
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default (withStyles(styles)(connect(null, mapDispatchToProps)(MidiButtons)))
