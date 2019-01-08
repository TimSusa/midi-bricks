import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MidiSlider from './midi-elements/MidiSlider'
import MidiButtons from './midi-elements/midi-buttons/MidiButtons'
import StripLabel from './midi-elements/StripLabel'
import { STRIP_TYPE } from '../../../reducers/slider-list'
import MidiPage from './midi-elements/MidiPage'
import MidiSliderHorz from './midi-elements/MidiSliderHorz'
import XyPad from '../../XyPad'
import { Typography } from '@material-ui/core'

class ChannelStrip extends React.Component {

  render() {
    const {
      sliderEntry,
      sliderEntry: { type, label, val },
      idx,
      classes,
      size,
      isDisabled,
    } = this.props
    const tmpH = (size && size.height) || 0
    const tmpW = (size && size.width) || 0
    const isButton = type !== STRIP_TYPE.SLIDER && type !== STRIP_TYPE.LABEL

    return (
      <div className={classes.root}>
        {type === STRIP_TYPE.SLIDER && (
          <div className={classes.sliderChannelWrapper}>
            {/* <Typography className={classes.topLabel}>{label}</Typography> */}
            {/* <div className={classes.sliderWrapper} style={{flexBasis: tmpH}}>me</div> */}
            <MidiSlider
            className={classes.sliderWrapper} style={{flexBasis: tmpH}}
              isDisabled={isDisabled}
              sliderEntry={sliderEntry}
              idx={idx}
              height={tmpH}
              width={tmpW}
            />
            <Typography className={classes.bottomLabel}>{val}</Typography>
          </div>
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
          <XyPad
            classes={classes}
            sliderEntry={sliderEntry}
            idx={idx}
            height={tmpH}
            width={tmpW}
          />
        )}
      </div>
    )
  }
}



const styles = theme => ({
  root: {},
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer',
  },
  sliderChannelWrapper:{
    display: 'flex',
    flexDirection: 'column',
    // flexGrow: 1
    //position: 'fixed',
    justifyContent: 'space-evenly',
    
  },
  sliderWrapper: {
    background: 'pink',
    //height: '100%',
    flexGrow: 8
  },
  topLabel: {
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
    // top: 0,
    // position: 'fixed'
  },
  bottomLabel: {
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
    marginTop: 16
    //bottom: 0,
   // position: 'fixed'
  },
  label: {
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
  },
})

export default withStyles(styles)(ChannelStrip)

