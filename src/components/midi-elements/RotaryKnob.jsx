import PropTypes from 'prop-types'
import React from 'react'
import Rotary from 'react-canvas-rotary-knob/lib/RotaryKnob.js'
import { useDispatch, useSelector } from 'react-redux'
import { Actions as MidiSliderActions } from '../../global-state/actions/slider-list.js'

const { handleSliderChange } = MidiSliderActions

export default RotaryKnob

function RotaryKnob(props) {
  const dispatch = useDispatch()
  const { idx, height, width, showValueLabel } = props
  const {
    i,
    val,
    maxVal,
    minVal,
    colors,
    fontWeight
  } = useSelector(
    (state) => state.sliders.sliderList[idx] || {}
  )
  const { color, colorActive, colorFontActive } = colors || {}
  const { lastFocusedPage, isLayoutMode, isSettingsMode } = useSelector(
    (state) => state.viewSettings
  )

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        return false
      }}
    >
      <Rotary
        width={width}
        height={height}
        isDisabled={isLayoutMode || isSettingsMode}
        showValueLabel={showValueLabel}
        cbValChanged={(isLayoutMode || isSettingsMode) ? () => { } : handleChange}
        max={maxVal}
        min={minVal}
        backgroundColor={color}
        color={colorActive}
        caretColor={colorFontActive}
        value={val}
        lineWidth={fontWeight * 0.01}
        caretWidth={fontWeight * 0.1}
      >
      </Rotary>
    </div>
  )
  function handleChange(val) {
    return dispatch(
      handleSliderChange({
        i,
        val,
        lastFocusedPage
      })
    )
  }
}
RotaryKnob.propTypes = {
  height: PropTypes.number,
  idx: PropTypes.number,
  isDisabled: PropTypes.bool,
  showValueLabel: PropTypes.bool,
  isHorz: PropTypes.bool,
  sliderThumbHeight: PropTypes.number,
  width: PropTypes.number
}