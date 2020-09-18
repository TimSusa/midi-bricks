import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Actions as MidiSliderActions } from '../../../global-state/actions/slider-list.js'
import MidiButton from './MidiButton'

import { STRIP_TYPE } from '../../../global-state/reducers/slider-list.js'
import { PropTypes } from 'prop-types'

const {
  BUTTON,
  BUTTON_CC,
  BUTTON_TOGGLE,
  BUTTON_TOGGLE_CC,
  BUTTON_PROGRAM_CHANGE
} = STRIP_TYPE

const noop = () => ''

const { toggleNote, handleSliderChange, sendProgramChange } = {
  ...MidiSliderActions
}
// This component is supposed to configure the button type for rendering
function MidiButtons(props) {
  const dispatch = useDispatch()
  const { idx, height, width, isDisabled } = props
  const { isChangedTheme, isLayoutMode, lastFocusedPage } = useSelector(
    (state) => state.viewSettings
  )
  const {
    i,
    onVal,
    offVal,
    type,
    isNoteOn,
    label,
    colors,
    fontSize,
    fontWeight
  } = useSelector((state) => state.sliders.sliderList[idx] || {})

  const { fontColorStyle, buttonStyle } = getStyles(
    isChangedTheme,
    colors,
    height,
    width,
    isNoteOn,
    fontSize,
    fontWeight
  )
  const { onChangeStart, onChangeEnd } = getCb()
  return (
    <MidiButton
      label={label}
      onChangeStart={onChangeStart}
      onChangeEnd={onChangeEnd}
      fontColorStyle={fontColorStyle}
      buttonStyle={buttonStyle}
      isDisabled={isDisabled}
    />
  )

  function getCb() {
    if (type === BUTTON) {
      return {
        onChangeStart: !isLayoutMode ? handleButtonToggle : noop,
        onChangeEnd: !isLayoutMode ? handleButtonToggle : noop
      }
    } else if (type === BUTTON_TOGGLE) {
      return {
        onChangeStart: !isLayoutMode ? handleButtonToggle : noop,
        onChangeEnd: noop
      }
    } else if (type === BUTTON_CC) {
      return {
        onChangeStart: !isLayoutMode ? handleButtonCcTriggerOn : noop,
        onChangeEnd: !isLayoutMode ? handleButtonCcTriggerOff : noop
      }
    } else if (type === BUTTON_TOGGLE_CC) {
      return {
        onChangeStart: !isLayoutMode ? handleButtonCcToggle : noop,
        onChangeEnd: noop
      }
    } else if (type === BUTTON_PROGRAM_CHANGE) {
      return {
        onChangeStart: !isLayoutMode ? handleButtonProgramChange : noop,
        onChangeEnd: noop
      }
    } else {
      return {
        onChangeStart: noop,
        onChangeEnd: noop
      }
    }
  }

  function handleButtonToggle() {
    dispatch(toggleNote({ i, lastFocusedPage }))
  }

  function handleButtonCcTriggerOn(e) {
    e.preventDefault()
    e.stopPropagation()
    dispatch(
      handleSliderChange({
        i,
        lastFocusedPage,
        val: onVal
      })
    )
  }

  function handleButtonCcTriggerOff(e) {
    e.preventDefault()
    e.stopPropagation()
    dispatch(
      handleSliderChange({
        i,
        lastFocusedPage,
        val: offVal
      })
    )
  }

  function handleButtonCcToggle(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!isNoteOn) {
      dispatch(
        handleSliderChange({
          i,
          lastFocusedPage,
          val: onVal
        })
      )
    } else {
      dispatch(
        handleSliderChange({
          i,
          lastFocusedPage,
          val: offVal
        })
      )
    }
  }

  function handleButtonProgramChange(e) {
    e.preventDefault()
    e.stopPropagation()
    dispatch(sendProgramChange({ i, lastFocusedPage }))
  }
}

MidiButtons.propTypes = {
  actions: PropTypes.object,
  height: PropTypes.any,
  idx: PropTypes.any,
  isChangedTheme: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isLayoutMode: PropTypes.bool,
  lastFocusedPage: PropTypes.string,
  sliderEntry: PropTypes.object,
  width: PropTypes.any
}

function getStyles(
  isChangedTheme,
  colors,
  height,
  width,
  isNoteOn,
  fontSize,
  fontWeight
) {
  const basicFont = isChangedTheme ? 'black' : '#616161' // bad hack go away
  const bbCol = colors && colors.colorFont && colors.colorFont
  const colorFont = bbCol || basicFont
  // button background
  const basicBackground = isChangedTheme ? '#18A49D' : 'white' // bad hack go away
  const sbCol = colors && colors.color && colors.color
  const color = sbCol || basicBackground
  // button activ background
  const sColAct = colors && colors.colorActive && colors.colorActive
  const colorActivated = sColAct || '#FFFF00'
  const buttonStyle = {
    height: (height || 0) - 0,
    width: (width || 0) - 0,
    background: isNoteOn ? colorActivated : color
  }
  // button active font colors
  const bColAct = colors && colors.colorFontActive && colors.colorFontActive
  const colorFontActive = bColAct || '#BEBEBE'
  // button font size
  const tmpFontSize = (fontSize || 16) + 'px'
  const tmpFontWeight = fontWeight || 500
  const fontColorStyle = {
    color: !isNoteOn ? colorFont : colorFontActive,
    fontSize: tmpFontSize,
    fontWeight: tmpFontWeight
  }
  return { fontColorStyle, buttonStyle }
}

export default MidiButtons
