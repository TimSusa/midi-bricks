import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'
import { useSelector } from 'react-redux'
import Slider from '../midi-elements/Slider'
import MidiButtons from '../midi-elements/midi-buttons/MidiButtons'
import StripLabel from '../midi-elements/StripLabel'
import { STRIP_TYPE } from '../../reducers/slider-list'
import XyPad from '../XyPad'
import { Label } from '../midi-elements/Label'
export default ChannelStrip

const sliderThumbHeight = 30

ChannelStrip.propTypes = {
  idx: PropTypes.number,
  classes: PropTypes.object,
  isDisabled: PropTypes.bool,
  isMidiLearnMode: PropTypes.any,
  size: PropTypes.object
}

function ChannelStrip(props) {
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()
  const { idx, size, isDisabled, isMidiLearnMode } = props
  const sliderEntry = useSelector(
    (state) => state.sliders.sliderList[idx] || {}
  )
  const {
    i,
    type,
    label,
    val,
    fontSize,
    fontWeight,
    colors: { colorFont } = {},
    isValueHidden,
    lastSavedVal
  } = sliderEntry

  const tmpH = (size && size.height) || 0
  const tmpW = (size && size.width) || 0
  const isButton = ![
    STRIP_TYPE.SLIDER,
    STRIP_TYPE.SLIDER_HORZ,
    STRIP_TYPE.LABEL
  ].includes(type)
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
          <Slider
            isHorz={false}
            className={classes.sliderWrapper}
            isDisabled={isDisabled}
            sliderEntry={sliderEntry}
            height={calcLengthIfHidden(tmpH, sliderEntry)}
            width={tmpW}
            sliderThumbHeight={sliderThumbHeight}
          />
          {!isValueHidden && (
            <Label
              lastSavedVal={lastSavedVal}
              i={i}
              fontSize={fontSize}
              fontWeight={fontWeight}
              labelStyle={classes.bottomLabel}
              colorFont={colorFont}
              {...props}
            >
              {val || 0}
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
          <Slider
            isHorz={true}
            className={classes.sliderWrapper}
            isDisabled={isDisabled}
            sliderEntry={sliderEntry}
            i={i}
            height={calcLengthIfHidden(tmpH, sliderEntry)}
            width={calcLengthIfHidden(
              tmpW + 16 + sliderThumbHeight,
              sliderEntry
            )}
            sliderThumbHeight={sliderThumbHeight}
          />
          {!isValueHidden ? (
            <Label
              lastSavedVal={lastSavedVal}
              i={i}
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
          isDisabled={isDisabled}
          sliderEntry={sliderEntry}
          height={tmpH}
          width={tmpW}
        />
      )}
      {type === STRIP_TYPE.LABEL && (
        <StripLabel
          isDisabled={isDisabled}
          sliderEntry={sliderEntry}
          height={tmpH}
          width={tmpW}
        />
      )}
      {type === STRIP_TYPE.XYPAD && (
        <XyPad
          isDisabled={isDisabled}
          classes={classes}
          sliderEntry={sliderEntry}
          height={tmpH}
          width={tmpW}
        />
      )}
    </div>
  )
}

function calcLengthIfHidden(tmpH, sliderEntry) {
  const { isValueHidden, fontSize } = sliderEntry || {}
  const fact = isValueHidden ? 1 : 2
  const marge = isValueHidden ? 8 : 16
  return tmpH - parseInt(fact * fontSize, 10) - sliderThumbHeight - marge
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
