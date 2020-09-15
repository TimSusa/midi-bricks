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

  const { i, val, maxVal: tmpMax, minVal: tmpMin, colors } = useSelector(
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

  const maxVal = isHorz ? tmpMin : tmpMax
  const minVal = isHorz ? tmpMax : tmpMin
  const hOrW = isHorz ? width : height
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        return false
      }}
      ref={selfRef}
      onPointerDown={
        isDisabled
          ? noop
          : handlePointerStart.bind(
              this,
              selfRef,
              isHorz,
              setIsActivated,
              onPointerMove,
              isDragging,
              parentOffset,
              handlePointerMove,
              send,
              sliderThumbHeight,
              hOrW,
              maxVal,
              minVal,
              props
            )
      }
      onPointerMove={isDisabled ? noop : onPointerMove.current}
      onPointerUp={
        isDisabled
          ? noop
          : handlePointerEnd.bind(
              this,
              onPointerMove,
              selfRef,
              isHorz,
              hOrW,
              maxVal,
              minVal,
              parentOffset,
              sliderThumbHeight,
              send,
              props,
              setIsActivated,
              isDragging
            )
      }
      onPointerCancel={
        isDisabled
          ? noop
          : handlePointerEnd.bind(
              this,
              onPointerMove,
              selfRef,
              isHorz,
              hOrW,
              maxVal,
              minVal,
              parentOffset,
              sliderThumbHeight,
              send,
              props,
              setIsActivated,
              isDragging
            )
      }
      onGotPointerCapture={
        isDisabled ? noop : onGotCapture.bind(this, isActivated, setIsActivated)
      }
      onLostPointerCapture={
        isDisabled
          ? noop
          : onLostCapture.bind(this, isActivated, setIsActivated)
      }
      style={{
        height: !isHorz ? height + sliderThumbHeight : height,
        width: isHorz ? width + sliderThumbHeight : width,
        borderRadius: 3,
        background: color ? color : 'aliceblue',
        boxShadow: isActivated && '0 0 3px 3px rgb(24, 164, 157)'
      }}
    >
      <div
        style={getSliderThumbStyle(
          valToPixel(hOrW, val, maxVal, minVal),
          isHorz,
          sliderThumbHeight,
          colorActive,
          isActivated
        )}
      />
    </div>
  )

  function handlePointerStart(
    selfRef,
    isHorz,
    setIsActivated,
    onPointerMove,
    isDragging,
    parentOffset,
    handlePointerMove,
    send,
    sliderThumbHeight,
    hOrW,
    maxVal,
    minVal,
    props,
    e
  ) {
    selfRef.current.focus()
    setIsActivated(true)
    onPointerMove.current =
      onPointerMove &&
      handlePointerMove.bind(
        this,
        isDragging,
        isHorz,
        hOrW,
        maxVal,
        minVal,
        parentOffset,
        sliderThumbHeight,
        send,
        props
      )
    isDragging.current = true
    selfRef.current.setPointerCapture(e.pointerId)

    // Should be set before calling heightToVal()
    const { left, top } = selfRef.current.getBoundingClientRect()
    parentOffset.current = isHorz ? left : top

    const val = pixelToVal(
      isHorz ? e.clientX : e.clientY,
      hOrW,
      maxVal,
      minVal,
      parentOffset,
      sliderThumbHeight
    )
    send.current(val, props)
  }

  function handlePointerMove(
    isDragging,
    isHorz,
    length,
    maxVal,
    minVal,
    parentOffset,
    sliderThumbHeight,
    send,
    props,
    e
  ) {
    if (!isDragging.current) {
      return
    }
    const val = pixelToVal(
      isHorz ? e.clientX : e.clientY,
      length,
      maxVal,
      minVal,
      parentOffset,
      sliderThumbHeight
    )
    send.current(val, props)
  }

  function handlePointerEnd(
    onPointerMove,
    selfRef,
    isHorz,
    length,
    maxVal,
    minVal,
    parentOffset,
    sliderThumbHeight,
    send,
    props,
    setIsActivated,
    isDragging,
    e
  ) {
    onPointerMove = null
    selfRef.current.releasePointerCapture(e.pointerId)

    const val = pixelToVal(
      isHorz ? e.clientX : e.clientY,
      length,
      maxVal,
      minVal,
      parentOffset,
      sliderThumbHeight
    )
    send.current(val, props)
    isDragging.current = false
    setIsActivated(false)
    send = null
  }
}

MidiSlider.propTypes = {
  height: PropTypes.any,
  i: PropTypes.any,
  idx: PropTypes.any,
  isDisabled: PropTypes.any,
  isHorz: PropTypes.any,
  sliderThumbHeight: PropTypes.any,
  width: PropTypes.any
}

function onGotCapture(isActivated, setIsActivated) {
  !isActivated && setIsActivated(true)
}
function onLostCapture(isActivated, setIsActivated) {
  isActivated && setIsActivated(false)
}
function valToPixel(heightOrWidth, val, maxVal, minVal) {
  const y = heightOrWidth * (1 - (val - minVal) / (maxVal - minVal))
  return y
}
function pixelToVal(
  actualOffset,
  length,
  maxVal,
  minVal,
  parentOffset,
  sliderThumbHeight
) {
  const tmpPixel = actualOffset - parentOffset.current - sliderThumbHeight / 2
  const tmpPixelGreaterZero = tmpPixel < 0 ? 0 : tmpPixel
  const pixel = tmpPixelGreaterZero >= length ? length : tmpPixelGreaterZero
  const oneToZeroScaledPixel = 1 - pixel / length
  const val = minVal + oneToZeroScaledPixel * (maxVal - minVal)
  return val
}

function getSliderThumbStyle(
  thumbLocation,
  isHorz,
  sliderThumbHeight,
  colorActive,
  isActivated
) {
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

function noop() {}
