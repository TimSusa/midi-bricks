import React from 'react'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/lab/Slider'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../actions/slider-list.js'

class MidiSlider extends React.Component {
  static defaultProps = {
    height: 0
  }
  render () {
    const { sliderEntry, idx, height } = this.props
    const { classes } = this.props
    return (
      <React.Fragment>
        <Slider
          style={{height: (height || 0) - 100}}
          classes={{
            root: classNames({
              [classes.sliderRoot]: true
            }),
            vertical: classes.vertical,
            activated: classes.activated,
            jumped: classes.jumped,
            track: classes.track,
            trackBefore: classes.trackBefore,
            trackAfter: classes.trackAfter,
            thumb: classes.thumb
          }}
          vertical
          reverse
          value={sliderEntry.val}
          onChange={this.handleSliderChange.bind(this, idx)}
          onTouchStart={this.touchToMouseEvent}
          onTouchEnd={this.touchToMouseEvent}
          onTouchMove={this.touchToMouseEvent}
          max={127}
          min={0}
          step={1}
        />
        <Typography className={classes.caption}>{sliderEntry.val}</Typography>
      </React.Fragment>
    )
  }

  handleSliderChange = (idx, e, val) => {
    this.props.actions.handleSliderChange({ idx, val })
  }

  // In order to have multi-touch available,
  // convert touch to mouse events
  touchToMouseEvent = (e) => {
    [...e.changedTouches].forEach((touch) => {
      const evt = new window.MouseEvent('click', {
        view: window,
        bubbles: false,
        cancelable: true,
        clientX: touch.clientX,
        clientY: touch.clientY,
        screenX: touch.screenX,
        screenY: touch.screenY,
        relatedTarget: touch.target
      })
      window.requestAnimationFrame(() => {
        touch.target.dispatchEvent(evt)
        evt.preventDefault()
      })
    })
  }
}

const styles = theme => ({
  sliderRoot: {
    cursor: 'default',
    width: '100%',

    '&$vertical': {
      margin: 0,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  vertical: {
  },
  activated: {},
  jumped: {
    transition: 'none'
  },
  track: {
    '&$vertical': {
      width: 66,
      border: 'solid 2px rgba(0,0,0,0.1)',
      borderRadius: 2
    }
  },
  trackBefore: {
    background: theme.palette.slider.trackActive,
    opacity: 1,
    '&$activated': {
      opacity: 1,
      background: theme.palette.slider.trackActive
    }
  },
  trackAfter: {
    background: theme.palette.slider.trackNonactive,
    '&$activated': {
      background: theme.palette.slider.trackNonactive
    },
    '&$jumped': {
      background: theme.palette.slider.trackNonactive
    }
  },
  thumb: {
    width: 66,
    height: 35,
    left: '50%',
    borderRadius: 2,
    background: theme.palette.slider.thump,
    border: 'solid 1px ' + theme.palette.slider.thumpBorder,

    '&$activated': {
      boxShadow: '0 0 3px 3px grey',
      width: 64,
      height: 35
    },
    '&$jumped': {
      border: 'solid 2px rgba(0,0,0,1)',
      width: 66,
      height: 35
    }
  },
  caption: {
    textAlign: 'center',
    marginTop: theme.spacing.unit,
    color: theme.palette.primary.contrastText,
    fontSize: '1rem',
    fontWeight: 500,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default (withStyles(styles)(connect(null, mapDispatchToProps)(MidiSlider)))
