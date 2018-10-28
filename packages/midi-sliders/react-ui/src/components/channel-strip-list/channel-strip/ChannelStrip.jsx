import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MidiSlider from './midi-elements/MidiSlider'
import MidiButtons from './midi-elements/midi-buttons/MidiButtons'
import StripLabel from './midi-elements/StripLabel'
import { STRIP_TYPE } from '../../../reducers/slider-list'
import MidiPage from './midi-elements/MidiPage'
import MidiSliderHorz from './midi-elements/MidiSliderHorz'

// This component configures the kind of channel strip
class ChannelStrip extends React.PureComponent {
  render () {
    const { sliderEntry, idx, classes, size, isDisabled } = this.props
    const tmpH = (size && size.height) || 0
    const tmpW = (size && size.width) || 0
    const isButton =
    (sliderEntry.type !== STRIP_TYPE.SLIDER) &&
    (sliderEntry.type !== STRIP_TYPE.LABEL)

    return (
      <div
        className={classes.root}
      >
        {
          (sliderEntry.type === STRIP_TYPE.SLIDER) &&
          <MidiSlider
            isDisabled={isDisabled}
            sliderEntry={sliderEntry}
            idx={idx}
            height={tmpH}
            width={tmpW}
          />
        }
        {
          (sliderEntry.type === STRIP_TYPE.SLIDER_HORZ) &&
          <MidiSliderHorz
            isDisabled={isDisabled}
            sliderEntry={sliderEntry}
            idx={idx}
            height={tmpH}
            width={tmpW}
          />
        }
        {
          (isButton) &&
          <MidiButtons
            sliderEntry={sliderEntry}
            idx={idx}
            height={tmpH}
            width={tmpW}
          />
        }
        {
          (sliderEntry.type === STRIP_TYPE.LABEL) &&
          <StripLabel
            sliderEntry={sliderEntry}
            idx={idx}
            height={tmpH}
            width={tmpW}
          />
        }
        {
          (sliderEntry.type === STRIP_TYPE.PAGE) &&
          <MidiPage
            sliderEntry={sliderEntry}
            idx={idx}
            height={tmpH}
            width={tmpW}
          />
        }
      </div>
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

  label: {
    color: theme.palette.primary.contrastText,
    textAlign: 'center'
  }

})

export default withStyles(styles)(ChannelStrip)
