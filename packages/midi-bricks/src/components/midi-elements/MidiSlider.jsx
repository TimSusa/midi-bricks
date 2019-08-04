import React, { useRef, useState, useEffect } from 'react'
import createSelector from 'selectorator'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../../actions/slider-list.js'
import debounce from 'debounce'
// import { debounce } from 'lodash'
import { PropTypes } from 'prop-types'

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiSlider)

const noop = () => {}

function MidiSlider(props) {
  const [isActivated, setIsActivated] = useState(false)
  let selfRef = useRef(null)
  let parentRectY = useRef(null)
  let onPointerMove = useRef(null)
  let isDragging = useRef(false)
  let send = useRef(null)

  useEffect(() => {
    send.current = debounce(sendOutFromChildren, 3)
  }, [])

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

  function handlePointerStart(e) {
    selfRef.current.focus()
    onPointerMove.current = onPointerMove && handlePointerMove
    isDragging.current = true
    selfRef.current.setPointerCapture(e.pointerId)

    // Should be set before calling heightToVal()
    parentRectY.current = selfRef.current.getBoundingClientRect().top

    const val = heightToVal(e)
    send.current(val, props)
  }

  function handlePointerEnd(e) {
    onPointerMove = null
    selfRef.current.releasePointerCapture(e.pointerId)
    const val = heightToVal(e)
    send.current(val, props)
    isDragging.current = false
  }

  function handlePointerMove(e) {
    if (!isDragging.current) {
      return
    }
    const val = heightToVal(e)
    if (isNaN(val)) return
    send.current(val, props)
  }

  function onGotCapture(event) {
    setIsActivated(true)
  }
  function onLostCapture(event) {
    setIsActivated(false)
  }

  function getSliderThumbStyle(top) {
    return {
      position: 'relative',
      cursor: 'pointer',
      height: props.sliderThumbHeight,
      width: '100%',
      borderRadius: 3,
      background: props.sliderEntry.colors.colorActive
        ? props.sliderEntry.colors.colorActive
        : 'goldenrod',
      top,
      left: 0,
      boxShadow: isActivated && '0 0 3px 3px rgb(24, 164, 157)'
    }
  }

  function heightToVal(e) {
    const tmpY = e.clientY - parentRectY.current
    const tmpYy = tmpY < 0 ? 0 : tmpY
    const y = tmpYy >= height ? height : tmpYy
    const val = ( 1 - y / height) * maxVal
    const nVal = (val > minVal) ? val : minVal
    return nVal
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

function calcYFromVal({ val, height, maxVal, minVal }) {
  const y = height * (1 - val / (maxVal - minVal))
  return y
}
function sendOutFromChildren(y, props) {
  return props.actions.handleSliderChange({
    i: props.sliderEntry.i,
    val: parseInt(y, 10),
    lastFocusedPage: props.lastFocusedPage
  })
}
