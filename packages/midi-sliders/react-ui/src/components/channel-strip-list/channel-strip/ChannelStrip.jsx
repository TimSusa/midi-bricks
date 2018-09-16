import React from 'react'
import VisibilitySensor from 'react-visibility-sensor'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import MidiSlider from './MidiSlider'
import MidiButton from './MidiButtons'
import StripLabel from './StripLabel'
import { STRIP_TYPE } from '../../../reducers/slider-list'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../actions/slider-list.js'

class ChannelStrip extends React.Component {
  render () {
    const { sliderEntry, idx, classes, size } = this.props
    return (
      <VisibilitySensor partialVisibility>
        {({ isVisible }) =>
          <div
            className={classes.root}
          >
            {
              (sliderEntry.type === STRIP_TYPE.SLIDER) &&
              <React.Fragment>
                <Typography
                  className={classes.labelTop}
                >
                  {sliderEntry.label}
                </Typography>
                <MidiSlider
                  sliderEntry={sliderEntry}
                  idx={idx}
                  height={(size && size.height) || 0}
                  width={(size && size.width) || 0}
                />
              </React.Fragment>

            }
            {
              <MidiButton
                sliderEntry={sliderEntry}
                idx={idx}
                height={(size && size.height) || 0}
                width={(size && size.width) || 0}
              />
            }
            {
              (sliderEntry.type === STRIP_TYPE.LABEL) &&
                <StripLabel
                  sliderEntry={sliderEntry}
                  idx={idx}
                  height={(size && size.height) || 0}
                  width={(size && size.width) || 0}
                />
            }
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
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    // marginTop: 8,
    textOverflow: 'ellipsis',
    color: theme.palette.primary.contrastText,
    fontSize: '1rem',
    fontWeight: 600,
    // fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
