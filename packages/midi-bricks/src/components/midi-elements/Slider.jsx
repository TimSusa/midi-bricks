import React, { useRef, useState, useEffect } from 'react'
import createSelector from 'selectorator'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../../actions/slider-list.js'
import { debounce } from 'debounce'
import { PropTypes } from 'prop-types'

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiSlider)

function MidiSlider(props) {
  const [isActivated, setIsActivated] = useState(false)
  let selfRef = useRef(null)
  let parentOffset = useRef(null)
  let onPointerMove = useRef(null)
  let isDragging = useRef(false)
  let send = useRef(null)

  useEffect(() => {
    send.current = debounce(sendOutFromChildren, 3)
  }, [])

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

function sendOutFromChildren(y, props) {
  postData(props.tunnelUrl, props.sliderEntry)

  return props.actions.handleSliderChange({
    i: props.sliderEntry.i,
    val: parseInt(y, 10),
    lastFocusedPage: props.lastFocusedPage,
  })
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

const getSliderEntr = ({
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
}) => ({
  isDisabled,
  colors: { color, colorActive },
  val,
  height: parseInt(height, 10),
  sliderThumbHeight: parseInt(sliderThumbHeight, 10),
  width: parseInt(width, 10),
  maxVal: parseInt(maxVal, 10),
  minVal: parseInt(minVal, 10)
})

function noop() {}

const getSliderEntry = createSelector(
  [getSliderEntr],
  ({
    isDisabled,
    height,
    sliderThumbHeight,
    width,
    colors: { color, colorActive },
    val,
    maxVal,
    minVal
  }) => ({
    isDisabled,
    height,
    sliderThumbHeight,
    width,
    colors: { color, colorActive },
    val,
    maxVal,
    minVal
  })
)

const getLastFocus = ({ viewSettings }) => viewSettings.lastFocusedPage
const getLastFocusedPage = createSelector(
  [getLastFocus],
  (lastFocusedPage) => lastFocusedPage
)
const getTunnelUrl = ({ viewSettings }) => viewSettings.electronAppSettings.tunnelUrl
const getTunnelUrlSelector = createSelector(
  [getTunnelUrl],
  (tunnelUrl) => tunnelUrl
)
const getMemVal = createSelector(
  [getSliderEntry],
  ({ val }) => val
)
const getEntry = createSelector(
  [getSliderEntry],
  ({
    isDisabled,
    height,
    sliderThumbHeight,
    width,
    colors: { color, colorActive },
    maxVal,
    minVal
  }) => ({
    isDisabled,
    height,
    sliderThumbHeight,
    width,
    colors: { color, colorActive },
    maxVal,
    minVal
  })
)
function mapStateToProps(state, props) {
  return {
    lastFocusedPage: getLastFocusedPage(state),
    tunnelUrl: getTunnelUrlSelector(state),
    entry: getEntry(props),
    val: getMemVal(props)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}


async function postData(url = '', data = {}) {
  if (!url) return
  if (!data) return
  try {
  // Default options are marked with *http://localhost:3000
    const response = await fetch(url+'/users', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'no-cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      // referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    const res =  await response.json() 
    console.log(res)
  } catch(error){
    throw new Error(error)
  }
// parses JSON response into native JavaScript objects
}