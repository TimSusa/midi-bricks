import React, { useRef, useState, useEffect } from 'react'
import createSelector from 'selectorator'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../../actions/slider-list.js'
import debounce from 'debounce'
//import { debounce } from 'lodash'
import { PropTypes } from 'prop-types'

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiSliderHorz)

const noop = () => {}

function MidiSliderHorz(props) {
  const [isActivated, setIsActivated] = useState(false)
  let selfRef = useRef(null)
  let parentRectX = useRef(null)
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
        width: width + sliderThumbHeight,
        borderRadius: 3,
        background: color ? color : 'aliceblue',
        boxShadow: isActivated && '0 0 3px 3px rgb(24, 164, 157)',
        transform: 'scale(-1, 1)'
      }}
    >
      <div
        style={getSliderThumbStyle(
          calcXFromVal({
            val,
            width,
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

    // Should be set before calling widthToVal()
    parentRectX.current = selfRef.current.getBoundingClientRect().left

    const val = widthToVal(e)
    send.current(val, props)
  }

  function handlePointerEnd(e) {
    onPointerMove = null
    selfRef.current.releasePointerCapture(e.pointerId)
    const val = widthToVal(e)
    send.current(val, props)
    isDragging.current = false
  }

  function handlePointerMove(e) {
    if (!isDragging.current) {
      return
    }
    const val = widthToVal(e)
    if (isNaN(val)) return
    send.current(val, props)
  }

  function onGotCapture(event) {
    setIsActivated(true)
  }
  function onLostCapture(event) {
    setIsActivated(false)
  }

  function getSliderThumbStyle(left) {
    return {
      position: 'relative',
      cursor: 'pointer',
      width: props.sliderThumbHeight,
      height: '100%',
      borderRadius: 3,
      background: props.sliderEntry.colors.colorActive
        ? props.sliderEntry.colors.colorActive
        : 'goldenrod',
      top: 0,
      left,
      boxShadow: isActivated && '0 0 3px 3px rgb(24, 164, 157)'
    }
  }

  function widthToVal(e) {
    const tmpY = e.clientX - parentRectX.current - (sliderThumbHeight / 2)
    const tmpYy = tmpY < 0 ? 0 : tmpY
    const y = tmpYy >= width ? width : tmpYy
    const val = ( y / width) * maxVal
    const nVal = val > minVal ? val : minVal
    return nVal
  }
}

MidiSliderHorz.propTypes = {
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

function calcXFromVal({ val, width, maxVal, minVal }) {
  const x = width * (1 - val / (maxVal))
  return x
}

function sendOutFromChildren(y, props) {
  return props.actions.handleSliderChange({
    i: props.sliderEntry.i,
    val: parseInt(y, 10),
    lastFocusedPage: props.lastFocusedPage
  })
}
