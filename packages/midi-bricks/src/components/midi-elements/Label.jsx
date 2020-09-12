import React from 'react'
import { useDispatch } from 'react-redux'
import { Actions as MidiSliderActions } from '../../actions/slider-list.js'
import { PropTypes } from 'prop-types'
const { handleSliderChange } = MidiSliderActions
export const Label = LabelComponent

export function LabelComponent(props) {
  const dispatch = useDispatch()
  const {
    i,
    lastSavedVal,
    lastFocusedPage,
    fontSize,
    fontWeight,
    colorFont,
    labelStyle,
    label
  } = props
  return (
    <div
      onClick={() =>
        dispatch(
          handleSliderChange({
            i: i,
            val: lastSavedVal || 0,
            lastFocusedPage
          })
        )
      }
      style={{
        fontWeight,
        fontSize: (parseInt(fontSize, 10) || 16) + 'px',
        color: colorFont
      }}
      className={labelStyle}
    >
      {label}
    </div>
  )
}

LabelComponent.propTypes = {
  colorFont: PropTypes.any,
  fontSize: PropTypes.any,
  fontWeight: PropTypes.any,
  handleSliderChange: PropTypes.func,
  i: PropTypes.any,
  label: PropTypes.any,
  labelStyle: PropTypes.any,
  lastFocusedPage: PropTypes.any,
  lastSavedVal: PropTypes.number
}
