import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSliderActions from '../../../../../actions/slider-list.js'
import { STRIP_TYPE } from '../../../../../reducers/slider-list.js'
import MidiButton from './MidiButton'

// This component is supposed to configure the right button type for rendering
class MidiButtons extends React.Component {
  isCcToggleOn = true
  render () {
    const { sliderEntry: { isNoteOn, label, colors, type }, idx, height, width, viewSettings } = this.props

    // button basic font colors
    const basicFont = viewSettings.isChangedTheme ? 'black' : '#616161' // bad hack go away
    const bbCol = colors && colors.colorFont && colors.colorFont
    const colorFont = bbCol || basicFont

    // button background
    const basicBackground = viewSettings.isChangedTheme ? '#18A49D' : 'white' // bad hack go away
    const sbCol = colors && colors.color && colors.color
    const color = sbCol || basicBackground

    // button activ background
    const sColAct = colors && colors.colorActive && colors.colorActive
    const colorActivated = sColAct || '#FFFF00'
    const buttonStyle = {
      height: ((height || 0) - 32),
      width: ((width || 0) - 32),
      background: isNoteOn ? colorActivated : color
    }

    // button active font colors
    const bColAct = colors && colors.colorFontActive && colors.colorFontActive
    const colorFontActive = bColAct || '#BEBEBE'

    const fontColorStyle = {
      color: !isNoteOn ? colorFont : colorFontActive,
      fontWeight: 600
    }

    if (type === STRIP_TYPE.BUTTON) {
      return (
        <MidiButton
          label={label}
          idx={idx}
          onChangeStart={this.props.actions.toggleNote}
          onChangeEnd={this.props.actions.toggleNote}
          fontColorStyle={fontColorStyle}
          buttonStyle={buttonStyle}
        />
      )
    } else if (type === STRIP_TYPE.BUTTON_TOGGLE) {
      return (
        <MidiButton
          label={label}
          idx={idx}
          onChangeStart={this.props.actions.toggleNote}
          fontColorStyle={fontColorStyle}
          buttonStyle={buttonStyle}
        />

      )
    } else if (type === STRIP_TYPE.BUTTON_CC) {
      return (
        <MidiButton
          label={label}
          idx={idx}
          onChangeStart={this.handleButtonCcTriggerOn}
          onChangeEnd={this.handleButtonCcTriggerOff}
          fontColorStyle={fontColorStyle}
          buttonStyle={buttonStyle}
        />
      )
    } else if (type === STRIP_TYPE.BUTTON_TOGGLE_CC) {
      return (
        <MidiButton
          label={label}
          idx={idx}
          onChangeStart={this.handleButtonCcToggle}
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
    this.props.actions.handleSliderChange({ idx, val: 127 })
  }

  handleButtonCcTriggerOff = (idx, e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.actions.handleSliderChange({ idx, val: 0 })
  }

  handleButtonCcToggle = (idx, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (this.isCcToggleOn) {
      this.props.actions.handleSliderChange({ idx, val: 127 })
    } else {
      this.props.actions.handleSliderChange({ idx, val: 0 })
    }
    this.isCcToggleOn = !this.isCcToggleOn
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}
function mapStateToProps ({ viewSettings }) {
  return {
    viewSettings
  }
}

export default ((connect(mapStateToProps, mapDispatchToProps)(MidiButtons)))
