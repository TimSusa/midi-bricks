import React from 'react'
import VisibilitySensor from 'react-visibility-sensor'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import MidiSlider from './MidiSlider'
import MidiButton from './MidiButtons'
import { STRIP_TYPE } from '../../../reducers/slider-list'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../actions/slider-list.js'
import MidiSettingsDialogButton from './midi-settings-dialog/MidiSettingsDialogButton'

class ChannelStrip extends React.Component {
  render () {
    const { sliderEntry, idx } = this.props
    const { classes } = this.props
    return (
      <VisibilitySensor partialVisibility>
        {({ isVisible }) =>
          <div
            className={classes.root}
          >

            <Typography className={classes.labelTop} >
              {sliderEntry.label}
            </Typography>

            {
              (sliderEntry.type === STRIP_TYPE.SLIDER) &&
              <MidiSlider
                sliderEntry={sliderEntry}
                idx={idx}
                height={(this.props.size && this.props.size.height) || 0}
                width={(this.props.size && this.props.size.width) || 0}
              />
            }
            {
              <MidiButton
                sliderEntry={sliderEntry}
                idx={idx}
                height={(this.props.size && this.props.size.height) || 0}
                width={(this.props.size && this.props.size.width) || 0}
              />
            }
            <MidiSettingsDialogButton
              sliderEntry={sliderEntry}
              idx={idx}
            />
          </div>
        }
      </VisibilitySensor>
    )
  }
}

const styles = theme => ({
  root: {
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer'
  },
  labelTop: {
    textAlign: 'center',
    padding: theme.spacing.unit * 2,
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
    color: theme.palette.primary.contrastText,
    textAlign: 'center'
  }

})

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default withStyles(styles)(((connect(null, mapDispatchToProps)(ChannelStrip))))
