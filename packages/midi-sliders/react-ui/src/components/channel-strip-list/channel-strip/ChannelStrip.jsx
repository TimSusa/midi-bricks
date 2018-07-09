import React from 'react'
import Input from '@material-ui/core/Input'
import Typography from '@material-ui/core/Typography'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Slider from '@material-ui/lab/Slider'
import ExpandedStrip from './ExpandedStrip'
import { withStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../actions/midi-sliders.js'

class ChannelStrip extends React.Component {
  render () {
    const { sliderEntry, idx } = this.props.data
    const { classes } = this.props
    return (
      <div className={classes.sliderContainer}>
        {
          sliderEntry.isExpanded ? (
            <Input
              classes={{ input: classes.inputInput }}
              className={classes.input}
              type='text'
              onChange={this.handleLabelChange.bind(this, idx)}
              value={sliderEntry.label}
            />
          ) : (
            <Typography className={classes.labelTop} >
              {sliderEntry.label}
            </Typography>
          )
        }

        <Slider
          classes={{
            root: classes.sliderRoot,
            vertical: classes.vertical,
            activated: classes.activated,
            jumped: classes.jumped,
            track: classes.track,
            trackBefore: classes.trackBefore,
            trackAfter: classes.trackAfter,
            thumb: classes.thumb
          }}
          style={{ height: !sliderEntry.isExpanded ? 'calc(100vh - 88px - 120px)' : 'calc(100vh - 88px - 500px)', transition: 'height 1s ease' }}
          vertical
          reverse
          value={sliderEntry.val}
          onChange={this.handleSliderChange.bind(this, idx)}
          max={127}
          min={0}
          step={1}
        />
        <Typography className={classes.caption}>{sliderEntry.val}</Typography>

        {
          sliderEntry.isExpanded && <ExpandedStrip {...this.props} />
        }
        <div onClick={this.props.actions.expandSlider.bind(this, idx)}>
          {
            !sliderEntry.isExpanded ? (
              <ExpandLessIcon className={classes.iconColor} />
            ) : (
              <ExpandMoreIcon className={classes.iconColor} />
            )
          }
        </div>
      </div>
    )
  }
  handleLabelChange = (idx, e, val) => {
    this.props.actions.changeSliderLabel({
      idx,
      val: e.target.value
    })
  }
  handleSliderChange = (idx, e, val) => {
    this.props.actions.handleSliderChange({ idx, val })
  }
}

const styles = theme => ({

  sliderContainer: {
    width: 180,
    margin: '0 16px 0 16px'
  },
  vertical: {
  },
  activated: {},
  jumped: {
    transition: 'none'
  },
  track: {
    '&$vertical': {
      width: 120,
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
    width: 120,
    height: 40,
    borderRadius: 2,
    border: 'solid 1px rgba(0,0,0,0.2)',

    '&$activated': {
      boxShadow: '0 0 3px 3px grey',
      width: 114,
      height: 40,
      background: theme.palette.primary.dark
    },
    '&$jumped': {
      width: 120,
      height: 40
    }
  },
  sliderRoot: {
    width: 120,
    cursor: 'default',

    '&$vertical': {
      margin: 0,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  button: {
    margin: theme.spacing.unit,
    background: theme.palette.secondary.light
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer'
  },
  labelReadOnly: {
    padding: '6px 0 7px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  input: {
    width: 80,
    margin: theme.spacing.unit,
    color: theme.palette.primary.contrastText, // 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  },
  inputInput: {
    padding: 0
  },
  formControl: {
    margin: theme.spacing.unit,
    maxWidth: 140
  },
  labelTop: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: theme.palette.primary.contrastText,
    margin: theme.spacing.unit,
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em'
  },
  label: {
    color: theme.palette.primary.contrastText
  },
  select: {
    width: 80,
    color: theme.palette.primary.contrastText,
    lineHeight: '1.375em'
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

export default (withStyles(styles)(connect(null, mapDispatchToProps)(ChannelStrip)))
