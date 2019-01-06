import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MidiSlider from './midi-elements/MidiSlider'
import MidiButtons from './midi-elements/midi-buttons/MidiButtons'
import StripLabel from './midi-elements/StripLabel'
import { STRIP_TYPE } from '../../../reducers/slider-list'
import MidiPage from './midi-elements/MidiPage'
import MidiSliderHorz from './midi-elements/MidiSliderHorz'
import XyPad from '../../XyPad'
import { Typography } from '@material-ui/core';

const ChannelStrip = props => {
  const {
    sliderEntry,
    sliderEntry: { type },
    idx,
    classes,
    size,
    isDisabled,
  } = props
  const tmpH = (size && size.height) || 0
  const tmpW = (size && size.width) || 0
  const isButton = type !== STRIP_TYPE.SLIDER && type !== STRIP_TYPE.LABEL
  return (
    <div className={classes.root}>

      {type === STRIP_TYPE.SLIDER && (

        <MidiSlider
          isDisabled={isDisabled}
          sliderEntry={sliderEntry}
          idx={idx}
          height={tmpH}
          width={tmpW}
        />
      )}
      {type === STRIP_TYPE.SLIDER_HORZ && (
        <MidiSliderHorz
          isDisabled={isDisabled}
          sliderEntry={sliderEntry}
          idx={idx}
          height={tmpH}
          width={tmpW}
        />
      )}
      {isButton && (
        <MidiButtons
          sliderEntry={sliderEntry}
          idx={idx}
          height={tmpH}
          width={tmpW}
        />
      )}
      {type === STRIP_TYPE.LABEL && (
        <StripLabel
          sliderEntry={sliderEntry}
          idx={idx}
          height={tmpH}
          width={tmpW}
        />
      )}
      {type === STRIP_TYPE.PAGE && (
        <MidiPage
          sliderEntry={sliderEntry}
          idx={idx}
          height={tmpH}
          width={tmpW}
        />
      )}
      {type === STRIP_TYPE.XYPAD && (
        <XyPad classes={classes} sliderEntry={sliderEntry} idx={idx} height={tmpH} width={tmpW} />
      )}
    </div>
  )
}

const styles = theme => ({
  root: {},
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer',
  },

  label: {
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
  },
})

export default withStyles(styles)(ChannelStrip)
