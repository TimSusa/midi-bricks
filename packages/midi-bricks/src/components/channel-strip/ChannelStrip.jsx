import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import MidiSlider from '../midi-elements/MidiSlider'
import MidiButtons from '../midi-elements/midi-buttons/MidiButtons'
import StripLabel from '../midi-elements/StripLabel'
import { STRIP_TYPE } from '../../reducers/slider-list'
import MidiPage from '../midi-elements/MidiPage'
import MidiSliderHorz from '../midi-elements/MidiSliderHorz'
import XyPad from '../XyPad'
import { Label } from '../midi-elements/Label'
export default ChannelStrip

const sliderThumbHeight = 30


ChannelStrip.propTypes = {
  classes: PropTypes.object,
  idx: PropTypes.number,
  isDisabled: PropTypes.bool,
  isMidiLearnMode: PropTypes.any,
  size: PropTypes.object,
  sliderEntry: PropTypes.object
}

function ChannelStrip(props) {
  const classes = makeStyles(styles, { withTheme: true })()
  const { sliderEntry, idx, size, isDisabled, isMidiLearnMode } = props
  const {
    type,
    label,
    val,
    fontSize,
    fontWeight,
    colors: { colorFont },
    isValueHidden,
    lastSavedVal
  } = sliderEntry
  const tmpH = (size && size.height) || 0
  const tmpW = (size && size.width) || 0
  const isButton = type !== STRIP_TYPE.SLIDER && type !== STRIP_TYPE.LABEL
  return (
    <div className={classes.root}>
      {type === STRIP_TYPE.SLIDER && !isMidiLearnMode && (
        <div className={classes.sliderChannelWrapper}>
          <Label
            fontSize={fontSize}
            fontWeight={fontWeight}
            labelStyle={classes.label}
            colorFont={colorFont}
            {...props}
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
          {!isValueHidden && (
            <Label
              lastSavedVal={lastSavedVal}
              idx={idx}
              fontSize={fontSize}
              fontWeight={fontWeight}
              labelStyle={classes.bottomLabel}
              colorFont={colorFont}
              {...props}
            >
              {val}
              {` / ${lastSavedVal}`}
            </Label>
          )}
        </div>
      )}
      {type === STRIP_TYPE.SLIDER_HORZ && (
        <div className={classes.sliderChannelWrapper}>
          <Label
            fontSize={fontSize}
            fontWeight={fontWeight}
            labelStyle={classes.label}
            colorFont={colorFont}
            {...props}
          >
            {label}
          </Label>
          <MidiSliderHorz
            className={classes.sliderWrapper}
            isDisabled={isDisabled}
            sliderEntry={sliderEntry}
            idx={idx}
            height={calcHeight(tmpH, props)}
            width={tmpW - sliderThumbHeight}
            sliderThumbHeight={sliderThumbHeight}
          />
          {!isValueHidden ? (
            <Label
              lastSavedVal={lastSavedVal}
              idx={idx}
              fontSize={fontSize}
              fontWeight={fontWeight}
              labelStyle={classes.bottomLabel}
              colorFont={colorFont}
              {...props}
            >
              {val}
              {` / ${lastSavedVal}`}
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

function calcHeight(tmpH, props) {
  const fact = props.sliderEntry.isValueHidden ? 1 : 2
  const marge = props.sliderEntry.isValueHidden ? 8 : 16
  return (
    tmpH -
    parseInt(fact * props.sliderEntry.fontSize, 10) -
    sliderThumbHeight -
    marge
  )
}

function styles(theme) {
  return {
    root: {
      userSelect: 'none'
    },
    iconColor: {
      color: theme.palette.primary.contrastText,
      cursor: 'pointer'
    },
    sliderChannelWrapper: {
      position: 'relative'
    },
    label: {
      color: theme.palette.primary.contrastText,
      textAlign: 'center',
      fontWeight: 400,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      marginBottom: 8
    },
    bottomLabel: {
      position: 'fixed',
      bottom: 0,
      width: '100%',
      color: theme.palette.primary.contrastText,
      textAlign: 'center',
      fontWeight: 400,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      lineHeight: 1
    }
  }
}