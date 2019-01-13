import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MidiSlider from './midi-elements/MidiSlider'
import MidiButtons from './midi-elements/midi-buttons/MidiButtons'
import StripLabel from './midi-elements/StripLabel'
import { STRIP_TYPE } from '../../../reducers/slider-list'
import MidiPage from './midi-elements/MidiPage'
import MidiSliderHorz from './midi-elements/MidiSliderHorz'
import XyPad from '../../XyPad'

// const topLabelRef = React.createRef()
// const bottomLabelRef = null//React.createRef()
const sliderThumbHeight = 30

const ChannelStrip = props => {
  const {
    sliderEntry,
    sliderEntry: {
      type,
      label,
      val,
      fontSize,
      fontWeight,
      colors: { colorFont },
      isValueHidden,
    },
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
        <div className={classes.sliderChannelWrapper}>
          <Label
            fontSize={fontSize}
            fontWeight={fontWeight}
            labelStyle={props.classes.label}
            colorFont={colorFont}
            {...props}
            //ref={topLabelRef}
          >
            {label}
          </Label>

          <MidiSlider
            className={classes.sliderWrapper}
            isDisabled={isDisabled}
            sliderEntry={sliderEntry}
            idx={idx}
            height={calcHeight(tmpH, props)}
            width={tmpW}
            sliderThumbHeight={sliderThumbHeight}
          />
          {!isValueHidden ? (
            <Label
              fontSize={fontSize}
              fontWeight={fontWeight}
              labelStyle={props.classes.bottomLabel}
              colorFont={colorFont}
              {...props}
              //ref={bottomLabelRef}
            >
              {val}
            </Label>
          ) : null}
        </div>
      )}
      {type === STRIP_TYPE.SLIDER_HORZ && (
        <div className={classes.sliderChannelWrapper}>
          <Label
            fontSize={fontSize}
            fontWeight={fontWeight}
            labelStyle={props.classes.label}
            colorFont={colorFont}
            {...props}
            //ref={topLabelRef}
          >
            {label}
          </Label>
          <MidiSliderHorz
            className={classes.sliderWrapper}
            isDisabled={isDisabled}
            sliderEntry={sliderEntry}
            idx={idx}
            height={calcHeight(tmpH, props)}
            width={tmpW}
            sliderThumbHeight={sliderThumbHeight}
          />
          {!isValueHidden ? (
            <Label
              fontSize={fontSize}
              fontWeight={fontWeight}
              labelStyle={props.classes.bottomLabel}
              colorFont={colorFont}
              {...props}
              //ref={bottomLabelRef}
            >
              {val}
            </Label>
          ) : null}
        </div>
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

const calcHeight = (tmpH, props) => {
  const fact = props.sliderEntry.isValueHidden ? 1 : 2
  const marge = props.sliderEntry.isValueHidden ? 8 : 16
  return (
    tmpH -
    parseInt(fact * props.sliderEntry.fontSize, 10) -
    sliderThumbHeight -
    marge
  )
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
  },
  label: {
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    marginBottom: 8,
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

const Label = props => (
  <div
    style={{
      fontWeight: props.fontWeight,
      fontSize: (parseInt(props.fontSize, 10) || 16) + 'px',
      color: props.colorFont,
    }}
    className={props.labelStyle}
  >
    {props.children}
  </div>
)

// const Label = React.forwardRef((props, ref) => (
//   <div
//     style={{
//       fontWeight: props.fontWeight,
//       fontSize: (parseInt(props.fontSize, 10) || 16) + 'px',
//       color: props.colorFont,
//     }}
//     ref={ref}
//     className={props.labelStyle}
//   >
//     {props.children}
//   </div>
// ))
