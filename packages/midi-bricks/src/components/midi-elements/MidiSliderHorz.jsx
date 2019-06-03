import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions as MidiSliderActions } from '../../actions/slider-list.js'
import { PropTypes } from 'prop-types'

const noop = () => {}

class MidiSliderHorz extends Component {
  selfRef = null
  onPointerMove = null
  constructor(props) {
    super(props)
    this.selfRef = React.createRef()
    this.state = {
      isActivated: false
    }
  }

  render() {
    const {
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
    } = this.props
    return (
      <div
        onContextMenu={(e) => {
          e.preventDefault()
          e.stopPropagation()
          return false
        }}
        ref={this.selfRef}
        onPointerDown={isDisabled ? noop : this.handlePointerStart}
        onPointerMove={isDisabled ? noop : this.onPointerMove}
        onPointerUp={isDisabled ? noop : this.handlePointerEnd}
        style={{
          height: height + sliderThumbHeight,
          width: width + sliderThumbHeight,
          borderRadius: 3,
          background: color ? color : 'aliceblue',
          boxShadow: this.state.isActivated && '0 0 3px 3px rgb(24, 164, 157)'
        }}
      >
        <div
          style={this.getSliderThumbStyle(
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
  }

  handlePointerStart = (e) => {
    this.onPointerMove = this.handlePointerMove
    window.requestAnimationFrame(this.onPointerMove)
    this.selfRef.current.setPointerCapture(e.pointerId)

    const val = this.positionToValue(e)
    this.sendOutFromChildren(val)
    this.setState({ isActivated: true })
  }

  handlePointerEnd = (e) => {
    this.onPointerMove = null
    this.selfRef.current.releasePointerCapture(e.pointerId)

    const val = this.positionToValue(e)
    this.sendOutFromChildren(val)
    this.setState({ isActivated: false })
  }

  handlePointerMove = (e) => {
    const val = this.positionToValue(e)
    if (isNaN(val)) return
    this.sendOutFromChildren(val)
  }

  sendOutFromChildren = (y) => {
    this.props.actions.handleSliderChange({
      i: this.props.sliderEntry.i,
      val: parseInt(y, 10),
      lastFocusedPage: this.props.lastFocusedPage
    })
  }

  getSliderThumbStyle = (x) => {
    return {
      position: 'relative',
      cursor: 'pointer',
      width: this.props.sliderThumbHeight,
      height: '100%',
      borderRadius: 3,
      background: this.props.sliderEntry.colors.colorActive
        ? this.props.sliderEntry.colors.colorActive
        : 'goldenrod',
      right: Math.round(x) - this.props.width,
      top: 0,
      boxShadow: this.state.isActivated && '0 0 3px 3px rgb(24, 164, 157)'
    }
  }

  positionToValue(e) {
    const parentRect = this.selfRef.current.getBoundingClientRect()
    const tmpY = e.clientX - parentRect.x
    const thumb = this.props.sliderThumbHeight / 2
    const tmpThumb = tmpY - thumb
    const tmpYy = tmpThumb < 0 ? 0 : tmpThumb
    const x = tmpYy >= this.props.width ? this.props.width : tmpYy
    const val =
      (Math.round(x) * this.props.sliderEntry.maxVal) / this.props.width
    if (isNaN(val)) return
    return val > this.props.sliderEntry.minVal
      ? val
      : this.props.sliderEntry.minVal
  }
}

MidiSliderHorz.propTypes = {
  actions: PropTypes.any,
  height: PropTypes.any,
  isDisabled: PropTypes.any,
  lastFocusedPage: PropTypes.any,
  sliderEntry: PropTypes.any,
  sliderThumbHeight: PropTypes.any,
  width: PropTypes.any
}

function mapStateToProps({ viewSettings: { lastFocusedPage }} ) {
  return {
    lastFocusedPage,
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
)(MidiSliderHorz)

function calcXFromVal({ val, width, maxVal, minVal }) {
  const x = width * (1 - (val - 0) / (maxVal - 0))
  return x
}
