import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Actions as MidiSliderActions } from '../../global-state/actions/slider-list.js'
import { PropTypes } from 'prop-types'
const { handleSliderChange } = MidiSliderActions
export const Label = LabelComponent

export function LabelComponent(props) {
  const { idx, isLabelShown, labelStyle } = props
  const dispatch = useDispatch()
  const sliderEntry = useSelector(
    (state) => state.sliders.sliderList[idx] || {}
  )
  const lastFocusedPage = useSelector(
    (state) => state.viewSettings.lastFocusedPage || {}
  )
  const {
    i,
    label,
    val,
    fontSize,
    fontWeight,
    colors: { colorFont } = {},
    isValueHidden,
    lastSavedVal
  } = sliderEntry
  if (isValueHidden && isLabelShown === false) return <div></div>
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
      {isLabelShown ? label : `${val} / ${lastSavedVal}`}
    </div>
  )
}

LabelComponent.propTypes = {
  idx: PropTypes.number,
  isLabelShown: PropTypes.bool,
  labelStyle: PropTypes.any
}
