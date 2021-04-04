import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'
import LockIcon from '@material-ui/icons/Lock'
import LockIconOpen from '@material-ui/icons/LockOpen'

import { useSelector } from 'react-redux'
import Slider from '../midi-elements/Slider'
import MidiButtons from '../midi-elements/midi-buttons/MidiButtons'
import StripLabel from '../midi-elements/StripLabel'
import { STRIP_TYPE } from '../../global-state/reducers/slider-list'
import { Label } from '../midi-elements/Label'

import { Actions as MidiSliderActions } from '../../global-state/actions/slider-list.js'
import RotaryKnob from '../midi-elements/RotaryKnob'

const { toggleIsStatic } = {
  ...MidiSliderActions
}

export default ChannelStrip

const sliderThumbHeight = 30

ChannelStrip.propTypes = {
  idx: PropTypes.number,
  isDisabled: PropTypes.bool,
  isLiveMode: PropTypes.bool,
  isMidiLearnMode: PropTypes.bool
}

function ChannelStrip(props) {
  const dispatch = useDispatch()
  const theme = useTheme()
  const classes = makeStyles(styles.bind(this, theme))()
  const { idx, isDisabled } = props
  const { isMidiLearnMode, isSettingsMode, isLayoutMode } = useSelector(
    (state) => state.viewSettings || {}
  )
  const {
    type,
    isValueHidden,
    fontSize,
    backgroundImage,
    static: isStatic,
    i
  } = useSelector((state) => state.sliders.sliderList[idx] || {})
  //const { type, isValueHidden, fontSize } = sliderEntry
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      const {
        height: tmpHeight,
        width: tmpWidth
      } = node.getBoundingClientRect()
      if (tmpHeight !== height) {
        setHeight(tmpHeight)
      }
      if (tmpWidth !== width) {
        setWidth(tmpWidth)
      }
    }
  })

  const tmpH = height //(size && size.height) || 0
  const tmpW = width //(size && size.width) || 0

  const isButton = ![
    STRIP_TYPE.SLIDER,
    STRIP_TYPE.SLIDER_HORZ,
    STRIP_TYPE.LABEL,
    STRIP_TYPE.ROTARY_KNOB
  ].includes(type)


  return (
    <div className={classes.root} ref={measuredRef}>
      {backgroundImage && (
        <img
          style={{
            height,
            width,
            position: 'absolute',
            left: 0,
            borderRadius: '5px'
          }}
          src={backgroundImage}
        ></img>
      )}
      {(isSettingsMode || isLayoutMode) &&
        (isStatic ? (
          <span
            className='settings'
            style={{
              position: 'absolute',
              left: 0,
              bottom: type.includes('SLIDER') ? 8 : -8,
              cursor: 'pointer',
              color: 'dimgrey',
              zIndex: 9
            }}
            onClick={() => dispatch(toggleIsStatic({ i, isStatic }))}
          >
            <LockIcon style={{ width: 16 }}></LockIcon>
          </span>
        ) : (
          <span
            className='settings'
            style={{
              position: 'absolute',
              left: 0,
              bottom: type.includes('SLIDER') ? (isValueHidden ? 8 : 16) : -8,
              cursor: 'pointer',
              color: 'dimgrey',
              zIndex: 9
            }}
            onClick={() => dispatch(toggleIsStatic({ i, isStatic }))}
          >
            <LockIconOpen style={{ width: 16 }}></LockIconOpen>
          </span>
        ))}
      {type === STRIP_TYPE.SLIDER && !isMidiLearnMode && (
        <div className={classes.sliderChannelWrapper}>
          <Label
            idx={idx}
            labelStyle={classes.label}
            isLabelShown={true}
          ></Label>
          <Slider
            idx={idx}
            isHorz={false}
            className={classes.sliderWrapper}
            isDisabled={isDisabled}
            height={calcLengthIfHidden(tmpH, { isValueHidden, fontSize })}
            width={tmpW}
            sliderThumbHeight={sliderThumbHeight}
          />
          <Label
            idx={idx}
            labelStyle={classes.label}
            isLabelShown={false}
          ></Label>
        </div>
      )}
      {type === STRIP_TYPE.SLIDER_HORZ && (
        <div className={classes.sliderChannelWrapper}>
          <Label
            idx={idx}
            labelStyle={classes.label}
            isLabelShown={true}
          ></Label>
          <Slider
            idx={idx}
            isHorz={true}
            className={classes.sliderWrapper}
            isDisabled={isDisabled}
            height={calcLengthIfHidden(tmpH, { isValueHidden, fontSize })}
            width={calcLengthIfHidden(tmpW + 16 + sliderThumbHeight, {
              isValueHidden,
              fontSize
            })}
            sliderThumbHeight={sliderThumbHeight}
          />
          <Label
            idx={idx}
            labelStyle={classes.bottomLabel}
            isLabelShown={false}
          ></Label>
        </div>
      )}
      {type === STRIP_TYPE.ROTARY_KNOB && (
        <div className={classes.sliderChannelWrapper}>
          <Label
            idx={idx}
            labelStyle={classes.label}
            isLabelShown={true}
          ></Label>
          <RotaryKnob
            //isDisabled={isDisabled}
            idx={idx}
            height={calcLengthIfHidden(tmpH, { isValueHidden, fontSize })}
            width={calcLengthIfHidden(tmpW + 64, {
              isValueHidden,
              fontSize
            })}
            showValueLabel={false}
          ></RotaryKnob>
          <Label
            idx={idx}
            //labelStyle={classes.bottomLabel}
            isLabelShown={false}
          ></Label>
        </div>
      )}

      {isButton && (
        <MidiButtons
          isDisabled={isDisabled}
          idx={idx}
          height={tmpH}
          width={tmpW}
        />
      )}

      {type === STRIP_TYPE.LABEL && (
        <StripLabel
          isDisabled={isDisabled}
          idx={idx}
          height={tmpH}
          width={tmpW}
        />
      )}
    </div>
  )
}

function calcLengthIfHidden(tmpH, { isValueHidden, fontSize }) {
  //const { isValueHidden, fontSize } = sliderEntry || {}
  const fact = isValueHidden ? 1 : 2
  const marge = isValueHidden ? 8 : 16
  return tmpH - parseInt(fact * fontSize, 10) - sliderThumbHeight - marge
}

function styles(theme) {
  return {
    root: {
      userSelect: 'none',
      height: '100%'
    },
    // iconColor: {
    //   color: theme.palette.primary.contrastText,
    //   cursor: 'pointer'
    // },
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
