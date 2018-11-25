import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../../actions/slider-list.js'
import MidiButton from './MidiButton'

import { STRIP_TYPE } from '../../../../../reducers/slider-list.js'

const {
  BUTTON,
  BUTTON_CC,
  BUTTON_TOGGLE,
  BUTTON_TOGGLE_CC
} = STRIP_TYPE

const noop = () => ({})

// This component is supposed to configure the button type for rendering
class MidiButtons extends React.PureComponent {
  render() {
    const {
      sliderEntry:
      {
        type,
        isNoteOn,
        label,
        colors,
        fontSize,
        fontWeight
      },
      idx,
      height,
      width,
      viewSettings: { isChangedTheme, isLayoutMode }
    } = this.props

    // button basic font colors
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
      height: ((height || 0) - 0),
      width: ((width || 0) - 0),
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

    if (type === BUTTON) {
      return (
        <MidiButton
          label={label}
          idx={idx}
          onChangeStart={!isLayoutMode ? this.props.actions.toggleNote : noop}
          onChangeEnd={!isLayoutMode ? this.props.actions.toggleNote : noop}
          fontColorStyle={fontColorStyle}
          buttonStyle={buttonStyle}
        />
      )
    } else if (type === BUTTON_TOGGLE) {
      return (
        <MidiButton
          label={label}
          idx={idx}
          onChangeStart={!isLayoutMode ? this.props.actions.toggleNote : noop}
          fontColorStyle={fontColorStyle}
          buttonStyle={buttonStyle}
        />

      )
    } else if (type === BUTTON_CC) {
      return (
        <MidiButton
          label={label}
          idx={idx}
          onChangeStart={!isLayoutMode ? this.handleButtonCcTriggerOn : noop}
          onChangeEnd={!isLayoutMode ? this.handleButtonCcTriggerOff : noop}
          fontColorStyle={fontColorStyle}
          buttonStyle={buttonStyle}
        />
      )
    } else if (type === BUTTON_TOGGLE_CC) {
      return (
        <MidiButton
          label={label}
          idx={idx}
          onChangeStart={!isLayoutMode ? this.handleButtonCcToggle : noop}
          fontColorStyle={fontColorStyle}
          buttonStyle={buttonStyle}
        />
      )
    } else {
      return (<div />)
    }
  }

  // Prevent double events, after touch,
  // from being triggered
  handleTouchButtonTrigger = (idx, e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.actions.toggleNote(idx)
  }

  handleButtonCcTriggerOn = (idx, e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.actions.handleSliderChange({ idx, val: this.props.sliderEntry.onVal })
  }

  handleButtonCcTriggerOff = (idx, e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.actions.handleSliderChange({ idx, val: this.props.sliderEntry.offVal })
  }

  handleButtonCcToggle = (idx, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!this.props.sliderEntry.isNoteOn) {
      this.props.actions.handleSliderChange({ idx, val: this.props.sliderEntry.onVal })
    } else {
      this.props.actions.handleSliderChange({ idx, val: this.props.sliderEntry.offVal })
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}
function mapStateToProps({ viewSettings }) {
  return {
    viewSettings
  }
}

export default ((connect(mapStateToProps, mapDispatchToProps)(MidiButtons)))
