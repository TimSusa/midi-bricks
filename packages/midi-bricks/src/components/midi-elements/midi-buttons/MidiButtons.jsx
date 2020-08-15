import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../../../actions/slider-list.js'
import MidiButton from './MidiButton'

import { STRIP_TYPE } from '../../../reducers/slider-list.js'
import { PropTypes } from 'prop-types'

const {
  BUTTON,
  BUTTON_CC,
  BUTTON_TOGGLE,
  BUTTON_TOGGLE_CC,
  BUTTON_PROGRAM_CHANGE
} = STRIP_TYPE

const noop = () => ''

// This component is supposed to configure the button type for rendering
class MidiButtons extends React.Component {
  render() {
    const {
      sliderEntry: { type, isNoteOn, label, colors, fontSize, fontWeight },
      height,
      width,
      isChangedTheme,
      isLayoutMode,
      isDisabled
    } = this.props

    const { fontColorStyle, buttonStyle } = getStyles(
      isChangedTheme,
      colors,
      height,
      width,
      isNoteOn,
      fontSize,
      fontWeight
    )
    const { onChangeStart, onChangeEnd } = this.getCb(type, isLayoutMode)
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
  }

  getCb = (type, isLayoutMode) => {
    if (type === BUTTON) {
      return {
        onChangeStart: !isLayoutMode ? this.handleButtonToggle : noop,
        onChangeEnd: !isLayoutMode ? this.handleButtonToggle : noop
      }
    } else if (type === BUTTON_TOGGLE) {
      return {
        onChangeStart: !isLayoutMode ? this.handleButtonToggle : noop,
        onChangeEnd: noop
      }
    } else if (type === BUTTON_CC) {
      return {
        onChangeStart: !isLayoutMode ? this.handleButtonCcTriggerOn : noop,
        onChangeEnd: !isLayoutMode ? this.handleButtonCcTriggerOff : noop
      }
    } else if (type === BUTTON_TOGGLE_CC) {
      return {
        onChangeStart: !isLayoutMode ? this.handleButtonCcToggle : noop,
        onChangeEnd: noop
      }
    } else if (type === BUTTON_PROGRAM_CHANGE) {
      return {
        onChangeStart: !isLayoutMode ? this.handleButtonProgramChange : noop,
        onChangeEnd: noop
      }
    } else {
      return {
        onChangeStart: noop,
        onChangeEnd: noop
      }
    }
  }

  handleButtonToggle = () => {
    const {
      actions,
      sliderEntry: { i },
      lastFocusedPage
    } = this.props
    actions.toggleNote({ i, lastFocusedPage })
  }

  handleButtonCcTriggerOn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const {
      actions,
      sliderEntry: { i, onVal },
      lastFocusedPage
    } = this.props
    actions.handleSliderChange({
      i,
      lastFocusedPage,
      val: onVal
    })
  }

  handleButtonCcTriggerOff = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const {
      actions,
      sliderEntry: { i, offVal },
      lastFocusedPage
    } = this.props
    actions.handleSliderChange({
      i,
      lastFocusedPage,
      val: offVal
    })
  }

  handleButtonCcToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const {
      actions,
      sliderEntry: { i, isNoteOn, onVal, offVal },
      lastFocusedPage
    } = this.props
    if (!isNoteOn) {
      actions.handleSliderChange({
        i,
        lastFocusedPage,
        val: onVal
      })
    } else {
      actions.handleSliderChange({
        i,
        lastFocusedPage,
        val: offVal
      })
    }
  }

  handleButtonProgramChange = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const {
      actions,
      sliderEntry: { i },
      lastFocusedPage
    } = this.props
    actions.sendProgramChange({ i, lastFocusedPage })
  }
}

MidiButtons.propTypes = {
  actions: PropTypes.object,
  height: PropTypes.any,
  isChangedTheme: PropTypes.bool,
  isLayoutMode: PropTypes.bool,
  isDisabled: PropTypes.bool,
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

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}
function mapStateToProps({
  viewSettings: {
    isChangedTheme,
    isLayoutMode,
    isSettingsMode,
    lastFocusedPage
  }
}) {
  return {
    isChangedTheme,
    isLayoutMode,
    isSettingsMode,
    lastFocusedPage
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MidiButtons)
