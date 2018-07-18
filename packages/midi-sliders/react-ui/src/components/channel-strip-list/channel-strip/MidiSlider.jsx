import React from 'react'
import Typography from '@material-ui/core/Typography'

import Slider from '@material-ui/lab/Slider'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../actions/midi-sliders.js'

class MidiSlider extends React.Component {
  render () {
    const { sliderEntry, idx } = this.props
    const { classes } = this.props
    return (
      <React.Fragment>
        <Slider
          classes={{
            root: classNames({
              [classes.sliderRootExpanded]: sliderEntry.isExpanded,
              [classes.sliderRoot]: !sliderEntry.isExpanded
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
}

const styles = theme => ({
  vertical: {
  },
  activated: {},
  jumped: {
    transition: 'none'
  },
  track: {
    '&$vertical': {
      width: 80,
      border: 'solid 1px rgba(0,0,0,0.1)',
      borderRadius: 2
    }
  },
  trackBefore: {
    background: theme.palette.secondary.dark,
    '&$activated': {
    }
  },
  trackAfter: {
    background: theme.palette.primary.light,
    '&$activated': {
      background: theme.palette.primary.light
    },
    '&$jumped': {
      background: theme.palette.primary.light
    }
  },
  thumb: {
    width: 80,
    height: 40,
    borderRadius: 2,
    border: 'solid 1px rgba(0,0,0,0.2)',

    '&$activated': {
      boxShadow: '0 0 3px 3px grey',
      width: 84,
      height: 40,
      background: theme.palette.primary.dark
    },
    '&$jumped': {
      width: 80,
      height: 40
    }
  },
  sliderRoot: {
    width: 80,
    cursor: 'default',

    '&$vertical': {
      height: 'calc(100vh - 226px)',
      margin: 0,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  sliderRootExpanded: {
    width: 80,
    cursor: 'default',

    '&$vertical': {
      height: 'calc(100vh - 508px)',
      margin: 0,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  caption: {
    marginTop: theme.spacing.unit,
    color: theme.palette.primary.contrastText,
    fontSize: '1rem',
    fontWeight: 400,
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
