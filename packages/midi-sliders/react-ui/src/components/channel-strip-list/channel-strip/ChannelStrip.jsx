import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MidiSlider from './midi-elements/MidiSlider'
import MidiButtons from './midi-elements/midi-buttons/MidiButtons'
import StripLabel from './midi-elements/StripLabel'
import { STRIP_TYPE } from '../../../reducers/slider-list'
import MidiPage from './midi-elements/MidiPage'
import MidiSliderHorz from './midi-elements/MidiSliderHorz'
import XyPad from '../../XyPad'

class ChannelStrip extends React.Component {
  sliderThumbHeight = 30

  constructor(props) {
    super(props)
    this.topLabelRef = React.createRef()
    this.bottomLabelRef = React.createRef()
  }

  render() {
    const {
      sliderEntry,
      sliderEntry: { type, label, val, fontSize, fontWeight, isValueHidden },
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
            <Label
              fontSize={fontSize}
              fontWeight={fontWeight}
              labelStyle={this.props.classes.label}
              {...this.props}
              ref={this.topLabelRef}
            >
              {label}
            </Label>

            <MidiSlider
              className={classes.sliderWrapper}
              style={{ flexBasis: tmpH }}
              isDisabled={isDisabled}
              sliderEntry={sliderEntry}
              idx={idx}
              height={this.calcHeight(tmpH)}
              width={tmpW}
              sliderThumbHeight={this.sliderThumbHeight}
            />
            {!isValueHidden ? (
              <Label
                fontSize={fontSize}
                fontWeight={fontWeight}
                labelStyle={this.props.classes.bottomLabel}
                {...this.props}
                ref={this.bottomLabelRef}
              >
                {val}
              </Label>
            ) : null}
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
  calcHeight = tmpH => {
    return (
      tmpH -
      this.calcTopLabelHeight(tmpH) -
      this.calcBottomLabelHeight(tmpH) -
      this.sliderThumbHeight
    )
  }
  calcTopLabelHeight = () => {
    const topLabelHeight =
      this.topLabelRef.current !== null &&
      this.topLabelRef.current.clientHeight !== null
        ? this.topLabelRef.current.clientHeight
        : parseInt(this.props.sliderEntry.fontSize, 10)
    return topLabelHeight
  }
  calcBottomLabelHeight = () => {
    if (this.props.sliderEntry.isValueHidden) return 0
    const bottomLabelHeight =
      this.bottomLabelRef.current !== null &&
      this.bottomLabelRef.current.clientHeight !== null
        ? this.bottomLabelRef.current.clientHeight
        : parseInt(this.props.sliderEntry.fontSize, 10)
    return bottomLabelHeight
  }
}

const styles = theme => ({
  root: {
    userSelect: 'none',
  },
  iconColor: {
    color: theme.palette.primary.contrastText,
    cursor: 'pointer',
  },
  sliderChannelWrapper: {
    position: 'relative',
    paddingBottom: 16,
  },
  label: {
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: 1,
  },
  bottomLabel: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: 1,
  },
})

export default withStyles(styles)(ChannelStrip)

const Label = React.forwardRef((props, ref) => (
  <div
    style={{
      fontWeight: props.fontWeight,
      fontSize: (parseInt(props.fontSize, 10) || 16) + 'px',
    }}
    ref={ref}
    className={props.labelStyle}
  >
    {props.children}
  </div>
))
