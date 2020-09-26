import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Actions as MidiSliderActions } from '../../global-state/actions/slider-list.js'
import { debounce } from 'debounce'
import { PropTypes } from 'prop-types'

const { handleSliderChange } = MidiSliderActions

export default MidiSlider

function MidiSlider(props) {
  const [isActivated, setIsActivated] = useState(false)
  const dispatch = useDispatch()
  let selfRef = useRef(null)
  let parentOffset = useRef(null)
  let onPointerMove = useRef(null)
  let isDragging = useRef(false)
  let send = useRef(null)
  const { idx, isHorz, height, sliderThumbHeight, width, isDisabled } = props

  const { i, val, maxVal, minVal, colors } = useSelector(
    (state) => state.sliders.sliderList[idx] || {}
  )
  const { color, colorActive } = colors || {}
  const lastFocusedPage = useSelector(
    (state) => state.viewSettings.lastFocusedPage
  )
  useEffect(() => {
    send.current = debounce(sendOutFromChildren, 5)
    function sendOutFromChildren(y) {
      return dispatch(
        handleSliderChange({
          i,
          val: parseInt(y, 10),
          lastFocusedPage
        })
      )
    }
  }, [dispatch, i, lastFocusedPage])
  const length = isHorz ? width : height
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        return false
      }}
      ref={selfRef}
      onPointerDown={isDisabled ? noop : handlePointerStart}
      onPointerMove={isDisabled ? noop : onPointerMove.current}
      onPointerUp={isDisabled ? noop : handlePointerEnd}
      onPointerCancel={isDisabled ? noop : handlePointerEnd}
      onGotPointerCapture={
        isDisabled ? noop : onGotCapture.bind(this, isActivated, setIsActivated)
      }
      onLostPointerCapture={
        isDisabled
          ? noop
          : onLostCapture.bind(this, isActivated, setIsActivated)
      }
      style={{
        height: height + sliderThumbHeight,
        width: isHorz ? width + sliderThumbHeight : width,
        borderRadius: 3,
        background: color ? color : 'aliceblue',
        boxShadow: isActivated && '0 0 3px 3px rgb(24, 164, 157)'
      }}
    >
      <div style={getSliderThumbStyle(valToPixel(length, val))} />
    </div>
  )

  function handlePointerStart(e) {
    selfRef.current.focus()
    setIsActivated(true)
    onPointerMove.current = onPointerMove && handlePointerMove
    isDragging.current = true
    selfRef.current.setPointerCapture(e.pointerId)

    // Should be set before calling heightToVal()
    const { left, top } = selfRef.current.getBoundingClientRect()
    parentOffset.current = isHorz ? left : top

    const valttt = pixelToVal(isHorz ? e.clientX : e.clientY)
    send.current(valttt, props)
  }

  function handlePointerMove(e) {
    if (!isDragging.current) {
      return
    }
    const valt = pixelToVal(isHorz ? e.clientX : e.clientY)
    send.current(valt, props)
  }

  function handlePointerEnd(e) {
    onPointerMove = null
    selfRef.current.releasePointerCapture(e.pointerId)

    const valtt = pixelToVal(isHorz ? e.clientX : e.clientY)
    send.current(valtt, props)
    isDragging.current = false
    setIsActivated(false)
    send = null
  }
  function getSliderThumbStyle(thumbLocation) {
    return {
      position: 'relative',
      cursor: 'pointer',
      height: isHorz ? '100%' : sliderThumbHeight,
      width: !isHorz ? '100%' : sliderThumbHeight,
      borderRadius: 3,
      background: colorActive ? colorActive : 'goldenrod',
      top: isHorz ? 0 : thumbLocation,
      left: !isHorz ? 0 : thumbLocation,
      boxShadow: isActivated && '0 0 3px 3px rgb(24, 164, 157)'
    }
  }

  function valToPixel(heightOrWidth, valv) {
    if (isHorz) {
      const y = heightOrWidth * ((valv - minVal) / (maxVal - minVal))
      return y
    } else {
      const y = heightOrWidth * (1 - (valv - minVal) / (maxVal - minVal))
      return y
    }
  }
  function pixelToVal(actualOffset) {
    const tmpPixel = actualOffset - parentOffset.current - sliderThumbHeight / 2
    const tmpPixelGreaterZero = tmpPixel < 0 ? 0 : tmpPixel
    const pixel = tmpPixelGreaterZero >= length ? length : tmpPixelGreaterZero
    let oneToZeroScaledPixel = 0
    const minMaxDiff = maxVal - minVal
    if (isHorz) {
      oneToZeroScaledPixel = pixel / length + minVal / minMaxDiff
    } else {
      oneToZeroScaledPixel = 1 - pixel / length + minVal / minMaxDiff
    }
    const valtttt = oneToZeroScaledPixel * minMaxDiff
    return valtttt >= maxVal ? maxVal : valtttt < minVal ? minVal : valtttt
  }
  function onGotCapture(isActivated, setIsActivated) {
    !isActivated && setIsActivated(true)
  }
  function onLostCapture(isActivated, setIsActivated) {
    isActivated && setIsActivated(false)
  }
}

MidiSlider.propTypes = {
  height: PropTypes.any,
  idx: PropTypes.any,
  isDisabled: PropTypes.any,
  isHorz: PropTypes.any,
  sliderThumbHeight: PropTypes.number,
  width: PropTypes.any
}

function noop() {}
