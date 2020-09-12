import React, { useRef, useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
//import { useDispatch } from '@reduxjs/toolkit'
import { Actions as MidiSliderActions } from '../../actions/slider-list.js'
import { debounce } from 'debounce'
import { PropTypes } from 'prop-types'

const { handleSliderChange } = MidiSliderActions

export default connect(mapStateToProps, null)(MidiSlider)

function MidiSlider(props) {
  const [isActivated, setIsActivated] = useState(false)
  const dispatch = useDispatch()
  let selfRef = useRef(null)
  let parentOffset = useRef(null)
  let onPointerMove = useRef(null)
  let isDragging = useRef(false)
  let send = useRef(null)

  useEffect(() => {
    send.current = debounce(sendOutFromChildren, 5)
    function sendOutFromChildren(y) {
      return dispatch(
        handleSliderChange({
          i: props.sliderEntry.i,
          val: parseInt(y, 10),
          lastFocusedPage: props.lastFocusedPage
        })
      )
    }
  }, [dispatch, props.lastFocusedPage, props.sliderEntry.i])

  const {
    isHorz,
    val,
    entry: {
      isDisabled,
      height,
      sliderThumbHeight,
      width,
      colors: { color, colorActive },
      maxVal: tmpMax,
      minVal: tmpMin
    }
  } = props
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
  actions: PropTypes.object,
  entry: PropTypes.object,
  height: PropTypes.any,
  width: PropTypes.any,
  isDisabled: PropTypes.bool,
  isHorz: PropTypes.bool,
  lastFocusedPage: PropTypes.string,
  sliderEntry: PropTypes.object,
  sliderThumbHeight: PropTypes.any,
  val: PropTypes.any
}

function onGotCapture(isActivated, setIsActivated, event) {
  !isActivated && setIsActivated(true)
}
function onLostCapture(isActivated, setIsActivated, event) {
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

function getSliderEntr({
  isDisabled,
  height,
  sliderThumbHeight,
  width,
  sliderEntry: {
    colors: { color, colorActive },
    val,
    maxVal,
    minVal
  }
}) {
  return {
    isDisabled,
    colors: { color, colorActive },
    val,
    height: parseInt(height, 10),
    sliderThumbHeight: parseInt(sliderThumbHeight, 10),
    width: parseInt(width, 10),
    maxVal: parseInt(maxVal, 10),
    minVal: parseInt(minVal, 10)
  }
}

function noop() {}

function getLastFocus({ viewSettings }) {
  return viewSettings.lastFocusedPage
}

function mapStateToProps(state, props) {
  return {
    lastFocusedPage: getLastFocus(state),
    entry: getSliderEntr(props),
    val: getSliderEntr(props).val
  }
}
