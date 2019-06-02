import React, { useRef, useState } from 'react'
import createSelector from 'selectorator'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../../actions/slider-list.js'
import debounce from 'debounce'
import { PropTypes } from 'prop-types'

const noop = () => {}

// let previousLeft = 0
// let previousTop = 0

function MidiSlider(props) {
  const [isActivated, setIsActivated] = useState(false)
  let selfRef = useRef(null) // React.createRef()
  let parentRectY = useRef(0)
  let onPointerMove = useRef(null)
  let isDragging = useRef(false)

  const {
    val,
    entry: {
      isDisabled,
      height,
      sliderThumbHeight,
      width,
      colors: { color },
      maxVal,
      minVal
    }
  } = props

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
      onGotPointerCapture={isDisabled ? noop : onGotCapture}
      onLostPointerCapture={isDisabled ? noop : onLostCapture}
      style={{
        height: height + sliderThumbHeight,
        width,
        borderRadius: 3,
        background: color ? color : 'aliceblue',
        boxShadow: isActivated && '0 0 3px 3px rgb(24, 164, 157)'
        //opacity: 0.7,
      }}
    >
      <div
        style={getSliderThumbStyle(
          calcYFromVal({
            val,
            height,
            maxVal,
            minVal
          })
        )}
      />
    </div>
  )

  function extractPositionDelta(event) {
    // console.log('extractPositionDelta')
    // const left = event.pageX
    // const top = event.pageY
    // const delta = {
    //   left: left - previousLeft,
    //   top: top - previousTop
    // }
    // previousLeft = left
    // previousTop = top
    parentRectY.current  = selfRef.current.getBoundingClientRect().y
    // return delta
  }

  function handlePointerStart(e) {
    selfRef.current.focus()
    onPointerMove.current = onPointerMove && handlePointerMove
    isDragging.current = true

    //animFrame = window.requestAnimationFrame(onPointerMove)
    //console.log('handlePointerStart :', parentRectY)

    selfRef.current.setPointerCapture(e.pointerId)

    const val = heightToVal(e)
    sendOutFromChildren(val, props)

    parentRectY.current  = selfRef.current.getBoundingClientRect().y

    //extractPositionDelta(e)
  }

  function handlePointerEnd(e) {
    onPointerMove = null
    selfRef.current.releasePointerCapture(e.pointerId)

    const val = heightToVal(e)
    sendOutFromChildren(val, props)
    //animFrame && cancelAnimationFrame(animFrame)
    isDragging.current = false
    // console.log('handlePointerEnd')
  }

  function handlePointerMove(e) {
    if (!isDragging.current) {
      return
    }
    //console.log('handlePointerMove :', { e, pointerId: e.pointerId, selfRef })
    const val = heightToVal(e)
    if (isNaN(val)) return
    sendOutFromChildren(val, props)
  }

  function onGotCapture(event) {
    //console.log('onGotCapture :', parentRectY)
    setIsActivated(true)
  }
  function onLostCapture(event) {
    // console.log('onLostCapture :', {
    //   event,
    //   pointerId: event.pointerId,
    //   selfRef
    // })
    setIsActivated(false)
  }

  function getSliderThumbStyle(y) {
    return {
      position: 'relative',
      cursor: 'pointer',
      height: props.sliderThumbHeight,
      width: '100%',
      borderRadius: 3,
      background: props.sliderEntry.colors.colorActive
        ? props.sliderEntry.colors.colorActive
        : 'goldenrod',
      top: Math.round(y - 1),
      left: 0,
      boxShadow: isActivated && '0 0 3px 3px rgb(24, 164, 157)'
    }
  }

  function heightToVal(e) {
    const tmpY = e.clientY - parentRectY.current
    if (isNaN(tmpY)) return
    const thumb = props.sliderThumbHeight / 2
    const tmpThumb = tmpY - thumb
    const tmpYy = tmpThumb < 0 ? 0 : tmpThumb
    const y = tmpYy >= props.height ? props.height : tmpYy
    const val =
      ((props.height - Math.round(y)) *
        (props.sliderEntry.maxVal - props.sliderEntry.minVal)) /
      props.height
    if (isNaN(val)) return
    return val
  }
}

MidiSlider.propTypes = {
  actions: PropTypes.object,
  entry: PropTypes.object,
  height: PropTypes.any,
  isDisabled: PropTypes.bool,
  lastFocusedPage: PropTypes.string,
  preProps: PropTypes.object,
  sliderEntry: PropTypes.object,
  sliderThumbHeight: PropTypes.any,
  val: PropTypes.any,
  width: PropTypes.any
}

const getSliderEntr = ({
  isDisabled,
  height,
  sliderThumbHeight,
  width,
  sliderEntry: {
    colors: { color },
    val,
    maxVal,
    minVal
  }
}) => ({
  isDisabled,
  height,
  sliderThumbHeight,
  width,
  colors: { color },
  val,
  maxVal,
  minVal
})
const getSliderEntry = createSelector(
  [getSliderEntr],
  ({
    isDisabled,
    height,
    sliderThumbHeight,
    width,
    colors: { color },
    val,
    maxVal,
    minVal
  }) => ({
    isDisabled,
    height,
    sliderThumbHeight,
    width,
    colors: { color },
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
    colors: { color },
    maxVal,
    minVal
  }) => ({
    isDisabled,
    height,
    sliderThumbHeight,
    width,
    colors: { color },
    maxVal,
    minVal
  })
)
function mapStateToProps(state, props) {
  return {
    lastFocusedPage: getLastFocusedPage(state),
    entry: getEntry(props),
    val: getMemVal(props)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MidiSliderActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiSlider)

function calcYFromVal({ val, height, maxVal, minVal }) {
  const y = height * (1 - val / (maxVal - minVal))
  return y
}
function sendOutFromChildren(y, props) {
  //const me = 
  props.actions.handleSliderChange({
    i: props.sliderEntry.i,
    val: parseInt(y, 10),
    lastFocusedPage: props.lastFocusedPage
  })
  //debounce(me, 5)
}
