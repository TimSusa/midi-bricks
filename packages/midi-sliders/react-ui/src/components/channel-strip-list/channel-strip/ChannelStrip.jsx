import React from 'react'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import MidiSlider from './MidiSlider'
import MidiButton from './MidiButtons'
import { STRIP_TYPE } from '../../../reducers/midi-sliders'
import ExpandedStrip from './ExpandedStrip'
import { withStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../actions/midi-sliders.js'
import CircularProgress from '@material-ui/core/CircularProgress'

import VisibilitySensor from 'react-visibility-sensor'

class ChannelStrip extends React.Component {
  render () {
    const { sliderEntry, idx } = this.props
    const { classes } = this.props
    return (
      <VisibilitySensor partialVisibility>
        {({ isVisible }) =>
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

            {
              (sliderEntry.type === STRIP_TYPE.SLIDER) && <MidiSlider sliderEntry={sliderEntry} idx={idx} />
            }
            {
              (sliderEntry.type === STRIP_TYPE.BUTTON) && <MidiButton sliderEntry={sliderEntry} idx={idx} />
            }
            {
              sliderEntry.isExpanded && isVisible && <ExpandedStrip {...this.props} />
            }
            {
              !isVisible && <CircularProgress />
            }
            {
              isVisible && <div >
                {
                  !sliderEntry.isExpanded ? (

                    <Tooltip placement='right'

                      title='Show'
                    >
                      <Button
                        className={classes.buttonExpand}
                        onClick={this.props.actions.expandSlider.bind(this, idx)}>
                        <ExpandLessIcon className={classes.iconColor} />
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip placement='right'

                      title='Hide'
                    >
                      <Button
                        className={classes.buttonExpand}
                        onClick={this.props.actions.expandSlider.bind(this, idx)}>
                        <ExpandMoreIcon className={classes.iconColor} />
                      </Button>
                    </Tooltip>

                  )
                }
              </div>
            }
          </div>
        }
      </VisibilitySensor>

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
    width: 100,
    height: 'calc(100vh - 112px)',
    margin: '0 16px 0 16px'
  },
  button: {
    margin: theme.spacing.unit,
    background: theme.palette.secondary.light
  },
  buttonExpand: {
    margin: theme.spacing.unit
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
    maxWidth: 100
  },
  labelTop: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: theme.palette.primary.contrastText,
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
  }
})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default (withStyles(styles)(connect(null, mapDispatchToProps)(ChannelStrip)))
